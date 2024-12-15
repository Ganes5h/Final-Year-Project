// public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js"
);

// Initialize Firebase app
firebase.initializeApp({
  apiKey: "AIzaSyCvx0k12jyTIBpCvLaqCIWdgbSe9B-MhAY",
  authDomain: "final-year-project-9be57.firebaseapp.com",
  projectId: "final-year-project-9be57",
  storageBucket: "final-year-project-9be57.firebasestorage.app",
  messagingSenderId: "552969132319",
  appId: "1:552969132319:web:4579bef122fde522b0f82a",
  measurementId: "G-F8CJ277PKW",
});

// Retrieve Firebase Messaging object
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);

  // Customize notification
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || "/favicon.ico",
  };

  // Show the notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});
