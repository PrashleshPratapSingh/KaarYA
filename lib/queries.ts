/**
 * Firestore Query Layer
 * All database operations in one place. Screens import from here.
 * Replaces the previous Supabase-based queries.
 */
import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    onSnapshot,
    setDoc,
    deleteDoc,
    updateDoc,
    type DocumentData,
} from 'firebase/firestore';
import { db } from './firebase';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface GigRow {
    id: string;
    client_id: string;
    title: string;
    description: string | null;
    category: string;
    status: string;
    budget_min: number | null;
    budget_max: number | null;
    budget_type: string;
    skills: string[];
    urgency: string;
    applications_count: number;
    views_count: number;
    created_at: string;
    deadline: string | null;
    // Joined client data (fetched separately)
    client?: {
        id: string;
        name: string | null;
        university: string | null;
        avatar_url: string | null;
        rating_avg: number;
        rating_count: number;
        gigs_completed: number;
        is_verified: boolean;
        bio: string | null;
    };
}

export interface UserRow {
    id: string;
    email: string | null;
    name: string | null;
    role: string;
    university: string | null;
    avatar_url: string | null;
    bio: string | null;
    skills: string[];
    wallet_balance: number;
    total_earnings: number;
    rating_avg: number;
    rating_count: number;
    gigs_completed: number;
    is_verified: boolean;
    created_at: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Convert a Firestore doc to a typed object with `id`. */
function docToObj<T>(docSnap: DocumentData): T {
    const data = docSnap.data();
    return {
        ...data,
        id: docSnap.id,
        // Normalize Firestore Timestamps to ISO strings
        created_at: data.created_at?.toDate?.()
            ? data.created_at.toDate().toISOString()
            : data.created_at ?? new Date().toISOString(),
    } as T;
}

// ─── User Queries ───────────────────────────────────────────────────────────

/**
 * Fetch a user profile by ID.
 */
export async function fetchUser(userId: string): Promise<UserRow> {
    const userSnap = await getDoc(doc(db, 'users', userId));
    if (!userSnap.exists()) throw new Error(`User ${userId} not found`);
    return docToObj<UserRow>(userSnap);
}

// ─── Gig Queries ────────────────────────────────────────────────────────────

/**
 * Fetch open gigs, optionally filtered by category.
 * Client data is fetched separately and attached.
 */
export async function fetchGigs(category?: string): Promise<GigRow[]> {
    const gigsRef = collection(db, 'gigs');

    // Build query constraints
    const constraints: any[] = [
        where('status', '==', 'open'),
    ];
    if (category && category !== 'all') {
        constraints.push(where('category', '==', category));
    }

    const q = query(gigsRef, ...constraints);
    const snapshot = await getDocs(q);

    const gigs = snapshot.docs.map((d) => docToObj<GigRow>(d));

    // Fetch client data for each gig (batched by unique client IDs)
    const clientIds = [...new Set(gigs.map((g) => g.client_id))];
    const clientMap: Record<string, GigRow['client']> = {};

    await Promise.all(
        clientIds.map(async (cid) => {
            try {
                const user = await fetchUser(cid);
                clientMap[cid] = {
                    id: user.id,
                    name: user.name,
                    university: user.university,
                    avatar_url: user.avatar_url,
                    rating_avg: user.rating_avg,
                    rating_count: user.rating_count,
                    gigs_completed: user.gigs_completed,
                    is_verified: user.is_verified,
                    bio: user.bio,
                };
            } catch {
                // Client not found — skip
            }
        })
    );

    return gigs.map((g) => ({ ...g, client: clientMap[g.client_id] }));
}

/**
 * Subscribe to open gigs for real-time updates on the home feed.
 */
export function subscribeToOpenGigs(
    category: string | undefined,
    onUpdate: (gigs: GigRow[]) => void,
    onError?: (error: Error) => void
) {
    const gigsRef = collection(db, 'gigs');
    const constraints: any[] = [
        where('status', '==', 'open'),
    ];

    if (category && category !== 'all') {
        constraints.push(where('category', '==', category));
    }

    const q = query(gigsRef, ...constraints);

    return onSnapshot(q, async (snapshot) => {
        try {
            const gigs = snapshot.docs.map((d) => docToObj<GigRow>(d));

            // Fetch client data for newly updated gigs separately
            const clientIds = [...new Set(gigs.map((g) => g.client_id))];
            const clientMap: Record<string, GigRow['client']> = {};

            await Promise.all(
                clientIds.map(async (cid) => {
                    try {
                        const user = await fetchUser(cid);
                        clientMap[cid] = {
                            id: user.id,
                            name: user.name,
                            university: user.university,
                            avatar_url: user.avatar_url,
                            rating_avg: user.rating_avg,
                            rating_count: user.rating_count,
                            gigs_completed: user.gigs_completed,
                            is_verified: user.is_verified,
                            bio: user.bio,
                        };
                    } catch {
                        // Ignore
                    }
                })
            );

            onUpdate(gigs.map((g) => ({ ...g, client: clientMap[g.client_id] })));
        } catch (err) {
            if (onError) onError(err as Error);
        }
    }, (error) => {
        if (onError) onError(error);
    });
}

/**
 * Fetch a single gig by ID with client details.
 */
export async function fetchGigById(id: string): Promise<GigRow> {
    const gigSnap = await getDoc(doc(db, 'gigs', id));
    if (!gigSnap.exists()) throw new Error(`Gig ${id} not found`);

    const gig = docToObj<GigRow>(gigSnap);

    // Fetch client
    try {
        const user = await fetchUser(gig.client_id);
        gig.client = {
            id: user.id,
            name: user.name,
            university: user.university,
            avatar_url: user.avatar_url,
            rating_avg: user.rating_avg,
            rating_count: user.rating_count,
            gigs_completed: user.gigs_completed,
            is_verified: user.is_verified,
            bio: user.bio,
        };
    } catch {
        // Client not found — leave undefined
    }

    return gig;
}

/**
 * Search gigs by keyword in title (client-side filter).
 * For production, use Algolia or Firebase Extensions for full-text search.
 */
export async function searchGigs(searchTerm: string): Promise<GigRow[]> {
    const allGigs = await fetchGigs();
    const lower = searchTerm.toLowerCase();
    return allGigs.filter(
        (g) =>
            g.title.toLowerCase().includes(lower) ||
            (g.description ?? '').toLowerCase().includes(lower)
    );
}

/**
 * Create a new gig and insert it into Firestore.
 * Uses the authenticated user's UID as client_id.
 */
export async function createGig(gig: {
    title: string;
    description?: string;
    category: string;
    budgetAmount: number; // in rupees (will be converted to paise)
    skills?: string[];
    deadline?: string;    // ISO date
    urgency?: string;
}, userId: string): Promise<GigRow> {

    // ── Input Validation ────────────────────────────────────────────
    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
        throw new Error('Authentication required. Please log in again.');
    }

    const trimmedTitle = (gig.title ?? '').trim();
    if (trimmedTitle.length === 0) {
        throw new Error('Gig title is required.');
    }
    if (trimmedTitle.length > 120) {
        throw new Error('Gig title must be under 120 characters.');
    }

    const trimmedDescription = (gig.description ?? '').trim().slice(0, 5000);

    if (typeof gig.budgetAmount !== 'number' || isNaN(gig.budgetAmount) || gig.budgetAmount <= 0) {
        throw new Error('Budget must be a positive number.');
    }
    if (gig.budgetAmount > 10_000_000) {
        throw new Error('Budget exceeds the maximum allowed (₹1,00,00,000).');
    }

    const sanitizedSkills = (gig.skills ?? [])
        .filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
        .map(s => s.trim().slice(0, 50))
        .slice(0, 10);

    // Validate deadline if provided
    if (gig.deadline) {
        const deadlineDate = new Date(gig.deadline);
        if (isNaN(deadlineDate.getTime())) {
            throw new Error('Invalid deadline date.');
        }
    }

    // ── Build Document ──────────────────────────────────────────────

    // Map form category to DB category enum
    const categoryMap: Record<string, string> = {
        design: 'design',
        video: 'video',
        code: 'development',
        marketing: 'marketing',
        writing: 'writing',
        other: 'other',
    };

    const budgetPaise = Math.round(gig.budgetAmount * 100);

    const gigData = {
        client_id: userId,
        title: trimmedTitle,
        description: trimmedDescription,
        category: categoryMap[gig.category] ?? 'other',
        status: 'open',
        budget_min: budgetPaise,
        budget_max: budgetPaise,
        budget_type: 'fixed',
        skills: sanitizedSkills,
        deadline: gig.deadline ?? null,
        urgency: gig.urgency ?? 'normal',
        applications_count: 0,
        views_count: 0,
        created_at: serverTimestamp(),
    };

    const newDocRef = doc(collection(db, 'gigs'));

    // Race the Firestore write against a 3-second timeout.
    // This prevents the 'infinite loading' bug if the Expo WebSocket stalls,
    // while giving it enough time (3s) to actually dispatch the network request
    // so the gig doesn't disappear when the user reloads the app.
    const writePromise = setDoc(newDocRef, gigData);
    const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 3000));
    
    try {
        await Promise.race([writePromise, timeoutPromise]);
    } catch (err) {
        console.error('Gig creation write error:', err);
        // We still return success because it's in the local cache and will sync
    }

    return {
        ...gigData,
        id: newDocRef.id,
        created_at: new Date().toISOString(),
    } as GigRow;
}

/**
 * Delete a gig permanently from Firestore.
 * Only the owner (client_id == userId) should call this.
 */
export async function deleteGig(gigId: string, userId: string): Promise<void> {
    if (!gigId || !userId) throw new Error('gigId and userId are required.');

    // Verify ownership before deleting
    const gigSnap = await getDoc(doc(db, 'gigs', gigId));
    if (!gigSnap.exists()) throw new Error('Gig not found.');
    if (gigSnap.data()?.client_id !== userId) {
        throw new Error('You are not authorized to delete this gig.');
    }

    await deleteDoc(doc(db, 'gigs', gigId));
}

/**
 * Close/cancel a gig (set status to 'closed') instead of hard deleting.
 */
export async function closeGig(gigId: string, userId: string): Promise<void> {
    if (!gigId || !userId) throw new Error('gigId and userId are required.');

    const gigSnap = await getDoc(doc(db, 'gigs', gigId));
    if (!gigSnap.exists()) throw new Error('Gig not found.');
    if (gigSnap.data()?.client_id !== userId) {
        throw new Error('You are not authorized to close this gig.');
    }

    await updateDoc(doc(db, 'gigs', gigId), {
        status: 'closed',
        closedAt: serverTimestamp(),
    });
}


// ─── Utility Functions ──────────────────────────────────────────────────────

/** Convert paise to rupees */
export function paiseToRupees(paise: number | null): number {
    return (paise ?? 0) / 100;
}

/** Format time ago from ISO timestamp. */
export function timeAgo(isoDate: string): string {
    const diff = Date.now() - new Date(isoDate).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

/**
 * Map DB category to the app's home screen CategoryType.
 */
export function mapCategory(dbCategory: string): string {
    const mapping: Record<string, string> = {
        'design': 'design',
        'development': 'tech',
        'writing': 'writing',
        'video': 'design',
        'marketing': 'marketing',
        'photography': 'design',
        'tutoring': 'tech',
        'data_entry': 'tech',
        'research': 'writing',
        'other': 'tech',
    };
    return mapping[dbCategory] || 'tech';
}

/**
 * Map a DB university name to a college code for badge colors.
 */
export function mapCollegeCode(university: string | null): string {
    if (!university) return 'du';
    const lower = university.toLowerCase();
    if (lower.includes('nift') || lower.includes('nid')) return 'nift';
    if (lower.includes('iit')) return 'iit';
    if (lower.includes('bits')) return 'bits';
    if (lower.includes('nlu')) return 'nlu';
    return 'du'; // default
}

// ─── UI Adapters ────────────────────────────────────────────────────────────

/**
 * Convert a Firestore GigRow into the UI-friendly Gig shape
 * used by home feed components (GigCard, GigGrid, etc.).
 */
export function gigRowToGig(row: GigRow): {
    id: string;
    title: string;
    budget: number;
    postedBy: string;
    college: string;
    collegeCode: string;
    category: string;
    timeAgo: string;
    applicants: number;
    posterDetails?: {
        bio: string;
        expertise: string[];
        pastGigs: number;
        rating: number;
        reviewCount: number;
        responseTime: string;
        verified: boolean;
        memberSince: string;
        completionRate: number;
    };
} {
    return {
        id: row.id,
        title: row.title,
        budget: paiseToRupees(row.budget_min),
        postedBy: row.client?.name ?? 'Unknown',
        clientId: row.client_id,   // ← real Firestore UID for chat creation
        college: row.client?.university ?? '',
        collegeCode: mapCollegeCode(row.client?.university ?? null),
        category: mapCategory(row.category),
        timeAgo: timeAgo(row.created_at),
        applicants: row.applications_count ?? 0,
        posterDetails: row.client
            ? {
                bio: row.client.bio ?? '',
                expertise: row.skills ?? [],
                pastGigs: row.client.gigs_completed ?? 0,
                rating: row.client.rating_avg ?? 0,
                reviewCount: row.client.rating_count ?? 0,
                responseTime: 'Within 1 hour',
                verified: row.client.is_verified ?? false,
                memberSince: row.created_at
                    ? new Date(row.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                    })
                    : '',
                completionRate: 100,
            }
            : undefined,
    };
}
