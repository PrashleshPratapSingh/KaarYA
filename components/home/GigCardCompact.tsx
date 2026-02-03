/**
 * GigCardCompact - Duolingo-style bouncy interactions
 * Minimal entrance, playful tap feedback
 */
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { KARYA_BLACK, KARYA_WHITE, KARYA_YELLOW, BADGE_COLORS, Gig } from './types';

interface Props {
    gig: Gig;
    index: number;
    onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GigCardCompact({ gig, index, onPress }: Props) {
    // Duolingo-style bouncy press
    const scale = useSharedValue(1);
    const translateY = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { translateY: translateY.value },
        ],
    }));

    const handlePressIn = () => {
        // Duolingo squish down
        scale.value = withSpring(0.95, { damping: 20, stiffness: 400 });
        translateY.value = withSpring(3, { damping: 20, stiffness: 400 });
    };

    const handlePressOut = () => {
        // Duolingo bounce back with overshoot
        scale.value = withSequence(
            withSpring(1.03, { damping: 10, stiffness: 500 }),
            withSpring(1, { damping: 15, stiffness: 300 })
        );
        translateY.value = withSequence(
            withSpring(-2, { damping: 10, stiffness: 500 }),
            withSpring(0, { damping: 15, stiffness: 300 })
        );
    };

    const badgeColor = BADGE_COLORS[gig.collegeCode] || BADGE_COLORS.du;
    const isEven = index % 2 === 0;
    const cardHeight = isEven ? 180 : 160;

    return (
        <Animated.View style={[styles.cardWrapper, animatedStyle]}>
            <AnimatedPressable
                style={[styles.card, { minHeight: cardHeight }]}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                {/* Category Badge */}
                <View style={[styles.categoryBadge, { backgroundColor: badgeColor }]}>
                    <Text style={styles.categoryText}>{gig.category.toUpperCase()}</Text>
                </View>

                {/* Title */}
                <Text style={styles.title} numberOfLines={2}>
                    {gig.title}
                </Text>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.budget}>₹{gig.budget.toLocaleString()}</Text>
                    <View style={styles.applicantsBadge}>
                        <Feather name="users" size={10} color={KARYA_BLACK} />
                        <Text style={styles.applicantsText}>{gig.applicants}</Text>
                    </View>
                </View>

                {/* College Badge */}
                <Text style={styles.college}>{gig.college}</Text>
            </AnimatedPressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    cardWrapper: {
        width: '48%',
        marginBottom: 12,
    },
    card: {
        backgroundColor: KARYA_WHITE,
        borderRadius: 16,
        borderWidth: 2.5,
        borderColor: KARYA_BLACK,
        padding: 14,
        justifyContent: 'space-between',
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        marginBottom: 8,
    },
    categoryText: {
        fontSize: 8,
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
    college: {
        fontSize: 9,
        fontWeight: '600',
        color: '#888',
        marginTop: 6,
    },
});
