import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

export function HustleGoalCard() {
    const [isEditing, setIsEditing] = useState(false);
    const [goalAmount, setGoalAmount] = useState('25000');
    const [goalDuration, setGoalDuration] = useState('30');

    // Mock current earnings for progress calculation
    const currentEarnings = 14500;
    const progress = Math.min(100, Math.round((currentEarnings / (parseInt(goalAmount) || 1)) * 100));

    return (
        <View className="bg-white rounded-[32px] p-6 mb-6 shadow-sm border border-gray-50">
            <View className="flex-row items-center justify-between mb-6">
                <View>
                    <Text className="text-base font-extrabold text-karya-black uppercase tracking-tight">Hustle Goal</Text>
                    <Text className="text-[10px] font-bold text-gray-400">SET YOUR SIGHTS</Text>
                </View>
                <Pressable
                    onPress={() => setIsEditing(true)}
                    className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center active:scale-95"
                >
                    <Feather name="edit-2" size={16} color="#FFE500" />
                </Pressable>
            </View>

            {/* Goal Display */}
            <View className="flex-row gap-2 mb-6">
                <Pressable
                    onPress={() => setIsEditing(true)}
                    className="flex-1 bg-gray-50 rounded-2xl p-3 border border-gray-100 active:bg-gray-100"
                >
                    <Text className="text-[9px] font-bold text-gray-400 uppercase mb-1">Duration</Text>
                    <Text className="text-sm font-extrabold text-karya-black">{goalDuration} DAYS</Text>
                </Pressable>
                <Pressable
                    onPress={() => setIsEditing(true)}
                    className="flex-1 bg-gray-50 rounded-2xl p-3 border border-gray-100 active:bg-gray-100"
                >
                    <Text className="text-[9px] font-bold text-gray-400 uppercase mb-1">Target Amount</Text>
                    <Text className="text-sm font-extrabold text-karya-black">₹{parseInt(goalAmount).toLocaleString('en-IN')}</Text>
                </Pressable>
            </View>

            <View className="mb-6">
                <View className="flex-row justify-between mb-2">
                    <Text className="text-[10px] font-bold text-karya-black/40 uppercase">CURRENT PROGRESS</Text>
                    <Text className="text-[10px] font-bold text-karya-black">{progress}% REACHED</Text>
                </View>
                <View className="h-3 bg-gray-50 rounded-full overflow-hidden">
                    <View className="h-full bg-karya-yellow" style={{ width: `${progress}%` }} />
                </View>
            </View>

            <View className="bg-karya-yellow/10 rounded-2xl p-4 flex-row items-center gap-4">
                <Text className="text-xl">💡</Text>
                <Text className="flex-1 text-[11px] font-bold text-karya-black/60 leading-tight">
                    {progress >= 100
                        ? `GOAL ACHIEVED! You've crushed your ₹${parseInt(goalAmount).toLocaleString('en-IN')} target. Time to set a bigger one?`
                        : `REMINDER: Complete ${Math.ceil((parseInt(goalAmount) - currentEarnings) / 3000)} more gigs to hit your ₹${parseInt(goalAmount).toLocaleString('en-IN')} goal!`}
                </Text>
            </View>

            {/* Edit Modal */}
            <Modal visible={isEditing} transparent animationType="fade">
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1 bg-black/60 justify-center px-6"
                >
                    <View className="bg-white rounded-[40px] p-8 shadow-2xl">
                        <Text className="text-2xl font-extrabold text-karya-black mb-6 text-center">Update Goal</Text>

                        <View className="mb-4">
                            <Text className="text-[10px] font-bold text-gray-400 uppercase mb-2 ml-1">Target Amount (₹)</Text>
                            <TextInput
                                keyboardType="number-pad"
                                value={goalAmount}
                                onChangeText={setGoalAmount}
                                className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-xl font-extrabold text-karya-black"
                                placeholder="e.g. 25000"
                            />
                        </View>

                        <View className="mb-8">
                            <Text className="text-[10px] font-bold text-gray-400 uppercase mb-2 ml-1">Timeframe (Days)</Text>
                            <TextInput
                                keyboardType="number-pad"
                                value={goalDuration}
                                onChangeText={setGoalDuration}
                                className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-xl font-extrabold text-karya-black"
                                placeholder="e.g. 30"
                            />
                        </View>

                        <Pressable
                            onPress={() => setIsEditing(false)}
                            className="bg-karya-black py-4 rounded-2xl items-center shadow-lg active:scale-95 transition-all"
                        >
                            <Text className="text-white font-extrabold text-base uppercase tracking-widest">Set New Goal</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => setIsEditing(false)}
                            className="mt-4 items-center"
                        >
                            <Text className="text-gray-400 font-bold text-xs uppercase">Cancel</Text>
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}
