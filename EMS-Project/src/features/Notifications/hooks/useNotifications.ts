import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "../../../config/firebase";
import { useAuthStore } from "../../../store/AuthStore";
import { notificationsApi } from "../api/notificationsApi";
import type {
  FetchNotificationsParams,
  NotificationItem,
} from "../types/notificationsType";

export const NOTIFICATIONS_KEYS = {
  all: ["notifications"] as const,
  list: (params?: FetchNotificationsParams) => ["notifications", "list", params] as const,
  unread: (params?: FetchNotificationsParams) => ["notifications", "unread", params] as const,
  count: ["notifications", "unread-count"] as const,
  stats: ["notifications", "stats"] as const,
};

// Fetch notifications list
export function useNotifications(params?: FetchNotificationsParams, isUnreadOnly?: boolean) {
  return useQuery({
    queryKey: isUnreadOnly ? NOTIFICATIONS_KEYS.unread(params) : NOTIFICATIONS_KEYS.list(params),
    queryFn: () =>
      isUnreadOnly
        ? notificationsApi.getUnreadNotifications(params)
        : notificationsApi.getNotifications(params),
    staleTime: 15000,
  });
}

// Fetch unread count for badge
export function useUnreadNotificationsCount() {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: NOTIFICATIONS_KEYS.count,
    queryFn: () => notificationsApi.getUnreadCount(),
    enabled: Boolean(token),
    refetchInterval: 30000, // Poll every 30s
    staleTime: 10000,
  });
}

// Fetch statistics
export function useNotificationStats() {
  return useQuery({
    queryKey: NOTIFICATIONS_KEYS.stats,
    queryFn: () => notificationsApi.getStatistics(),
    staleTime: 15000,
  });
}

type QueryCacheData = {
  data?: {
    data?: NotificationItem[];
    total?: number;
    numberOfUnreadNotifications?: number;
    total_notifications?: number;
  };
};

// Mark single notification as read
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEYS.all });

      const previousQueries = queryClient.getQueriesData<unknown>({
        queryKey: NOTIFICATIONS_KEYS.all,
      });

      const nowIso = new Date().toISOString();

      queryClient.setQueriesData<unknown>(
        { queryKey: NOTIFICATIONS_KEYS.all },
        (oldData: unknown) => {
          if (!oldData || typeof oldData !== "object") return oldData;
          const cacheData = oldData as QueryCacheData;

          if (cacheData.data?.data && Array.isArray(cacheData.data.data)) {
            const updatedItems = cacheData.data.data.map((item) => {
              if (item.id === id) {
                return { ...item, read_at: item.read_at || nowIso };
              }
              return item;
            });

            return {
              ...cacheData,
              data: {
                ...cacheData.data,
                data: updatedItems,
              },
            };
          }

          if (typeof cacheData.data?.numberOfUnreadNotifications === "number") {
            return {
              ...cacheData,
              data: {
                ...cacheData.data,
                numberOfUnreadNotifications: Math.max(
                  0,
                  cacheData.data.numberOfUnreadNotifications - 1,
                ),
              },
            };
          }

          return oldData;
        },
      );

      return { previousQueries };
    },
    onError: (_err, _id, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEYS.all });
    },
  });
}

// Mark all as read
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEYS.all });
    },
  });
}

// Delete notification
export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.deleteNotification(id),
    onMutate: async (deletedId: string) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEYS.all });

      const previousQueries = queryClient.getQueriesData<unknown>({
        queryKey: NOTIFICATIONS_KEYS.all,
      });

      queryClient.setQueriesData<unknown>(
        { queryKey: NOTIFICATIONS_KEYS.all },
        (oldData: unknown) => {
          if (!oldData || typeof oldData !== "object") return oldData;
          const cacheData = oldData as QueryCacheData;

          if (cacheData.data?.data && Array.isArray(cacheData.data.data)) {
            const updatedItems = cacheData.data.data.filter(
              (item) => item.id !== deletedId,
            );
            const totalDiff = cacheData.data.data.length - updatedItems.length;

            return {
              ...cacheData,
              data: {
                ...cacheData.data,
                data: updatedItems,
                total: Math.max(0, (cacheData.data.total ?? 0) - totalDiff),
              },
            };
          }

          if (typeof cacheData.data?.numberOfUnreadNotifications === "number") {
            return {
              ...cacheData,
              data: {
                ...cacheData.data,
                numberOfUnreadNotifications: Math.max(
                  0,
                  cacheData.data.numberOfUnreadNotifications - 1,
                ),
              },
            };
          }

          if (typeof cacheData.data?.total_notifications === "number") {
            return {
              ...cacheData,
              data: {
                ...cacheData.data,
                total_notifications: Math.max(
                  0,
                  cacheData.data.total_notifications - 1,
                ),
              },
            };
          }

          return oldData;
        },
      );

      return { previousQueries };
    },
    onError: (_err, _deletedId, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEYS.all });
    },
  });
}

// Hook to initialize Firebase Cloud Messaging, request permission & register token with backend
export function useFirebaseMessaging(onForegroundPush?: (title: string, body: string) => void) {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token) return;

    let unsubscribeOnMessage: (() => void) | undefined;

    async function initMessaging() {
      try {
        const messaging = await getFirebaseMessaging();
        if (!messaging) return;

        // Request browser notification permission
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          // Get FCM device token
          const fcmToken = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || undefined,
          });

          if (fcmToken) {
            // Register token with backend
            await notificationsApi.registerFcmToken({
              token: fcmToken,
              device_type: "web",
            });
          }
        }

        // Listen for foreground FCM push notifications
        unsubscribeOnMessage = onMessage(messaging, (payload) => {
          console.log("[FCM Realtime Push Received]:", payload);
          
          // Invalidate React Query notification queries to immediately refresh count and list
          queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEYS.all });

          const title = payload.notification?.title || payload.data?.title || "New Notification";
          const body = payload.notification?.body || payload.data?.body || "";

          if (onForegroundPush) {
            onForegroundPush(title, body);
          }
        });
      } catch (err) {
        console.warn("[FCM Messaging Setup Warning]:", err);
      }
    }

    initMessaging();

    return () => {
      if (unsubscribeOnMessage) {
        unsubscribeOnMessage();
      }
    };
  }, [token, queryClient, onForegroundPush]);
}
