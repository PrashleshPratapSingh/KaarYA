/**
 * BentoGrid - Clean Bento-style asymmetric grid layout
 * Variable card sizes for visual interest
 */
import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { KARYA_BLACK, KARYA_WHITE, KARYA_YELLOW, BADGE_COLORS, Gig } from './types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_PADDING = 20;
const GRID_GAP = 12;
const FULL_WIDTH = SCREEN_WIDTH - (GRID_PADDING * 2);
const HALF_WIDTH = (FULL_WIDTH - GRID_GAP) / 2;

interface Props {
    gigs: Gig[];
    onGigPress?: (gig: Gig) => void;
}

export function BentoGrid({ gigs, onGigPress }: Props) {
    if (gigs.length === 0) return null;

    // Create rows: pair up cards, 2 per row
    const rows: Gig[][] = [];
    for (let i = 0; i < gigs.length; i += 2) {
        if (i + 1 < gigs.length) {
            rows.push([gigs[i], gigs[i + 1]]);
        } else {
            rows.push([gigs[i]]);
        }
    }

    return (
        <View style={styles.container}>
            {rows.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((gig) => (
                        <BentoCard
                            key={gig.id}
                            gig={gig}
                            isWide={row.length === 1}
                            onPress={() => onGigPress?.(gig)}
                        />
                    ))}
                </View>
            ))}
        </View>
    );
}

interface CardProps {
    gig: Gig;
    isWide: boolean;
    onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function BentoCard({ gig, isWide, onPress }: CardProps) {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const handlePressIn = () => {
        scale.value = withTiming(0.97, { duration: 100 });
        opacity.value = withTiming(0.9, { duration: 100 });
    };

    const handlePressOut = () => {
        scale.value = withTiming(1, { duration: 150 });
        opacity.value = withTiming(1, { duration: 150 });
    };

    const badgeColor = BADGE_COLORS[gig.collegeCode] || BADGE_COLORS.du;
    const cardWidth = isWide ? FULL_WIDTH : HALF_WIDTH;
    const cardHeight = isWide ? 120 : 180;

    return (
        <Animated.View style={[{ width: cardWidth }, animatedStyle]}>
            <AnimatedPressable
                style={[styles.card, { minHeight: cardHeight }]}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                {/* Category Badge */}
                <View style={[styles.badge, { backgroundColor: badgeColor }]}>
                    <Text style={styles.badgeText}>
                        {gig.category.toUpperCase()}
                    </Text>
                </View>

                {/* Title */}
                <Text
                    style={[styles.title, isWide && styles.titleWide]}
                    numberOfLines={isWide ? 1 : 2}
                >
                    {gig.title}
                </Text>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={[styles.budget, isWide && styles.budgetWide]}>
                        ₹{gig.budget.toLocaleString()}
                    </Text>

                    <View style={styles.metaRow}>
                        <View style={styles.applicantsBadge}>
                            <Feather name="users" size={10} color={KARYA_BLACK} />
                            <Text style={styles.applicantsText}>{gig.applicants}</Text>
                        </View>
                        {isWide && (
                            <Text style={styles.timeAgo}>{gig.timeAgo}</Text>
                        )}
                    </View>
                </View>

                {/* College at bottom for tall cards */}
                {!isWide && (
                    <Text style={styles.college}>{gig.college}</Text>
                )}
            </AnimatedPressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: GRID_GAP,
    },
    row: {
        flexDirection: 'row',
        gap: GRID_GAP,
    },
    card: {
        flex: 1,
        backgroundColor: KARYA_WHITE,
        borderRadius: 16,
        borderWidth: 2.5,
        borderColor: KARYA_BLACK,
        padding: 14,
        justifyContent: 'space-between',
    },
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 8,
    },
    badgeText: {
        fontSize: 9,
        fontWeight: '800',
        color: KARYA_WHITE,
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 14,
        fontWeight: '800',
        color: KARYA_BLACK,
        lineHeight: 18,
        flex: 1,
    },
    titleWide: {
        fontSize: 15,
        flex: 0,
        marginBottom: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    budget: {
        fontSize: 18,
        fontWeight: '900',
        color: KARYA_BLACK,
    },
    budgetWide: {
        fontSize: 20,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    applicantsBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        backgroundColor: KARYA_YELLOW,
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: KARYA_BLACK,
    },
    applicantsText: {
        fontSize: 9,
        fontWeight: '700',
        color: KARYA_BLACK,
    },
    timeAgo: {
        fontSize: 11,
        fontWeight: '600',
        color: '#888',
    },
    college: {
        fontSize: 10,
        fontWeight: '600',
        color: '#888',
        marginTop: 6,
    },
});
