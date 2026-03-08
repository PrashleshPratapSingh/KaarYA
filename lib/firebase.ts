/**
 * Firebase Configuration & Initialization
 * Central hub for all Firebase services used in KaarYA.
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// Removed: firebase/auth and AsyncStorage since Clerk handles auth now

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBVEgYBH1CiL6GGjvC7wANNl52fOn9YreY",
    authDomain: "kaarya-62054.firebaseapp.com",
    projectId: "kaarya-62054",
    storageBucket: "kaarya-62054.firebasestorage.app",
    messagingSenderId: "988879482778",
    appId: "1:988879482778:web:8e1af417b1a88390299423"
};

// Initialize Firebase (prevent re-init on hot reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Removed Auth initialization

// Firestore database
const db = getFirestore(app);

// Cloud Storage
const storage = getStorage(app);

export { app, db, storage };
