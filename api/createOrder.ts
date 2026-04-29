// Vercel Serverless Function — POST /api/createOrder
// Creates a Razorpay order and records it in Firestore.
// Env vars needed in Vercel dashboard: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET,
// + all EXPO_PUBLIC_FIREBASE_* vars for Firestore access.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import Razorpay from 'razorpay';

// Lazy-init Firebase Admin (only once per cold start)
function getDb() {
    if (!getApps().length) {
        initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        });
    }
    return getFirestore();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS for native app requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { amount, gigId, clientId, executorId } = req.body ?? {};

        if (!amount || Number(amount) <= 0) {
            return res.status(400).json({ error: 'Valid amount (in rupees) is required' });
        }

        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            return res.status(500).json({ error: 'Razorpay keys not configured on server' });
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
                gigId: gigId ?? '',
                clientId: clientId ?? '',
                executorId: executorId ?? '',
            },
        });

        // Record the pending order in Firestore (best-effort)
        if (gigId) {
            try {
                const db = getDb();
                await db.collection('orders').doc(order.id).set({
                    orderId: order.id,
                    gigId,
                    clientId: clientId ?? null,
                    executorId: executorId ?? null,
                    amount: order.amount,
                    currency: order.currency,
                    status: 'created',
                    createdAt: FieldValue.serverTimestamp(),
                });
            } catch (dbErr) {
                // Non-fatal — order still succeeds even if DB write fails
                console.error('Firestore write failed:', dbErr);
            }
        }

        return res.status(200).json(order);
    } catch (error: any) {
        console.error('createOrder error:', error);
        return res.status(500).json({ error: 'Failed to create order', details: error?.message });
    }
}
