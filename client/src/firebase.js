// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ecodeed-blog.firebaseapp.com",
  projectId: "ecodeed-blog",
  storageBucket: "ecodeed-blog.firebasestorage.app",
  messagingSenderId: "55287264011",
  appId: "1:55287264011:web:fc07a8a36885936396680e",
  measurementId: "G-XGVE8MGWW3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
