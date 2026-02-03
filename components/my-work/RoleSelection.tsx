import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface RoleSelectionProps {
    onSelectRole: (role: 'client' | 'executor') => void;
}

export function RoleSelection({ onSelectRole }: RoleSelectionProps) {
    return (
        <SafeAreaView className="flex-1 bg-karya-yellow px-6 justify-center">
            {/* Header */}
            <View className="items-center mb-10">
                <View className="bg-white/20 px-4 py-1.5 rounded-full mb-6">
                    <Text className="text-[10px] font-bold text-karya-black uppercase tracking-widest">
                        SELECT YOUR PATH
                    </Text>
                </View>
                <Text className="text-4xl font-extrabold text-karya-black text-center mb-2 tracking-tight">
                    Ready to Start?
                </Text>
                <Text className="text-sm font-medium text-karya-black/60 text-center">
                    Choose your role in the ecosystem.
                </Text>
            </View>

            {/* Options */}
            <View className="gap-5 mb-12">
                {/* Client Option */}
                <Pressable
                    onPress={() => onSelectRole('client')}
                    className="bg-white rounded-[32px] p-5 flex-row items-center gap-5 shadow-sm active:scale-95 transition-all"
                >
                    <View className="w-16 h-16 bg-blue-50 rounded-2xl items-center justify-center">
                        <Feather name="box" size={32} color="#3B82F6" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-xl font-extrabold text-karya-black mb-1">Client</Text>
                        <Text className="text-xs text-gray-400 font-medium">Launch a Micro-Gig</Text>
                    </View>
                    <Feather name="chevron-right" size={24} color="#E5E7EB" />
                </Pressable>

                {/* Executor Option */}
                <Pressable
                    onPress={() => onSelectRole('executor')}
                    className="bg-white rounded-[32px] p-5 flex-row items-center gap-5 shadow-sm active:scale-95 transition-all"
                >
                    <View className="w-16 h-16 bg-green-50 rounded-2xl items-center justify-center">
                        <Feather name="zap" size={32} color="#22C55E" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-xl font-extrabold text-karya-black mb-1">Executor</Text>
                        <Text className="text-xs text-gray-400 font-medium">Earn with Precision</Text>
                    </View>
                    <Feather name="chevron-right" size={24} color="#E5E7EB" />
                </Pressable>
            </View>

            {/* Footer */}
            <View className="items-center">
                <Text className="text-[10px] font-bold text-karya-black/40 uppercase mb-6 tracking-widest">
                    PREMIUM MICRO-GIG ECOSYSTEM
                </Text>
                <Pressable className="bg-white px-8 py-4 rounded-full shadow-sm">
                    <Text className="text-xs font-extrabold text-karya-black uppercase tracking-wide">BACK TO HOME</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
