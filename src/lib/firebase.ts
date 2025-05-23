// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBgcY8832ucdjVYRxWMY3U4nId8K8lf9hQ",
  authDomain: "crimereport-ea80e.firebaseapp.com",
  projectId: "crimereport-ea80e",
  storageBucket: "crimereport-ea80e.appspot.com", // Fixed the storage bucket URL
  messagingSenderId: "1026605655619",
  appId: "1:1026605655619:web:6773be5bc2b4e3433e16f6",
  measurementId: "G-CRGHS027V9",
};

// Initialize Firebase
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
