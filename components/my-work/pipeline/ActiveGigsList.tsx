import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { GigCard } from './GigCard';
import { Gig } from '../../../lib/types/mywork';

interface ActiveGigsListProps {
    gigs: Gig[];
}

export function ActiveGigsList({ gigs }: ActiveGigsListProps) {
    if (gigs.length === 0) {
        return (
            <View className="flex-1 items-center justify-center py-20">
                <Text className="text-6xl mb-4">💼</Text>
                <Text className="text-2xl font-bold text-karya-black mb-2 tracking-tight">
                    NO ACTIVE GIGS
                </Text>
                <Text className="text-sm text-gray-600 text-center px-8">
                    Time to hustle! Browse available gigs and strike a deal.
                </Text>
            </View>
        );
    }

    return (
        <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
        >
            {gigs.map((gig) => (
                <GigCard key={gig.id} gig={gig} />
            ))}
        </ScrollView>
    );
}
