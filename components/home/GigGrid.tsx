/**
 * GigGrid - Hybrid grid layout with featured hero + 2-column masonry
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { GigCard } from './GigCard';
import { GigCardCompact } from './GigCardCompact';
import { EmptyState } from './EmptyState';
import { KARYA_BLACK, Gig } from './types';

interface Props {
    gigs: Gig[];
    refreshing?: boolean;
    onRefresh?: () => void;
    onGigPress?: (gig: Gig) => void;
    onApply?: (gig: Gig) => void;
}

export function GigGrid({ gigs, refreshing = false, onRefresh, onGigPress, onApply }: Props) {
    if (gigs.length === 0) {
        return <EmptyState />;
    }

    const [featuredGig, ...gridGigs] = gigs;

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            refreshControl={
                onRefresh ? (
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={KARYA_BLACK}
                        colors={[KARYA_BLACK]}
                    />
                ) : undefined
            }
        >
            {/* Section Title */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>FRESH GIGS</Text>
                <Text style={styles.gigCount}>{gigs.length} available</Text>
            </View>

            {/* Featured Card */}
            <GigCard
                gig={featuredGig}
                index={0}
                onPress={() => onGigPress?.(featuredGig)}
                onApply={() => onApply?.(featuredGig)}
            />

            {/* Masonry Grid */}
            {gridGigs.length > 0 && (
                <>
                    <View style={styles.gridHeader}>
                        <Text style={styles.gridTitle}>MORE GIGS</Text>
                    </View>
                    <View style={styles.grid}>
                        {gridGigs.map((gig, index) => (
                            <GigCardCompact
                                key={gig.id}
                                gig={gig}
                                index={index + 1}
                                onPress={() => onGigPress?.(gig)}
                            />
                        ))}
                    </View>
                </>
            )}

            {/* Bottom spacer for tab bar */}
            <View style={{ height: 100 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: KARYA_BLACK,
        letterSpacing: 1,
    },
    gigCount: {
        fontSize: 13,
        fontWeight: '600',
        color: KARYA_BLACK,
        opacity: 0.6,
    },
    gridHeader: {
        marginTop: 8,
        marginBottom: 12,
    },
    gridTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: KARYA_BLACK,
        letterSpacing: 1.5,
        opacity: 0.5,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
});
