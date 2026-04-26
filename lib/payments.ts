import RazorpayCheckout from 'react-native-razorpay';
import { Alert } from 'react-native';

/**
 * KaarYa Payment Service
 * Handles Razorpay checkout and escrow initiation.
 */

const RAZORPAY_KEY_ID = process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_HERE';

interface PaymentOptions {
    amount: number; // in paise
    description: string;
    order_id: string;
    prefill: {
        email: string;
        contact: string;
        name: string;
    };
    theme_color?: string;
}

export const initiatePayment = async (options: PaymentOptions) => {
    const checkoutOptions = {
        description: options.description,
        image: 'https://i.imgur.com/3giU062.png', // KaarYa Logo Placeholder
        currency: 'INR',
        key: RAZORPAY_KEY_ID,
        amount: options.amount,
        name: 'KaarYa Marketplace',
        order_id: options.order_id,
        prefill: options.prefill,
        theme: {
            color: options.theme_color || '#FFE500'
        }
    };

    try {
        const data = await RazorpayCheckout.open(checkoutOptions);
        return {
            success: true,
            razorpay_payment_id: data.razorpay_payment_id,
            razorpay_order_id: data.razorpay_order_id,
            razorpay_signature: data.razorpay_signature
        };
    } catch (error: any) {
        console.error('Payment Error:', error);
        Alert.alert(
            'Payment Failed',
            `Error: ${error.description || 'Transaction cancelled'}`
        );
        return {
            success: false,
            error: error.description
        };
    }
};
