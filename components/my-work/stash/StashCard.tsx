import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface StashCardProps {
    balance: number;
}

export function StashCard({ balance }: StashCardProps) {
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
                <Text className="text-[10px] font-bold text-karya-black/50 uppercase tracking-wider mb-1">
                    TOTAL BALANCE
                </Text>
                <View className="flex-row items-center justify-between">
                    <Text className="text-4xl font-extrabold text-karya-black tracking-tight">
                        ₹{balance.toLocaleString('en-IN')}
                    </Text>
                    <View className="bg-white w-10 h-10 rounded-full items-center justify-center">
                        <Text className="text-lg font-bold text-karya-black">K</Text>
                    </View>
                </View>
                <View className="flex-row items-center gap-2 mt-2">
                    <Text className="text-[10px] text-karya-black/40 font-medium">**** 8829</Text>
                    <Text className="text-[10px] text-karya-black/60 font-bold uppercase">STUDENT SAVER</Text>
                </View>
            </View>
        </View>
    );
}
