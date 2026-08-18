import { initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

// Exhibitor Web App Firebase Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAmI_Q5mPnvAymRKJ-nwkRTatr8OBj1ymY",
  authDomain: "ems-mobile-192a0.firebaseapp.com",
  projectId: "ems-mobile-192a0",
  storageBucket: "ems-mobile-192a0.firebasestorage.app",
  messagingSenderId: "500422373452",
  appId: "1:500422373452:web:98aec0704f7ed0b5a5c4e9",
  measurementId: "G-9GH4SL0KVJ",
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Helper function to safely get Firebase Messaging (returns null if messaging isn't supported in browser)
export async function getFirebaseMessaging() {
  const supported = await isSupported();
  if (supported) {
    return getMessaging(app);
  }
  console.warn("Firebase Messaging is not supported in this browser environment.");
  return null;
}
