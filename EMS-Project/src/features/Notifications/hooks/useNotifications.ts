import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "../../../config/firebase";
import { useAuthStore } from "../../../store/AuthStore";
import { notificationsApi } from "../api/notificationsApi";
import type { FetchNotificationsParams } from "../types/notificationsType";

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

// Mark single notification as read
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEYS.all });
    },
  });
}

// Mark all as read
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEYS.all });
    },
  });
}

// Delete notification
export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.deleteNotification(id),
    onSuccess: () => {
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
