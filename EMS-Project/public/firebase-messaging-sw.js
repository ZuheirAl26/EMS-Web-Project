// Firebase Messaging Service Worker for background notifications
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyAmI_Q5mPnvAymRKJ-nwkRTatr8OBj1ymY",
  authDomain: "ems-mobile-192a0.firebaseapp.com",
  projectId: "ems-mobile-192a0",
  storageBucket: "ems-mobile-192a0.firebasestorage.app",
  messagingSenderId: "500422373452",
  appId: "1:500422373452:web:98aec0704f7ed0b5a5c4e9",
  measurementId: "G-9GH4SL0KVJ",
});

const messaging = firebase.messaging();

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message: ",
    payload,
  );

  const notificationTitle =
    payload.data?.web_notification_title ||
    payload.data?.title ||
    payload.notification?.title ||
    "Notification";

  const notificationBody =
    payload.data?.web_notification_body ||
    payload.data?.body ||
    payload.notification?.body ||
    "";

  const notificationOptions = {
    body: notificationBody,
    icon: payload.data?.icon || payload.notification?.icon || "/logo.png",
    badge: "/assets/logo.png",
    data: payload.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url && "focus" in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow("/dashboard/notifications");
        }
      }),
  );
});
