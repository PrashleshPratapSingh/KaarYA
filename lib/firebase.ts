/**
 * Firebase Configuration & Initialization
 * Central hub for all Firebase services used in KaarYA.
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase config from environment variables
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID!,
    measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

// Initialize Firebase (prevent re-init on hot reload)
let app;
let db;

if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    // Firestore database with long polling for Expo issues
    db = initializeFirestore(app, {
        experimentalForceLongPolling: true,
    });
} else {
    app = getApp();
    db = getFirestore(app);
}

// Cloud Storage
const storage = getStorage(app);

export { app, db, storage };
