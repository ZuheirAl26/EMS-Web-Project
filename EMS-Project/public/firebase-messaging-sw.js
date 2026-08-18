// Firebase Messaging Service Worker for background notifications
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

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

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message: ', payload);
  const notificationTitle = payload.notification?.title || payload.data?.title || 'Notification';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || '',
    icon: '/src/assets/logo.png',
    data: payload.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
