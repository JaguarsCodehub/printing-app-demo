
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyBxlDr1f9asq2P4yjjn_frGm6EAJ0ZXagg",
  authDomain: "printing-mvp.firebaseapp.com",
  projectId: "printing-mvp",
  storageBucket: "printing-mvp.firebasestorage.app",
  messagingSenderId: "22412447679",
  appId: "1:22412447679:web:884d06a8002c0ac038db0a"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
