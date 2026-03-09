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
    apiKey: "AIzaSyD-Nkg1YkXtk1vnge9miPBfAnkNerHdOYY",
    authDomain: "kaarya-3870a.firebaseapp.com",
    projectId: "kaarya-3870a",
    storageBucket: "kaarya-3870a.firebasestorage.app",
    messagingSenderId: "308294112513",
    appId: "1:308294112513:web:8d07cde6ae2f894eff7700",
    measurementId: "G-T3RXFM2G0H"
};

// Initialize Firebase (prevent re-init on hot reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Removed Auth initialization

// Firestore database
const db = getFirestore(app);

// Cloud Storage
const storage = getStorage(app);

export { app, db, storage };
