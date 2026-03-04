/**
 * Firebase Auth Helpers
 * Wraps Firebase Auth methods for use throughout the app.
 */
import {
    signInWithPhoneNumber,
    PhoneAuthProvider,
    signInWithCredential,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged as firebaseOnAuthStateChanged,
    type User,
    type ConfirmationResult,
    ApplicationVerifier,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

// ─── Phone OTP ──────────────────────────────────────────────────────────────

/**
 * Send OTP to a phone number.
 * Returns a ConfirmationResult used to verify the code.
 * 
 * @param phoneNumber - Full phone number with country code (e.g. "+919999999999")
 * @param appVerifier - reCAPTCHA verifier instance (from RecaptchaVerifier)
 */
export async function sendOtp(
    phoneNumber: string,
    appVerifier: ApplicationVerifier
): Promise<ConfirmationResult> {
    return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
}

/**
 * Verify the OTP code.
 * On success, the user is signed in and their profile is created/updated in Firestore.
 * 
 * @param confirmationResult - returned from sendOtp
 * @param code - the 6-digit OTP code
 */
export async function verifyOtp(
    confirmationResult: ConfirmationResult,
    code: string
): Promise<User> {
    const result = await confirmationResult.confirm(code);
    const user = result.user;

    // Ensure user profile exists in Firestore
    await ensureUserProfile(user);

    return user;
}

// ─── User Profile ───────────────────────────────────────────────────────────

/**
 * Create user profile in Firestore if it doesn't exist.
 * Called after first sign-in.
 */
export async function ensureUserProfile(user: User): Promise<void> {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        await setDoc(userRef, {
            phone: user.phoneNumber ?? '',
            name: '',
            email: '',
            role: 'doer',
            university: '',
            avatar_url: '',
            bio: '',
            skills: [],
            wallet_balance: 0,
            total_earnings: 0,
            rating_avg: 0,
            rating_count: 0,
            gigs_completed: 0,
            is_verified: true,
            created_at: serverTimestamp(),
        });
    }
}

/**
 * Update user profile fields in Firestore.
 */
export async function updateUserProfile(
    userId: string,
    data: Record<string, any>
): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, data, { merge: true });
}

// ─── Google Sign-In ─────────────────────────────────────────────────────────

/**
 * Sign in with a Google ID token.
 *
 * HOW IT WORKS:
 * 1. The app opens a Google login page (via expo-auth-session)
 * 2. User picks their Google account → Google gives us an "ID token"
 * 3. We pass that token HERE → Firebase verifies it with Google
 * 4. Firebase creates (or finds) the user in its Auth system
 * 5. We create a Firestore profile doc if it's their first login
 *
 * @param idToken - The Google ID token from expo-auth-session
 */
export async function signInWithGoogle(idToken: string): Promise<User> {
    // Step 1: Create a Firebase credential from Google's ID token
    // Think of this as wrapping the "Google ID card" in a format Firebase understands
    const credential = GoogleAuthProvider.credential(idToken);

    // Step 2: Sign in to Firebase with that credential
    // Firebase talks to Google behind the scenes to verify the token is legit
    const result = await signInWithCredential(auth, credential);
    const user = result.user;

    // Step 3: Create a Firestore profile if this is the user's first time
    // ensureUserProfile checks if a doc exists — if not, creates one
    await ensureUserProfile(user);

    return user;
}

// ─── Session ────────────────────────────────────────────────────────────────

/**
 * Sign out the current user.
 */
export async function signOutUser(): Promise<void> {
    return signOut(auth);
}

/**
 * Get the current user (or null).
 */
export function getCurrentUser(): User | null {
    return auth.currentUser;
}

/**
 * Get the current user's UID.
 * Throws if not authenticated.
 */
export function requireAuth(): string {
    const user = auth.currentUser;
    if (!user) throw new Error('User is not authenticated');
    return user.uid;
}

/**
 * Subscribe to auth state changes.
 */
export function onAuthChange(callback: (user: User | null) => void) {
    return firebaseOnAuthStateChanged(auth, callback);
}
