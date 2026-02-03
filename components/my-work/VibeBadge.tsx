import React from 'react';
import { View, Text } from 'react-native';

interface VibeBadgeProps {
    label: string;
}

export function VibeBadge({ label }: VibeBadgeProps) {
    return (
        <View className="bg-karya-black px-3 py-1.5 rounded-full">
            <Text className="text-[10px] font-bold text-karya-yellow tracking-wide uppercase">
                {label}
            </Text>
        </View>
    );
}
