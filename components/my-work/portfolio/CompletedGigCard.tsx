import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CompletedGig } from '../../../lib/types/mywork';
import { VibeBadge } from '../VibeBadge';

interface CompletedGigCardProps {
    gig: CompletedGig;
}

export function CompletedGigCard({ gig }: CompletedGigCardProps) {
    const formatDate = () => {
        const date = new Date(gig.completedDate);
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            {/* Work Snippet */}
            <View
                className="bg-karya-yellow/10 rounded-xl p-5 mb-4 items-center justify-center"
                style={{ minHeight: 100 }}
            >
                <Text className="text-lg text-center font-semibold text-karya-black leading-relaxed">
                    {gig.workSnippet}
                </Text>
            </View>

            {/* Title */}
            <Text className="text-base font-extrabold text-karya-black mb-3 leading-tight">
                {gig.title}
            </Text>

            {/* Badges */}
            <View className="flex-row flex-wrap gap-2 mb-4">
                {gig.vibeBadges.map((badge, index) => (
                    <VibeBadge key={index} label={badge} />
                ))}
            </View>

            <View className="h-[1px] bg-gray-100 w-full mb-3" />

            {/* Footer */}
            <View className="flex-row items-center justify-between">
                <View>
                    <Text className="text-xl font-extrabold text-green-600">
                        ₹{gig.amount.toLocaleString('en-IN')}
                    </Text>
                    <Text className="text-xs text-gray-400 font-medium">{formatDate()}</Text>
                </View>

                {gig.rating && (
                    <View className="flex-row items-center gap-1.5 bg-karya-yellow/20 px-3 py-1.5 rounded-full">
                        <Feather name="star" size={16} color="#F59E0B" />
                        <Text className="text-base font-extrabold text-karya-black">{gig.rating.toFixed(1)}</Text>
                    </View>
                )}
            </View>
        </View>
    );
}
