/**
 * Gig Applications — KaarYa
 * 
 * Handles the full lifecycle of a doer applying to a client's gig:
 *   1. Doer applies → creates a `gig_applications` doc
 *   2. Client reviews → fetches all applications for their gig
 *   3. Client accepts → sets executor_id on the gig, updates application status
 *   4. (Later) Client pays via Razorpay escrow
 */
import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    query,
    where,
    serverTimestamp,
    onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface GigApplication {
    id: string;
    gig_id: string;
    worker_id: string;
    status: 'pending' | 'accepted' | 'rejected';
    message?: string;
    bid_amount?: number; // optional: doer can propose their own price
    created_at: string;
    // Joined worker data (fetched separately)
    worker?: {
        name: string | null;
        university: string | null;
        avatar_url: string | null;
        skills: string[];
        rating_avg: number;
        gigs_completed: number;
        bio: string | null;
    };
}

// ─── Apply to a Gig ─────────────────────────────────────────────────────────

/**
 * A doer applies to a gig.
 * Creates a document in `gig_applications` collection.
 * Increments the gig's `applications_count`.
 */
export async function applyToGig(
    gigId: string,
    workerId: string,
    message?: string,
    bidAmount?: number
): Promise<string> {
    if (!gigId || !workerId) throw new Error('gigId and workerId are required');

    // Check if already applied
    const existing = await hasUserApplied(gigId, workerId);
    if (existing) throw new Error('You have already applied to this gig');

    // Check the gig exists and is open
    const gigSnap = await getDoc(doc(db, 'gigs', gigId));
    if (!gigSnap.exists()) throw new Error('Gig not found');
    
    const gigData = gigSnap.data();
    if (gigData.client_id === workerId) {
        throw new Error("You can't apply to your own gig");
    }
    if (gigData.status !== 'open') {
        throw new Error('This gig is no longer accepting applications');
    }

    // Create the application
    const applicationData = {
        gig_id: gigId,
        worker_id: workerId,
        status: 'pending',
        message: message || '',
        bid_amount: bidAmount || null,
        created_at: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'gig_applications'), applicationData);

    // Increment application count on the gig (best-effort)
    try {
        const currentCount = gigData.applications_count || 0;
        await updateDoc(doc(db, 'gigs', gigId), {
            applications_count: currentCount + 1,
        });
    } catch (e) {
        console.log('Failed to increment applications_count:', e);
    }

    return docRef.id;
}

// ─── Check if User Already Applied ──────────────────────────────────────────

export async function hasUserApplied(gigId: string, userId: string): Promise<boolean> {
    const q = query(
        collection(db, 'gig_applications'),
        where('gig_id', '==', gigId),
        where('worker_id', '==', userId)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
}

// ─── Fetch Applications for a Gig (Client View) ────────────────────────────

/**
 * Fetch all applications for a specific gig.
 * Joins worker profile data for display.
 */
export async function fetchApplicationsForGig(gigId: string): Promise<GigApplication[]> {
    const q = query(
        collection(db, 'gig_applications'),
        where('gig_id', '==', gigId)
    );
    const snapshot = await getDocs(q);

    const applications: GigApplication[] = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
        created_at: d.data().created_at?.toDate?.()
            ? d.data().created_at.toDate().toISOString()
            : new Date().toISOString(),
    } as GigApplication));

    // Fetch worker profiles
    const workerIds = [...new Set(applications.map(a => a.worker_id))];
    const workerMap: Record<string, GigApplication['worker']> = {};

    await Promise.all(
        workerIds.map(async (wid) => {
            try {
                const userSnap = await getDoc(doc(db, 'users', wid));
                if (userSnap.exists()) {
                    const data = userSnap.data();
                    workerMap[wid] = {
                        name: data.name || null,
                        university: data.university || null,
                        avatar_url: data.avatar_url || null,
                        skills: data.skills || [],
                        rating_avg: data.rating_avg || 0,
                        gigs_completed: data.gigs_completed || 0,
                        bio: data.bio || null,
                    };
                }
            } catch { }
        })
    );

    return applications.map(a => ({
        ...a,
        worker: workerMap[a.worker_id],
    }));
}

// ─── Subscribe to Applications (Real-time) ──────────────────────────────────

export function subscribeToApplications(
    gigId: string,
    onUpdate: (apps: GigApplication[]) => void
) {
    const q = query(
        collection(db, 'gig_applications'),
        where('gig_id', '==', gigId)
    );

    return onSnapshot(q, async (snapshot) => {
        const applications: GigApplication[] = snapshot.docs.map(d => ({
            id: d.id,
            ...d.data(),
            created_at: d.data().created_at?.toDate?.()
                ? d.data().created_at.toDate().toISOString()
                : new Date().toISOString(),
        } as GigApplication));

        // Fetch worker profiles
        const workerIds = [...new Set(applications.map(a => a.worker_id))];
        const workerMap: Record<string, GigApplication['worker']> = {};

        await Promise.all(
            workerIds.map(async (wid) => {
                try {
                    const userSnap = await getDoc(doc(db, 'users', wid));
                    if (userSnap.exists()) {
                        const data = userSnap.data();
                        workerMap[wid] = {
                            name: data.name || null,
                            university: data.university || null,
                            avatar_url: data.avatar_url || null,
                            skills: data.skills || [],
                            rating_avg: data.rating_avg || 0,
                            gigs_completed: data.gigs_completed || 0,
                            bio: data.bio || null,
                        };
                    }
                } catch { }
            })
        );

        onUpdate(applications.map(a => ({ ...a, worker: workerMap[a.worker_id] })));
    });
}

// ─── Fetch Applications by Worker (Doer's "My Applications") ────────────────

export async function fetchMyApplications(userId: string): Promise<GigApplication[]> {
    const q = query(
        collection(db, 'gig_applications'),
        where('worker_id', '==', userId)
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
        created_at: d.data().created_at?.toDate?.()
            ? d.data().created_at.toDate().toISOString()
            : new Date().toISOString(),
    } as GigApplication));
}

// ─── Accept an Application (Client Action) ──────────────────────────────────

/**
 * Client accepts a doer's application.
 * Sets the `executor_id` on the gig and moves status to 'assigned'.
 * Rejects all other pending applications.
 */
export async function acceptApplication(
    applicationId: string,
    gigId: string,
    workerId: string
): Promise<void> {
    // 1. Update the accepted application
    await updateDoc(doc(db, 'gig_applications', applicationId), {
        status: 'accepted',
    });

    // 2. Set executor on the gig
    await updateDoc(doc(db, 'gigs', gigId), {
        executor_id: workerId,
        status: 'assigned',
    });

    // 3. Reject all other pending applications for this gig
    const q = query(
        collection(db, 'gig_applications'),
        where('gig_id', '==', gigId),
        where('status', '==', 'pending')
    );
    const snapshot = await getDocs(q);

    await Promise.all(
        snapshot.docs
            .filter(d => d.id !== applicationId)
            .map(d => updateDoc(d.ref, { status: 'rejected' }))
    );
}

// ─── Reject an Application ──────────────────────────────────────────────────

export async function rejectApplication(applicationId: string): Promise<void> {
    await updateDoc(doc(db, 'gig_applications', applicationId), {
        status: 'rejected',
    });
}
