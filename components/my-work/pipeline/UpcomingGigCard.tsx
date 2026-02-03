import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Gig } from '@/lib/types/mywork';

interface UpcomingGigCardProps {
    gig: Gig;
    onPress?: () => void;
}

export function UpcomingGigCard({ gig, onPress }: UpcomingGigCardProps) {
    const dateObj = gig.startTime ? new Date(gig.startTime) : new Date();
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const dayNum = dateObj.getDate();

    return (
        <Pressable
            onPress={onPress}
            className="bg-white rounded-2xl p-4 mb-3 flex-row items-center gap-4 shadow-sm active:bg-gray-50"
        >
            {/* Date Badge */}
            <View className="bg-karya-yellow rounded-xl w-14 h-16 items-center justify-center">
                <Text className="text-[10px] font-bold text-karya-black/60 uppercase">{dayName}</Text>
                <Text className="text-xl font-extrabold text-karya-black">{String(dayNum).padStart(2, '0')}</Text>
            </View>

            {/* Content */}
            <View className="flex-1">
                <View className="flex-row items-center gap-2 mb-1">
                    <View className="bg-karya-black px-2.5 py-1 rounded-full">
                        <Text className="text-[9px] font-bold text-karya-yellow uppercase">SCHEDULED</Text>
                    </View>
                </View>
                <Text className="text-base font-extrabold text-karya-black leading-tight">
                    {gig.title}
                </Text>
                <Text className="text-xs text-gray-400 font-medium mt-0.5" numberOfLines={1}>
                    {gig.clientName}
                </Text>
            </View>

            <Feather name="chevron-right" size={20} color="#00000030" />
        </Pressable>
    );
}
