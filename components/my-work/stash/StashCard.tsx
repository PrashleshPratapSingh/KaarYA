import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface StashCardProps {
    balance: number;
    onWithdraw?: () => void;
}

export function StashCard({ balance, onWithdraw }: StashCardProps) {
    return (
        <View className="bg-karya-black rounded-3xl p-6 mb-5" style={{ minHeight: 200 }}>
            {/* Header */}
            <View className="flex-row items-center justify-between mb-6">
                <View>
                    <Text className="text-lg font-extrabold text-white tracking-tight">KARYA</Text>
                    <Text className="text-xs font-bold text-white/60">BANK</Text>
                </View>
                <View className="flex-row items-center gap-2">
                    <View className="w-8 h-8 bg-karya-yellow rounded-full items-center justify-center">
                        <Feather name="moon" size={14} color="black" />
                    </View>
                    <View className="w-8 h-8 bg-white/10 rounded-full items-center justify-center">
                        <Feather name="user" size={14} color="white" />
                    </View>
                </View>
            </View>

            {/* Balance Section */}
            <View className="bg-karya-yellow rounded-2xl p-5 mb-4">
                <Text className="text-[10px] font-bold text-karya-black/50 uppercase tracking-wider mb-2">
                    TOTAL BALANCE
                </Text>

                <Text className="text-5xl font-extrabold text-karya-black tracking-tight mb-6">
                    ₹{balance.toLocaleString('en-IN')}
                </Text>

                <Pressable
                    onPress={onWithdraw}
                    className="bg-white rounded-xl py-3 flex-row items-center justify-center gap-2 shadow-sm"
                >
                    <Text className="text-sm font-extrabold text-karya-black">WITHDRAW</Text>
                    <Feather name="chevron-right" size={18} color="black" />
                </Pressable>
            </View>

            <View className="flex-row items-center justify-between px-2">
                <Text className="text-[10px] text-white/40 font-medium">**** 8829</Text>
                <Text className="text-[10px] text-white/60 font-bold uppercase">STUDENT SAVER</Text>
            </View>
        </View>
    );
}
