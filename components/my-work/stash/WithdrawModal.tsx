import React from 'react';
import { Modal, View, Text, Pressable, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface WithdrawModalProps {
    visible: boolean;
    onClose: () => void;
    balance: number;
    onWithdraw: (amount: number, upiId: string) => void;
}

export function WithdrawModal({ visible, onClose, balance, onWithdraw }: WithdrawModalProps) {
    const [upiId, setUpiId] = React.useState('');
    const [amount, setAmount] = React.useState('');
    const [step, setStep] = React.useState<'input' | 'success'>('input');

    const handleWithdraw = () => {
        const withdrawAmount = parseFloat(amount) || balance;
        onWithdraw(withdrawAmount, upiId);
        setStep('success');
    };

    const handleClose = () => {
        setStep('input');
        setUpiId('');
        setAmount('');
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
            <View className="flex-1 bg-black/50 justify-end">
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
                            <View className="bg-gray-50 rounded-2xl p-4 mb-4">
                                <Text className="text-[10px] font-bold text-gray-400 uppercase mb-2">Amount</Text>
                                <View className="flex-row items-center">
                                    <Text className="text-2xl font-extrabold text-karya-black">₹</Text>
                                    <TextInput
                                        className="flex-1 text-2xl font-extrabold text-karya-black ml-1"
                                        placeholder={balance.toString()}
                                        placeholderTextColor="#00000030"
                                        keyboardType="numeric"
                                        value={amount}
                                        onChangeText={setAmount}
                                    />
                                </View>
                            </View>

                            {/* UPI ID Input */}
                            <View className="bg-gray-50 rounded-2xl p-4 mb-6">
                                <Text className="text-[10px] font-bold text-gray-400 uppercase mb-2">UPI ID</Text>
                                <TextInput
                                    className="text-base font-bold text-karya-black"
                                    placeholder="yourname@upi"
                                    placeholderTextColor="#00000030"
                                    value={upiId}
                                    onChangeText={setUpiId}
                                    autoCapitalize="none"
                                />
                            </View>

                            <Pressable
                                onPress={handleWithdraw}
                                className="bg-karya-black py-4 rounded-2xl items-center mb-3"
                            >
                                <Text className="text-white font-extrabold text-base">WITHDRAW NOW</Text>
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
            </View>
        </Modal>
    );
}
