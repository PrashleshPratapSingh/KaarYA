import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface StashCardProps {
    balance: number;
    pendingPayment: number;
    onWithdraw?: () => void;
}

export function StashCard({ balance, pendingPayment, onWithdraw }: StashCardProps) {
    return (
        <View className="bg-karya-black rounded-[40px] p-7 mb-6 shadow-xl overflow-hidden">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-8">
                <View>
                    <Text className="text-xl font-extrabold text-white tracking-widest italic">KARYA</Text>
                    <Text className="text-[10px] font-bold text-white/40 uppercase tracking-[4px]">DIGITAL ASSET</Text>
                </View>
                <View className="bg-white/10 px-3 py-1.5 rounded-full">
                    <Text className="text-[10px] font-extrabold text-white/60">ACTIVE HUB</Text>
                </View>
            </View>

            {/* Balances Grid */}
            <View className="mb-8">
                <View className="mb-6">
                    <Text className="text-[10px] font-bold text-white/40 uppercase mb-2 tracking-widest">Available Stash</Text>
                    <Text className="text-5xl font-extrabold text-karya-yellow tracking-tight">₹{balance.toLocaleString('en-IN')}</Text>
                </View>

                <View className="h-[1px] bg-white/10 w-full mb-6" />

                <View className="flex-row items-center justify-between">
                    <View>
                        <Text className="text-[10px] font-bold text-white/40 uppercase mb-1 tracking-widest">Pending Payment</Text>
                        <Text className="text-2xl font-extrabold text-white">₹{(pendingPayment).toLocaleString('en-IN')}</Text>
                        <Text className="text-[9px] font-bold text-karya-yellow/60 uppercase mt-1">Incoming from committed work</Text>
                    </View>
                    <Feather name="trending-up" size={24} color="#FFE500" opacity={0.5} />
                </View>
            </View>

            {/* Actions */}
            <Pressable
                onPress={onWithdraw}
                className="bg-white rounded-[24px] py-5 flex-row items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-all"
            >
                <Text className="text-sm font-extrabold text-karya-black tracking-widest uppercase">WITHDRAW</Text>
                <Feather name="arrow-up-right" size={18} color="black" />
            </Pressable>
        </View>
    );
}
