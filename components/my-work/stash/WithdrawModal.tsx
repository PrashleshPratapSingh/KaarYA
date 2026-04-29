import React from 'react';
import { Modal, View, Text, Pressable, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { initiatePayout } from '@/lib/payments';
import { useAuth } from '@/app/context/AuthContext';

interface WithdrawModalProps {
    visible: boolean;
    onClose: () => void;
    balance: number;
    onWithdraw: (amount: number, upiId: string) => void;
}

export const WithdrawModal = React.memo(function WithdrawModal({ visible, onClose, balance, onWithdraw }: WithdrawModalProps) {
    const [upiId, setUpiId] = React.useState('');
    const [amount, setAmount] = React.useState('');
    const [step, setStep] = React.useState<'input' | 'success'>('input');
    const [loading, setLoading] = React.useState(false);
    const { user } = useAuth();

    const handleWithdraw = async () => {
        const withdrawAmount = parseFloat(amount) || balance;
        
        if (!upiId.trim()) {
            Alert.alert('UPI ID Required', 'Please enter your UPI ID');
            return;
        }

        setLoading(true);
        try {
            const result = await initiatePayout(
                withdrawAmount,
                upiId,
                user?.id || 'unknown',
                user?.name || 'KaarYa User'
            );

            if (result.success) {
                onWithdraw(withdrawAmount, upiId);
                setStep('success');
            }
        } catch (error) {
            // Error already handled in initiatePayout
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setStep('input');
        setUpiId('');
        setAmount('');
        setLoading(false);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
            {/* Wrap with KeyboardAvoidingView to handle keyboard occlusion */}
            <KeyboardAvoidingView
                className="flex-1 bg-black/50 justify-end"
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View className="bg-white rounded-t-[32px] p-6 pb-10">
                    <View className="w-12 h-1 bg-gray-200 rounded-full self-center mb-6" />

                    {step === 'input' ? (
                        <>
                            <Text className="text-xl font-extrabold text-karya-black text-center mb-2">
                                Withdraw to UPI
                            </Text>
                            <Text className="text-sm text-gray-400 text-center mb-6">
                                Available: ₹{balance.toLocaleString('en-IN')}
                            </Text>

                            {/* Amount Input */}
                            <View className="bg-gray-50 rounded-2xl p-4 mb-4 border border-gray-100">
                                <Text className="text-[10px] font-bold text-gray-400 uppercase mb-2">Amount</Text>
                                <View className="flex-row items-center">
                                    <Text className="text-2xl font-extrabold text-karya-black">₹</Text>
                                    <TextInput
                                        className="flex-1 text-2xl font-extrabold text-karya-black ml-1 pt-0 pb-0 h-10"
                                        placeholder={balance.toString()}
                                        placeholderTextColor="#D1D5DB"
                                        keyboardType="number-pad"
                                        value={amount}
                                        onChangeText={setAmount}
                                        maxLength={10}
                                        selectionColor="#FFE500"
                                    />
                                </View>
                            </View>

                            {/* UPI ID Input */}
                            <View className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
                                <Text className="text-[10px] font-bold text-gray-400 uppercase mb-2">UPI ID</Text>
                                <TextInput
                                    className="text-base font-bold text-karya-black pt-0 pb-0 h-8"
                                    placeholder="yourname@upi"
                                    placeholderTextColor="#D1D5DB"
                                    value={upiId}
                                    onChangeText={setUpiId}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    selectionColor="#FFE500"
                                />
                            </View>

                            <Pressable
                                 onPress={handleWithdraw}
                                 className="bg-karya-black py-4 rounded-2xl items-center mb-3 shadow-md"
                                 disabled={loading}
                             >
                                 <Text className="text-white font-extrabold text-base">
                                     {loading ? 'PROCESSING...' : 'WITHDRAW NOW'}
                                 </Text>
                             </Pressable>

                            <Pressable onPress={handleClose} className="py-2 items-center">
                                <Text className="text-gray-400 font-bold text-xs">CANCEL</Text>
                            </Pressable>
                        </>
                    ) : (
                        <>
                            {/* Success State */}
                            <View className="items-center py-8">
                                <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-6">
                                    <Feather name="check" size={40} color="#16A34A" />
                                </View>
                                <Text className="text-2xl font-extrabold text-karya-black mb-2">
                                    Withdrawal Initiated!
                                </Text>
                                <Text className="text-base text-gray-500 text-center mb-2">
                                    ₹{(parseFloat(amount) || balance).toLocaleString('en-IN')} is on its way
                                </Text>
                                <Text className="text-sm text-gray-400 text-center">
                                    to {upiId || 'your UPI account'}
                                </Text>
                                <Text className="text-xs text-gray-300 mt-4 text-center">
                                    Usually arrives within 2-4 hours
                                </Text>
                            </View>

                            <Pressable
                                onPress={handleClose}
                                className="bg-karya-yellow py-4 rounded-2xl items-center"
                            >
                                <Text className="text-karya-black font-extrabold text-base">DONE</Text>
                            </Pressable>
                        </>
                    )}
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
});
