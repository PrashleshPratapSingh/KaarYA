/**
 * GigCard - Gig listing with entrance animation
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Easing } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { KARYA_BLACK, KARYA_WHITE, KARYA_YELLOW, BADGE_COLORS, Gig } from './types';

interface Props {
    gig: Gig;
    index: number;
    onPress?: () => void;
    onApply?: () => void;
}

export function GigCard({ gig, index, onPress, onApply }: Props) {
    const slideAnim = useRef(new Animated.Value(50)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                delay: index * 100,
                easing: Easing.out(Easing.back(1.5)),
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 300,
                delay: index * 100,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handlePressIn = () => {
        Animated.timing(scaleAnim, { toValue: 0.98, duration: 100, useNativeDriver: true }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }).start();
    };

    const badgeColor = BADGE_COLORS[gig.collegeCode] || BADGE_COLORS.du;

    return (
        <Animated.View
            style={{
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
                opacity: opacityAnim,
            }}
        >
            <Pressable
                style={styles.card}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
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

                {/* Apply Button */}
                <Pressable style={styles.applyButton} onPress={onApply}>
                    <Text style={styles.applyButtonText}>APPLY NOW</Text>
                    <Feather name="arrow-right" size={18} color={KARYA_YELLOW} />
                </Pressable>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: KARYA_WHITE,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: KARYA_BLACK,
        padding: 18,
        marginBottom: 16,
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
