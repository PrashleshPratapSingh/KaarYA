/**
 * Firebase Auth Helpers -> Clerk Firestore Sync
 * Since pivoting to Clerk for Auth, this file now solely bridges Clerk Auth to our 
 * Firestore user profiles to keep database relationships (gigs -> users) intact.
 */
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { AppUser } from '../app/context/AuthContext';

/**
 * Create user profile in Firestore if it doesn't exist.
 * Called automatically by AuthContext when a Clerk user logs in.
 */
export async function ensureUserProfile(user: AppUser): Promise<void> {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        await setDoc(userRef, {
            phone: user.phone ?? '',
            name: user.name ?? '',
            email: user.email ?? '',
            role: 'doer',
            university: '',
            avatar_url: user.avatarUrl ?? '',
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


