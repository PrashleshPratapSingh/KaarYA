/**
 * GigCard - Featured card with subtle press feedback
 * No bounce animations - clean and stable
 */
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { KARYA_BLACK, KARYA_WHITE, KARYA_YELLOW, BADGE_COLORS, Gig } from './types';

interface Props {
    gig: Gig;
    index: number;
    onPress?: () => void;
    onApply?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GigCard({ gig, index, onPress, onApply }: Props) {
    // Card press animation - subtle, no bounce
    const cardScale = useSharedValue(1);
    const cardOpacity = useSharedValue(1);

    // Button press animation - subtle, no bounce
    const buttonScale = useSharedValue(1);
    const buttonOpacity = useSharedValue(1);

    const cardAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: cardScale.value }],
        opacity: cardOpacity.value,
    }));

    const buttonAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }],
        opacity: buttonOpacity.value,
    }));

    const handleCardPressIn = () => {
        cardScale.value = withTiming(0.98, { duration: 100 });
        cardOpacity.value = withTiming(0.9, { duration: 100 });
    };

    const handleCardPressOut = () => {
        cardScale.value = withTiming(1, { duration: 150 });
        cardOpacity.value = withTiming(1, { duration: 150 });
    };

    const handleButtonPressIn = () => {
        buttonScale.value = withTiming(0.95, { duration: 100 });
        buttonOpacity.value = withTiming(0.8, { duration: 100 });
    };

    const handleButtonPressOut = () => {
        buttonScale.value = withTiming(1, { duration: 150 });
        buttonOpacity.value = withTiming(1, { duration: 150 });
    };


    const badgeColor = BADGE_COLORS[gig.collegeCode] || BADGE_COLORS.du;

    return (
        <Animated.View style={[styles.cardContainer, cardAnimatedStyle]}>
            <AnimatedPressable
                style={styles.card}
                onPress={onPress}
                onPressIn={handleCardPressIn}
                onPressOut={handleCardPressOut}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.meta}>
                        <View style={[styles.collegeBadge, { backgroundColor: badgeColor }]}>
                            <Text style={styles.collegeBadgeText}>{gig.college}</Text>
                        </View>
                        <Text style={styles.timeAgo}>{gig.timeAgo}</Text>
                    </View>
                    <View style={styles.applicantsBadge}>
                        <Feather name="users" size={12} color={KARYA_BLACK} />
                        <Text style={styles.applicantsText}>{gig.applicants}</Text>
                    </View>
                </View>

                {/* Title */}
                <Text style={styles.title}>{gig.title}</Text>

                {/* Footer */}
                <View style={styles.footer}>
                    <View>
                        <Text style={styles.budgetLabel}>BUDGET</Text>
                        <Text style={styles.budgetAmount}>₹{gig.budget.toLocaleString()}</Text>
                    </View>
                    <View style={styles.postedBy}>
                        <Text style={styles.postedByLabel}>by</Text>
                        <Text style={styles.postedByName}>{gig.postedBy}</Text>
                    </View>
                </View>

                {/* Apply Button - Duolingo bouncy */}
                <AnimatedPressable
                    style={[styles.applyButton, buttonAnimatedStyle]}
                    onPress={onApply}
                    onPressIn={handleButtonPressIn}
                    onPressOut={handleButtonPressOut}
                >
                    <Text style={styles.applyButtonText}>APPLY NOW</Text>
                    <Feather name="arrow-right" size={18} color={KARYA_YELLOW} />
                </AnimatedPressable>
            </AnimatedPressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        marginBottom: 16,
    },
    card: {
        backgroundColor: KARYA_WHITE,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: KARYA_BLACK,
        padding: 18,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    collegeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    collegeBadgeText: {
        fontSize: 9,
        fontWeight: '800',
        color: KARYA_WHITE,
        letterSpacing: 0.5,
    },
    timeAgo: {
        fontSize: 12,
        color: '#888',
        fontWeight: '500',
    },
    applicantsBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: KARYA_YELLOW,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: KARYA_BLACK,
    },
    applicantsText: {
        fontSize: 11,
        fontWeight: '700',
        color: KARYA_BLACK,
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        color: KARYA_BLACK,
        lineHeight: 24,
        marginBottom: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 16,
    },
    budgetLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: '#888',
        letterSpacing: 1,
        marginBottom: 2,
    },
    budgetAmount: {
        fontSize: 24,
        fontWeight: '900',
        color: KARYA_BLACK,
    },
    postedBy: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    postedByLabel: {
        fontSize: 12,
        color: '#888',
    },
    postedByName: {
        fontSize: 14,
        fontWeight: '700',
        color: KARYA_BLACK,
    },
    applyButton: {
        flexDirection: 'row',
        backgroundColor: KARYA_BLACK,
        paddingVertical: 14,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    applyButtonText: {
        fontSize: 14,
        fontWeight: '800',
        color: KARYA_YELLOW,
        letterSpacing: 1,
    },
});
