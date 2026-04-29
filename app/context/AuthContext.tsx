/**
 * AuthContext — Global authentication state for KaarYA.
 * Wraps Firebase Auth and exposes user state + helpers.
 */
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-expo';

export interface AppUser {
    uid: string;
    email?: string;
    phone?: string;
    name?: string;
    avatarUrl?: string;
}

interface AuthContextValue {
    /** The currently signed-in user, or null */
    user: AppUser | null;
    /** True while we're still checking if a persisted session exists */
    loading: boolean;
    /** Sign out the current user */
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
    user: null,
    loading: true,
    logout: async () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const { isLoaded: isAuthLoaded, signOut } = useClerkAuth();
    const { user: clerkUser, isLoaded: isUserLoaded } = useUser();

    const [user, setUser] = useState<AppUser | null>(null);

    // Map Clerk user to our AppUser format to avoid breaking existing Firebase references
    useEffect(() => {
        if (!isUserLoaded) return;

        if (clerkUser) {
            setUser(prev => {
                if (
                    prev?.uid === clerkUser.id &&
                    prev?.name === clerkUser.fullName &&
                    prev?.avatarUrl === clerkUser.imageUrl
                ) {
                    return prev;
                }
                return {
                    uid: clerkUser.id,
                    email: clerkUser.primaryEmailAddress?.emailAddress,
                    phone: clerkUser.primaryPhoneNumber?.phoneNumber,
                    name: clerkUser.fullName || '',
                    avatarUrl: clerkUser.imageUrl,
                };
            });
        } else {
            setUser(prev => prev === null ? null : null);
        }
    }, [clerkUser, isUserLoaded]);

    const logout = async () => {
        await signOut();
        setUser(null);
    };

    // Keep loading=true until:
    // 1. Clerk SDK has finished loading (isAuthLoaded && isUserLoaded)
    // 2. AND if there IS a clerkUser, our user state is also synced (not null).
    //    Without this check there's a 1-frame gap where loading=false but user=null,
    //    which incorrectly triggers the "not logged in → go to onboarding" redirect.
    const isSyncing = isUserLoaded && !!clerkUser && user === null;

    return (
        <AuthContext.Provider value={{ user, loading: !isAuthLoaded || !isUserLoaded || isSyncing, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Hook to access auth state from any component.
 * 
 * Usage:
 * ```tsx
 * const { user, loading, logout } = useAuth();
 * ```
 */
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
}
