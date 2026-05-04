import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import Razorpay from 'razorpay';

// Lazy-init Firebase Admin (only once per cold start)
function getDb() {
    if (!getApps().length) {
        // Only initialize if we have the required credentials
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
        const { amount, gigId, clientId, executorId } = body;

        if (!amount || Number(amount) <= 0) {
            return Response.json(
                { error: 'Valid amount (in rupees) is required' },
                { status: 400 }
            );
        }

        const keyId = process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            return Response.json(
                { error: 'Razorpay keys not configured on server. Ensure RAZORPAY_KEY_SECRET is in your .env or Vercel config.' },
                { status: 500 }
            );
        }

        const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

        const receiptId = gigId
            ? `gig_${gigId}_${Date.now()}`
            : `receipt_${Date.now()}`;

        const order = await razorpay.orders.create({
            amount: Math.round(Number(amount) * 100), // rupees → paise
            currency: 'INR',
            receipt: receiptId,
            notes: {
                gigId: gigId || '',
                clientId: clientId || '',
                executorId: executorId || '',
            },
        });

        // Record the pending order in Firestore using Admin SDK
        if (gigId) {
            try {
                const db = getDb();
                if (db) {
                    await db.collection('orders').doc(order.id).set({
                        orderId: order.id,
                        gigId,
                        clientId: clientId || null,
                        executorId: executorId || null,
                        amount: order.amount,
                        currency: order.currency,
                        status: 'created',
                        createdAt: FieldValue.serverTimestamp(),
                    });
                }
            } catch (dbErr) {
                console.error('Firestore write failed:', dbErr);
            }
        }

        return Response.json(order, { status: 200 });
    } catch (error: any) {
        console.error('createOrder error:', error);
        return Response.json(
            { error: 'Failed to create order', details: error?.message },
            { status: 500 }
        );
    }
}
