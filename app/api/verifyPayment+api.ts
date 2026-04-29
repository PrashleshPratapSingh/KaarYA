import { db } from '../../lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { createHmac } from 'crypto';

// POST /api/verifyPayment
// Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, gigId }
// Returns: { success: boolean }

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            gigId,
        } = body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return Response.json(
                { error: 'Missing required payment parameters' },
                { status: 400 }
            );
        }

        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!keySecret) {
            return Response.json(
                { error: 'Server misconfiguration: missing Razorpay secret' },
                { status: 500 }
            );
        }

        // ── HMAC-SHA256 Signature Verification ──────────────────────────
        const body_string = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = createHmac('sha256', keySecret)
            .update(body_string)
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return Response.json(
                { success: false, error: 'Invalid payment signature' },
                { status: 400 }
            );
        }

        // ── Update Firestore on verified payment ─────────────────────────
        const updates: Promise<void>[] = [];

        // Update order record status → paid
        updates.push(
            updateDoc(doc(db, 'orders', razorpay_order_id), {
                paymentId: razorpay_payment_id,
                status: 'paid',
                paidAt: serverTimestamp(),
            }).catch(() => {}) // Order doc may not exist if gigId wasn't passed to createOrder
        );

        // Update gig status → escrow_funded
        if (gigId) {
            updates.push(
                updateDoc(doc(db, 'gigs', gigId), {
                    status: 'escrow_funded',
                    paymentId: razorpay_payment_id,
                    orderId: razorpay_order_id,
                    escrowFundedAt: serverTimestamp(),
                })
            );
        }

        await Promise.all(updates);

        return Response.json({
            success: true,
            message: 'Payment verified and escrow funded successfully',
            paymentId: razorpay_payment_id,
        });
    } catch (error: any) {
        console.error('verifyPayment error:', error);
        return Response.json(
            { success: false, error: 'Internal server error during verification' },
            { status: 500 }
        );
    }
}
