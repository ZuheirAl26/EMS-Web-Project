import { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getToken, onMessage } from "firebase/messaging";
import logo from "../../../assets/logo.png";
import { getFirebaseMessaging } from "../../../config/firebase";
import { useAuthStore } from "../../../store/AuthStore";
import { useLanguageStore } from "../../../context/useLanguageStore";
import { notificationsApi } from "../api/notificationsApi";
import type {
  FetchNotificationsParams,
  NotificationItem,
} from "../types/notificationsType";

export const NOTIFICATIONS_KEYS = {
  all: ["notifications"] as const,
  list: (params?: FetchNotificationsParams, lang?: string) =>
    ["notifications", "list", lang, params] as const,
  unread: (params?: FetchNotificationsParams, lang?: string) =>
    ["notifications", "unread", lang, params] as const,
  count: ["notifications", "unread-count"] as const,
  stats: ["notifications", "stats"] as const,
};

// Fetch notifications list
export function useNotifications(
  params?: FetchNotificationsParams,
  isUnreadOnly?: boolean,
) {
  const token = useAuthStore((state) => state.token);
  const lang = useLanguageStore((state) => state.language);
  return useQuery({
    queryKey: isUnreadOnly
      ? NOTIFICATIONS_KEYS.unread(params, lang)
      : NOTIFICATIONS_KEYS.list(params, lang),
    queryFn: () =>
      isUnreadOnly
        ? notificationsApi.getUnreadNotifications(params)
        : notificationsApi.getNotifications(params),
    enabled: Boolean(token),
    refetchInterval: 30000, // Poll every 30s in sync with unread count
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
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
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
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
    unread_notifications?: number;
    read_notifications?: number;
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

      let wasUnread = false;
      previousQueries.forEach(([, data]) => {
        if (data && typeof data === "object") {
          const cacheData = data as QueryCacheData;
          if (cacheData.data?.data && Array.isArray(cacheData.data.data)) {
            const found = cacheData.data.data.find((item) => item.id === id);
            if (found && !found.read_at) {
              wasUnread = true;
            }
          }
        }
      });

      queryClient.setQueriesData<unknown>(
        { queryKey: NOTIFICATIONS_KEYS.all },
        (oldData: unknown) => {
          if (!oldData || typeof oldData !== "object") return oldData;
          const cacheData = oldData as QueryCacheData;

          // 1. Paginated list query
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

          // 2. Unread count query
          if (typeof cacheData.data?.numberOfUnreadNotifications === "number") {
            return {
              ...cacheData,
              data: {
                ...cacheData.data,
                numberOfUnreadNotifications: Math.max(
                  0,
                  cacheData.data.numberOfUnreadNotifications -
                    (wasUnread ? 1 : 0),
                ),
              },
            };
          }

          // 3. Stats query
          if (typeof cacheData.data?.unread_notifications === "number") {
            const unread = Math.max(
              0,
              cacheData.data.unread_notifications - (wasUnread ? 1 : 0),
            );
            const read =
              (cacheData.data.read_notifications ?? 0) + (wasUnread ? 1 : 0);

            return {
              ...cacheData,
              data: {
                ...cacheData.data,
                unread_notifications: unread,
                read_notifications: read,
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
    onMutate: async () => {
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

          // 1. Paginated list query
          if (cacheData.data?.data && Array.isArray(cacheData.data.data)) {
            const updatedItems = cacheData.data.data.map((item) => ({
              ...item,
              read_at: item.read_at || nowIso,
            }));

            return {
              ...cacheData,
              data: {
                ...cacheData.data,
                data: updatedItems,
              },
            };
          }

          // 2. Unread count query
          if (typeof cacheData.data?.numberOfUnreadNotifications === "number") {
            return {
              ...cacheData,
              data: {
                ...cacheData.data,
                numberOfUnreadNotifications: 0,
              },
            };
          }

          // 3. Stats query
          if (typeof cacheData.data?.unread_notifications === "number") {
            const unreadCount = cacheData.data.unread_notifications ?? 0;
            const readCount = cacheData.data.read_notifications ?? 0;

            return {
              ...cacheData,
              data: {
                ...cacheData.data,
                unread_notifications: 0,
                read_notifications: readCount + unreadCount,
              },
            };
          }

          return oldData;
        },
      );

      return { previousQueries };
    },
    onError: (_err, _variables, context) => {
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

      let wasUnread = false;

      previousQueries.forEach(([, data]) => {
        if (data && typeof data === "object") {
          const cacheData = data as QueryCacheData;
          if (cacheData.data?.data && Array.isArray(cacheData.data.data)) {
            const found = cacheData.data.data.find(
              (item) => item.id === deletedId,
            );
            if (found && !found.read_at) {
              wasUnread = true;
            }
          }
        }
      });

      queryClient.setQueriesData<unknown>(
        { queryKey: NOTIFICATIONS_KEYS.all },
        (oldData: unknown) => {
          if (!oldData || typeof oldData !== "object") return oldData;
          const cacheData = oldData as QueryCacheData;

          // 1. Paginated list query
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

          // 2. Unread count query
          if (typeof cacheData.data?.numberOfUnreadNotifications === "number") {
            return {
              ...cacheData,
              data: {
                ...cacheData.data,
                numberOfUnreadNotifications: Math.max(
                  0,
                  cacheData.data.numberOfUnreadNotifications -
                    (wasUnread ? 1 : 0),
                ),
              },
            };
          }

          // 3. Stats query
          if (typeof cacheData.data?.total_notifications === "number") {
            return {
              ...cacheData,
              data: {
                ...cacheData.data,
                total_notifications: Math.max(
                  0,
                  cacheData.data.total_notifications - 1,
                ),
                unread_notifications: wasUnread
                  ? Math.max(0, (cacheData.data.unread_notifications ?? 0) - 1)
                  : (cacheData.data.unread_notifications ?? 0),
                read_notifications: !wasUnread
                  ? Math.max(0, (cacheData.data.read_notifications ?? 0) - 1)
                  : (cacheData.data.read_notifications ?? 0),
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

interface CustomWindow extends Window {
  __FCM_TOKEN__?: string;
  __TEST_REALTIME_PUSH__?: (testTitle?: string, testBody?: string) => void;
}

let globalFcmRegisteredToken: string | null = null;
let globalSwRegistered = false;

export const FCM_REGISTERED_STORAGE_KEY = "ems_fcm_registered_token";

export function clearFcmRegistration() {
  globalFcmRegisteredToken = null;
  try {
    localStorage.removeItem(FCM_REGISTERED_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}

// Hook to initialize Firebase Cloud Messaging, request permission & register token with backend
export function useFirebaseMessaging(
  onForegroundPush?: (title: string, body: string) => void,
) {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const onForegroundPushRef = useRef(onForegroundPush);

  useEffect(() => {
    onForegroundPushRef.current = onForegroundPush;
  }, [onForegroundPush]);

  useEffect(() => {
    if (!token) return;

    let unsubscribeOnMessage: (() => void) | undefined;

    async function initMessaging() {
      try {
        const messaging = await getFirebaseMessaging();
        if (!messaging) {
          console.warn(
            "[FCM Warning]: Firebase Messaging is not supported in this browser.",
          );
          return;
        }

        // 1. Request browser notification permission
        let permission =
          typeof Notification !== "undefined"
            ? Notification.permission
            : "denied";

        if (permission === "default") {
          permission = await Notification.requestPermission();
        }

        if (permission !== "granted") {
          console.warn(
            `[FCM Permission Blocked]: Browser notification permission is '${permission}'. ` +
              "To unblock: Click the sliders/tune icon next to http://localhost:5173 in address bar, " +
              "change Notifications to 'Allow', then refresh the page.",
          );
          return;
        }

        // 2. Explicitly register FCM Service Worker for localhost/web
        let swRegistration: ServiceWorkerRegistration | undefined = undefined;
        if ("serviceWorker" in navigator) {
          try {
            swRegistration = await navigator.serviceWorker.register(
              "/firebase-messaging-sw.js",
            );
            await swRegistration.update();
            if (!globalSwRegistered) {
              globalSwRegistered = true;
              console.log(
                "[FCM Service Worker Registered & Updated]:",
                swRegistration,
              );
            }
          } catch (swErr) {
            console.warn("[FCM Service Worker Register Warning]:", swErr);
          }
        }

        // 3. Get FCM device token
        const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY || undefined;
        const fcmToken = await getToken(messaging, {
          vapidKey,
          serviceWorkerRegistration: swRegistration,
        });

        if (fcmToken) {
          (window as unknown as CustomWindow).__FCM_TOKEN__ = fcmToken;

          const lastRegisteredToken = (() => {
            try {
              return localStorage.getItem(FCM_REGISTERED_STORAGE_KEY);
            } catch {
              return null;
            }
          })();

          // Register token with backend ONLY IF it has not been registered yet in localStorage for this user session
          if (
            globalFcmRegisteredToken !== fcmToken &&
            lastRegisteredToken !== fcmToken
          ) {
            globalFcmRegisteredToken = fcmToken;
            console.log(
              "%c[FCM TOKEN REGISTERED]:",
              "background: #0a8782; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px; font-size: 12px;",
              fcmToken,
            );

            try {
              await notificationsApi.registerFcmToken({
                token: fcmToken,
                device_type: "web",
              });
              try {
                localStorage.setItem(FCM_REGISTERED_STORAGE_KEY, fcmToken);
              } catch {
                // Ignore storage error
              }
              console.log("[FCM Token Registered with Backend]");
            } catch (apiErr) {
              console.warn("[FCM Backend Registration Warning]:", apiErr);
            }
          }
        } else {
          console.warn("[FCM Warning]: No FCM Token returned.");
        }

        // Expose instant console test function
        (window as unknown as CustomWindow).__TEST_REALTIME_PUSH__ = (
          testTitle = "Test Notification Received",
          testBody = "Real-time push notification delivered successfully.",
        ) => {
          console.log("[Testing Realtime Push Triggered via Console]");
          queryClient.invalidateQueries({
            queryKey: NOTIFICATIONS_KEYS.all,
            refetchType: "all",
          });
          queryClient.refetchQueries({ queryKey: NOTIFICATIONS_KEYS.all });

          if (
            typeof Notification !== "undefined" &&
            Notification.permission === "granted"
          ) {
            try {
              const testDesktopNotif = new Notification(testTitle, {
                body: testBody,
                icon: logo,
              });
              setTimeout(() => {
                testDesktopNotif.close();
              }, 3000);
            } catch (err) {
              console.warn("[Native Desktop Notification Warning]:", err);
            }
          }

          if (onForegroundPushRef.current) {
            onForegroundPushRef.current(testTitle, testBody);
          }
        };

        // 4. Listen for foreground FCM push notifications
        unsubscribeOnMessage = onMessage(messaging, (payload) => {
          console.log("[FCM Realtime Push Received]:", payload);

          // Force invalidate & refetch ALL notification category queries
          queryClient.invalidateQueries({
            queryKey: NOTIFICATIONS_KEYS.all,
            refetchType: "all",
          });
          queryClient.refetchQueries({ queryKey: NOTIFICATIONS_KEYS.all });

          const title =
            payload.data?.web_notification_title ||
            payload.data?.title ||
            payload.notification?.title ||
            "New Notification";
          const body =
            payload.data?.web_notification_body ||
            payload.data?.body ||
            payload.notification?.body ||
            "";

          // Native Desktop Notification with logo.png
          if (
            typeof Notification !== "undefined" &&
            Notification.permission === "granted"
          ) {
            try {
              new Notification(title, {
                body,
                icon: "/logo.png",
                badge: "/logo.png",
              });
            } catch (desktopErr) {
              console.warn("[Desktop Notification Error]:", desktopErr);
            }
          }

          // In-App Floating Toast Banner
          if (onForegroundPushRef.current) {
            onForegroundPushRef.current(title, body);
          }
        });
      } catch (err) {
        console.error("[FCM Messaging Setup Error]:", err);
      }
    }

    initMessaging();

    return () => {
      if (unsubscribeOnMessage) {
        unsubscribeOnMessage();
      }
    };
  }, [token, queryClient]);
}
