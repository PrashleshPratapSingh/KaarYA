import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { CompletedGigCard } from './CompletedGigCard';
import { CompletedGig } from '../../../lib/types/mywork';

interface PortfolioGridProps {
    completedGigs: CompletedGig[];
}

export function PortfolioGrid({ completedGigs }: PortfolioGridProps) {
    if (completedGigs.length === 0) {
        return (
            <View className="bg-white rounded-3xl items-center justify-center py-16 px-8">
                <Text className="text-5xl mb-4">🏆</Text>
                <Text className="text-xl font-extrabold text-karya-black mb-2 tracking-tight text-center">
                    BUILD YOUR GRIND{'\n'}PORTFOLIO
                </Text>
                <Text className="text-sm text-gray-400 text-center">
                    Complete your first gig to start showcasing your work!
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1">
            {completedGigs.map((gig) => (
                <CompletedGigCard key={gig.id} gig={gig} />
            ))}
        </View>
    );
}
