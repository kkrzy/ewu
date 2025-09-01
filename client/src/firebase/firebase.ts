// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCu3fLKLhy8d6lnFo6tLtf9IOYj595ByZQ",
  authDomain: "paw-ewu.firebaseapp.com",
  projectId: "paw-ewu",
  storageBucket: "paw-ewu.firebasestorage.app",
  messagingSenderId: "724174130749",
  appId: "1:724174130749:web:abbbb3b6a39643a76d6454",
  measurementId: "G-QH9P8QWFLX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };

