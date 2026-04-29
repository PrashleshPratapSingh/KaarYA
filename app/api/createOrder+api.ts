import { db } from '../../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

// POST /api/createOrder
// Body: { amount (rupees), gigId, clientId, executorId }
// Returns: Razorpay order object

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

        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            return Response.json(
                { error: 'Razorpay keys not configured on server' },
                { status: 500 }
            );
        }

        // Dynamic import — razorpay is a server-only package
        const Razorpay = (await import('razorpay')).default;
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

        // Record the pending order in Firestore
        if (gigId) {
            await setDoc(doc(db, 'orders', order.id), {
                orderId: order.id,
                gigId,
                clientId: clientId || null,
                executorId: executorId || null,
                amount: order.amount,
                currency: order.currency,
                status: 'created',
                createdAt: serverTimestamp(),
            });
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
