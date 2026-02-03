import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '../../lib/utils';

interface ProgressBarProps {
    percentage: number; // 0-100
    label?: string;
    className?: string;
}

export function ProgressBar({ percentage, label, className }: ProgressBarProps) {
    const clampedPercentage = Math.max(0, Math.min(100, percentage));

    return (
        <View className={cn('w-full', className)}>
            {label && (
                <Text className="text-xs font-bold text-karya-black mb-1">
                    {label}
                </Text>
            )}
            <View className="w-full h-8 bg-white border-brutal border-karya-black relative overflow-hidden">
                <View
                    className="h-full bg-karya-yellow absolute left-0 top-0"
                    style={{ width: `${clampedPercentage}%` }}
                />
                <View className="absolute inset-0 flex items-center justify-center">
                    <Text className="text-sm font-bold text-karya-black z-10">
                        {clampedPercentage}%
                    </Text>
                </View>
            </View>
        </View>
    );
}
