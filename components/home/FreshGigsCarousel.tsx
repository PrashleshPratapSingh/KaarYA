/**
 * FreshGigsCarousel - Horizontal scrolling for Fresh Gigs
 * Full-width cards, one at a time, swipe to see more
 */
import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { GigCard } from './GigCard';
import { Gig } from './types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = 20;
const CARD_WIDTH = SCREEN_WIDTH - (CARD_MARGIN * 2);

interface Props {
    gigs: Gig[];
    onGigPress?: (gig: Gig) => void;
    onApply?: (gig: Gig) => void;
}

export function FreshGigsCarousel({ gigs, onGigPress, onApply }: Props) {
    // Take first 2 gigs for the carousel
    const carouselGigs = gigs.slice(0, 2);

    return (
        <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={SCREEN_WIDTH}
            contentContainerStyle={styles.scrollContent}
            scrollEventThrottle={16}
        >
            {carouselGigs.map((gig, index) => (
                <View key={gig.id} style={styles.cardWrapper}>
                    <GigCard
                        gig={gig}
                        index={index}
                        onPress={() => onGigPress?.(gig)}
                        onApply={() => onApply?.(gig)}
                    />
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        // No extra padding needed with pagingEnabled
    },
    cardWrapper: {
        width: SCREEN_WIDTH,
        paddingHorizontal: CARD_MARGIN,
    },
});
