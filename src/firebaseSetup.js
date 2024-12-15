import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import axios from "axios";

const firebaseConfig = {
  apiKey: "AIzaSyCvx0k12jyTIBpCvLaqCIWdgbSe9B-MhAY",
  authDomain: "final-year-project-9be57.firebaseapp.com",
  projectId: "final-year-project-9be57",
  storageBucket: "final-year-project-9be57.firebasestorage.app",
  messagingSenderId: "552969132319",
  appId: "1:552969132319:web:4579bef122fde522b0f82a",
  measurementId: "G-F8CJ277PKW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Request permission and get token
export const requestNotificationPermission = async () => {
  try {
    // Request notification permission
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey:
          "BAGRHCbZLi9WGdM7DYuYdTnbZd4-SHP_AKlPlJChUJqG_9IS_vuVdnpuyqgR-x7Y-Cxe6qrFEArV1U9AJV3Y6ck", // Replace with your actual VAPID key
      });

      console.log("FCM Token:", token);

      // Send token to backend
      await axios.post(
        "http://localhost:4000/api/notifications/save-fcm-token",
        { fcmToken: token }
      );
    } else {
      console.warn("Notification permission denied.");
    }
  } catch (error) {
    console.error("Notification permission error:", error);
  }
};

// Handle incoming messages when app is in the foreground
export const handleIncomingMessages = () => {
  onMessage(messaging, (payload) => {
    console.log("Received foreground message:", payload);

    // Create browser notification
    if (Notification.permission === "granted") {
      new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: payload.notification.icon || "/favicon.ico",
      });
    }
  });
};

// Function to continuously check and refresh token
export const refreshToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey:
        "BAGRHCbZLi9WGdM7DYuYdTnbZd4-SHP_AKlPlJChUJqG_9IS_vuVdnpuyqgR-x7Y-Cxe6qrFEArV1U9AJV3Y6ck",
    });
    console.log("Updated token:", token);

    // Send updated token to backend
    await axios.post("http://localhost:4000/api/notifications/save-fcm-token", {
      fcmToken: token,
    });
  } catch (error) {
    console.error("Failed to refresh token:", error);
  }
};

export { app, messaging };
