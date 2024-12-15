// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
