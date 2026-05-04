import { Alert, Platform } from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PaymentOptions {
    /** Amount in INR (rupees, not paise) */
    amount: number;
    /** Gig ID to attach the payment to */
    gigId: string;
    /** Firebase UID of the client paying */
    clientId: string;
    /** Firebase UID of the executor receiving payment */
    executorId: string;
    /** Description shown in Razorpay checkout */
    description?: string;
    /** Prefilled user details for checkout form */
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
}

export interface PaymentResult {
    success: boolean;
    paymentId?: string;
    orderId?: string;
    error?: string;
}

// ─── API Base URL ─────────────────────────────────────────────────────────────
// Expo API Routes deployed on Vercel — free tier, no Firebase Blaze needed.
// Locally: use the LAN IP printed by `expo start` (e.g. http://192.168.x.x:8081)
// Production: https://kaaryaa.vercel.app
const FUNCTIONS_BASE_URL =
    process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://kaaryaa.vercel.app';

// ─── Step 1: Create Order (Server-side) ──────────────────────────────────────
const createOrder = async (
    amount: number,
    gigId: string,
    clientId: string,
    executorId: string
): Promise<{ id: string; amount: number; currency: string }> => {
    const response = await fetch(`${FUNCTIONS_BASE_URL}/api/createOrder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, gigId, clientId, executorId }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Order creation failed (${response.status})`);
    }

    return response.json();
};

// ─── Step 2: Verify Payment (Server-side) ────────────────────────────────────
const verifyPayment = async (
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string,
    gigId: string
): Promise<{ success: boolean }> => {
    const response = await fetch(`${FUNCTIONS_BASE_URL}/api/verifyPayment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            gigId,
        }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Payment verification failed (${response.status})`);
    }

    return response.json();
};

// ─── Main: initiatePayment ────────────────────────────────────────────────────
export const initiatePayment = async (options: PaymentOptions): Promise<PaymentResult> => {
    const { amount, gigId, clientId, executorId, description, prefill } = options;

    // Validate amount
    if (!amount || amount <= 0) {
        Alert.alert('Invalid Amount', 'Payment amount must be greater than ₹0.');
        return { success: false, error: 'Invalid amount' };
    }

    // Check for Razorpay Key ID
    const keyId = process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID;
    if (!keyId || keyId.includes('YOUR_KEY')) {
        Alert.alert(
            'Payment Not Configured',
            'Razorpay keys are not set up yet. Please add your key to .env.',
        );
        return { success: false, error: 'Razorpay key not configured' };
    }

    try {
        // ── Step 1: Create order on server ──
        const order = await createOrder(amount, gigId, clientId, executorId);

        // ── Step 2: Open Razorpay checkout on device ──
        let RazorpayCheckout: any;
        try {
            RazorpayCheckout = require('react-native-razorpay').default;
            
            // Expo Go check: the JS module might load, but native methods won't exist
            if (!RazorpayCheckout || typeof RazorpayCheckout.open !== 'function') {
                throw new Error('Native methods missing');
            }
        } catch (e) {
            Alert.alert(
                'Native Module Missing',
                'Razorpay requires a custom dev build and cannot be tested inside Expo Go.\n\nPlease run:\nnpx expo run:android\nOR\nnpx expo run:ios',
            );
            return { success: false, error: 'react-native-razorpay not available in this build' };
        }

        const checkoutOptions = {
            description: description || 'KaarYa Gig Payment',
            image: 'https://firebasestorage.googleapis.com/v0/b/kaarya-3870a.appspot.com/o/logo.png?alt=media',
            currency: order.currency,
            key: keyId,
            amount: order.amount, // Already in paise from server
            name: 'KaarYa',
            order_id: order.id,
            prefill: {
                email: prefill?.email || '',
                contact: prefill?.contact || '',
                name: prefill?.name || '',
            },
            theme: { color: '#FFE500' }, // KaarYa yellow
        };

        const paymentData = await RazorpayCheckout.open(checkoutOptions);

        // ── Step 3: Verify on server, update Firestore ──
        const verification = await verifyPayment(
            paymentData.razorpay_order_id,
            paymentData.razorpay_payment_id,
            paymentData.razorpay_signature,
            gigId,
        );

        if (verification.success) {
            return {
                success: true,
                paymentId: paymentData.razorpay_payment_id,
                orderId: paymentData.razorpay_order_id,
            };
        } else {
            throw new Error('Signature verification failed on server');
        }
    } catch (error: any) {
        // Razorpay throws with error.code when user cancels
        if (error?.code === 0) {
            // User cancelled — not an error
            return { success: false, error: 'Payment cancelled by user' };
        }
        console.error('initiatePayment error:', error);
        throw error;
    }
};
