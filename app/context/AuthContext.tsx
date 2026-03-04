/**
 * AuthContext — Global authentication state for KaarYA.
 * Wraps Firebase Auth and exposes user state + helpers.
 */
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { type User } from 'firebase/auth';
import { onAuthChange, signOutUser } from '../../lib/auth';

interface AuthContextValue {
    /** The currently signed-in Firebase user, or null */
    user: User | null;
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
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthChange((firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const logout = async () => {
        await signOutUser();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
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
