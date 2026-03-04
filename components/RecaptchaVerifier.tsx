/**
 * Firebase reCAPTCHA Verifier for React Native
 *
 * Provides an invisible reCAPTCHA verifier component that satisfies
 * Firebase Auth's ApplicationVerifier interface for phone OTP.
 *
 * In Expo Go / development:
 *   - Uses Firebase's test phone numbers if configured in Firebase Console
 *   - For production, consider switching to a dev-build with native reCAPTCHA
 *
 * Usage:
 *   <FirebaseRecaptchaVerifierModal ref={recaptchaRef} />
 *   ...
 *   await sendOtp(phone, recaptchaRef.current);
 */
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Modal, View, StyleSheet, ActivityIndicator, Text, Platform } from 'react-native';

/**
 * Minimal ApplicationVerifier implementation for React Native.
 *
 * Firebase phone auth on web uses reCAPTCHA (which requires a DOM).
 * In React Native, the standard approach is:
 *
 * 1. For TESTING: Use Firebase Console → Authentication → Phone → Test numbers
 *    to add test phone numbers that bypass reCAPTCHA entirely.
 *
 * 2. For PRODUCTION: Use a custom dev-build with @react-native-firebase/auth
 *    which handles reCAPTCHA natively.
 *
 * This component provides a stub verifier that works with Firebase's
 * test phone number feature during development.
 */

interface FirebaseRecaptchaVerifierModalProps {
    // Optional: Firebase app instance (not needed for basic usage)
    firebaseConfig?: Record<string, string>;
}

export interface RecaptchaVerifierRef {
    type: string;
    verify: () => Promise<string>;
}

export const FirebaseRecaptchaVerifierModal = forwardRef<
    RecaptchaVerifierRef,
    FirebaseRecaptchaVerifierModalProps
>(function FirebaseRecaptchaVerifierModal(_props, ref) {
    const [visible, setVisible] = useState(false);

    useImperativeHandle(ref, () => ({
        type: 'recaptcha',
        verify: async () => {
            // For test phone numbers configured in Firebase Console,
            // the verification token is not actually validated.
            // This returns a placeholder token.
            //
            // To set up test phone numbers:
            // Firebase Console → Authentication → Sign-in method → Phone
            // → Phone numbers for testing → Add your test number + OTP code
            setVisible(true);

            // Simulate brief verification delay
            await new Promise((resolve) => setTimeout(resolve, 500));

            setVisible(false);
            return 'react-native-recaptcha-placeholder';
        },
    }));

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <ActivityIndicator size="large" color="#FFE500" />
                    <Text style={styles.text}>Verifying...</Text>
                </View>
            </View>
        </Modal>
    );
});

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
        gap: 16,
        borderWidth: 2,
        borderColor: '#FFE500',
    },
    text: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});
