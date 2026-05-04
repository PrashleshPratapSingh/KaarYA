import { createHmac } from 'crypto';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Lazy-init Firebase Admin
function getDb() {
    if (!getApps().length) {
        if (!process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
            console.warn('⚠️ Missing FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY in .env. Firestore Admin skipped.');
            return null;
        }

        initializeApp({
            credential: cert({
                projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        });
    }
    return getFirestore();
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, gigId } = body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return Response.json(
                { error: 'Missing payment verification fields' },
                { status: 400 }
            );
        }

        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!keySecret) {
            return Response.json(
                { error: 'Razorpay secret not configured on server. Ensure RAZORPAY_KEY_SECRET is set.' },
                { status: 500 }
            );
        }

        // Verify HMAC signature
        const expectedSignature = createHmac('sha256', keySecret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return Response.json(
                { error: 'Payment signature verification failed' },
                { status: 400 }
            );
        }

        // Update Firestore securely using Admin SDK
        try {
            const db = getDb();
            if (db) {
                const batch = db.batch();

                // Update order record
                const orderRef = db.collection('orders').doc(razorpay_order_id);
                batch.update(orderRef, {
                    paymentId: razorpay_payment_id,
                    status: 'paid',
                    paidAt: FieldValue.serverTimestamp(),
                });

                // Update gig escrow status
                if (gigId) {
                    const gigRef = db.collection('gigs').doc(gigId);
                    batch.update(gigRef, {
                        escrow_funded: true,
                        payment_id: razorpay_payment_id,
                        order_id: razorpay_order_id,
                        status: 'in_progress',
                        funded_at: FieldValue.serverTimestamp(),
                    });
                }

                await batch.commit();
            }
        } catch (dbErr) {
            console.error('Firestore update failed:', dbErr);
            // Still return success since payment was verified by Razorpay
        }

        return Response.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error('verifyPayment error:', error);
        return Response.json(
            { error: 'Payment verification failed', details: error?.message },
            { status: 500 }
        );
    }
}
