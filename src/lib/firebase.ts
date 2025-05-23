// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCiq4s8OhAcR2aMzr_7Nj0HU0l3rpqRsd8",
  authDomain: "safetywatch-bf642.firebaseapp.com",
  projectId: "safetywatch-bf642",
  storageBucket: "safetywatch-bf642.appspot.com",
  messagingSenderId: "471009241837",
  appId: "1:471009241837:web:1d5a0c72cede30d473fae4",
  measurementId: "G-CB89LKBTQR",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
