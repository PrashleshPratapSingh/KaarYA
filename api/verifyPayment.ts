// Vercel Serverless Function — POST /api/verifyPayment
// Verifies Razorpay payment signature and updates the order/gig status in Firestore.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHmac } from 'crypto';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

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
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, gigId } = req.body ?? {};

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ error: 'Missing payment verification fields' });
        }

        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!keySecret) {
            return res.status(500).json({ error: 'Razorpay secret not configured' });
        }

        // Verify HMAC signature
        const expectedSignature = createHmac('sha256', keySecret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ error: 'Payment signature verification failed' });
        }

        // Update Firestore
        try {
            const db = getDb();
            const batch = db.batch();

            // Update order record
            const orderRef = db.collection('orders').doc(razorpay_order_id);
            batch.update(orderRef, {
                paymentId: razorpay_payment_id,
                status: 'paid',
                paidAt: FieldValue.serverTimestamp(),
            });

            // Update gig escrow status if gigId provided
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
        } catch (dbErr) {
            console.error('Firestore update failed:', dbErr);
            // Still return success since payment was verified
        }

        return res.status(200).json({ success: true });
    } catch (error: any) {
        console.error('verifyPayment error:', error);
        return res.status(500).json({ error: 'Payment verification failed', details: error?.message });
    }
}
