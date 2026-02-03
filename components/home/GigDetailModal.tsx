/**
 * GigDetailModal - Splash transition with Duolingo-style feedback
 */
import React from 'react';
import { View, Text, StyleSheet, Pressable, Modal, ScrollView, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    withSequence,
    withDelay,
    interpolate,
    Extrapolation,
    runOnJS,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { KARYA_BLACK, KARYA_WHITE, KARYA_YELLOW, BADGE_COLORS, Gig } from './types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
    visible: boolean;
    gig: Gig | null;
    onClose: () => void;
    onApply: () => void;
}

export function GigDetailModal({ visible, gig, onClose, onApply }: Props) {
    // Splash circle animation
    const splashScale = useSharedValue(0);
    const contentOpacity = useSharedValue(0);
    const contentTranslateY = useSharedValue(30);

    // Button feedback
    const applyButtonScale = useSharedValue(1);
    const closeButtonScale = useSharedValue(1);

    React.useEffect(() => {
        if (visible) {
            // Splash expand
            splashScale.value = withSpring(2.5, { damping: 15, stiffness: 80 });
            // Content fade in after splash
            contentOpacity.value = withDelay(200, withTiming(1, { duration: 300 }));
            contentTranslateY.value = withDelay(200, withSpring(0, { damping: 15, stiffness: 100 }));
        } else {
            // Quick collapse
            contentOpacity.value = withTiming(0, { duration: 150 });
            contentTranslateY.value = withTiming(30, { duration: 150 });
            splashScale.value = withDelay(100, withTiming(0, { duration: 200 }));
        }
    }, [visible]);

    const splashStyle = useAnimatedStyle(() => ({
        transform: [{ scale: splashScale.value }],
        opacity: interpolate(splashScale.value, [0, 0.5, 2.5], [0, 1, 1], Extrapolation.CLAMP),
    }));

    const contentStyle = useAnimatedStyle(() => ({
        opacity: contentOpacity.value,
        transform: [{ translateY: contentTranslateY.value }],
    }));

    const applyButtonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: applyButtonScale.value }],
    }));

    const closeButtonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: closeButtonScale.value }],
    }));

    const handleApplyPressIn = () => {
        applyButtonScale.value = withSpring(0.92, { damping: 20, stiffness: 400 });
    };

    const handleApplyPressOut = () => {
        applyButtonScale.value = withSequence(
            withSpring(1.05, { damping: 10, stiffness: 400 }),
            withSpring(1, { damping: 15, stiffness: 300 })
        );
    };

    const handleClosePressIn = () => {
        closeButtonScale.value = withSpring(0.85, { damping: 20, stiffness: 400 });
    };

    const handleClosePressOut = () => {
        closeButtonScale.value = withSequence(
            withSpring(1.1, { damping: 10, stiffness: 400 }),
            withSpring(1, { damping: 15, stiffness: 300 })
        );
    };

    if (!gig) return null;

    const badgeColor = BADGE_COLORS[gig.collegeCode] || BADGE_COLORS.du;

    return (
        <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
            <View style={styles.container}>
                {/* Splash Circle */}
                <Animated.View style={[styles.splash, splashStyle]} />

                {/* Content */}
                <Animated.View style={[styles.contentWrapper, contentStyle]}>
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Close Button */}
                        <Animated.View style={closeButtonStyle}>
                            <Pressable
                                style={styles.closeBtn}
                                onPress={onClose}
                                onPressIn={handleClosePressIn}
                                onPressOut={handleClosePressOut}
                            >
                                <Feather name="x" size={24} color={KARYA_BLACK} />
                            </Pressable>
                        </Animated.View>

                        {/* College Badge */}
                        <View style={[styles.collegeBadge, { backgroundColor: badgeColor }]}>
                            <Text style={styles.collegeBadgeText}>{gig.college}</Text>
                        </View>

                        {/* Title */}
                        <Text style={styles.title}>{gig.title}</Text>

                        {/* Budget */}
                        <View style={styles.budgetSection}>
                            <Text style={styles.budgetLabel}>BUDGET</Text>
                            <Text style={styles.budgetAmount}>₹{gig.budget.toLocaleString()}</Text>
                        </View>

                        {/* Poster Card */}
                        <View style={styles.posterCard}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>
                                    {gig.postedBy.charAt(0).toUpperCase()}
                                </Text>
                            </View>
                            <View style={styles.posterInfo}>
                                <Text style={styles.posterName}>{gig.postedBy}</Text>
                                <Text style={styles.posterCollege}>{gig.college}</Text>
                                <View style={styles.posterStats}>
                                    <Feather name="star" size={12} color={KARYA_YELLOW} />
                                    <Text style={styles.statText}>4.8</Text>
                                    <Text style={styles.statDivider}>•</Text>
                                    <Text style={styles.statText}>12 gigs</Text>
                                </View>
                            </View>
                        </View>

                        {/* Details */}
                        <View style={styles.detailsRow}>
                            <View style={styles.detailItem}>
                                <Feather name="clock" size={16} color="#666" />
                                <Text style={styles.detailText}>{gig.timeAgo}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Feather name="users" size={16} color="#666" />
                                <Text style={styles.detailText}>{gig.applicants} applied</Text>
                            </View>
                        </View>

                        {/* Apply Button */}
                        <Animated.View style={applyButtonStyle}>
                            <Pressable
                                style={styles.applyButton}
                                onPress={onApply}
                                onPressIn={handleApplyPressIn}
                                onPressOut={handleApplyPressOut}
                            >
                                <Text style={styles.applyButtonText}>SEND APPLICATION</Text>
                                <Feather name="send" size={18} color={KARYA_YELLOW} />
                            </Pressable>
                        </Animated.View>
                    </ScrollView>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    splash: {
        position: 'absolute',
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH,
        borderRadius: SCREEN_WIDTH / 2,
        backgroundColor: KARYA_YELLOW,
        top: SCREEN_HEIGHT / 2 - SCREEN_WIDTH / 2,
        left: 0,
    },
    contentWrapper: {
        flex: 1,
        paddingTop: 60,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    closeBtn: {
        alignSelf: 'flex-end',
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: KARYA_WHITE,
        borderWidth: 2.5,
        borderColor: KARYA_BLACK,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    collegeBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        marginBottom: 16,
    },
    collegeBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        color: KARYA_WHITE,
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: KARYA_BLACK,
        lineHeight: 34,
        marginBottom: 24,
    },
    budgetSection: {
        marginBottom: 28,
    },
    budgetLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#666',
        letterSpacing: 1.5,
        marginBottom: 4,
    },
    budgetAmount: {
        fontSize: 40,
        fontWeight: '900',
        color: KARYA_BLACK,
    },
    posterCard: {
        flexDirection: 'row',
        backgroundColor: KARYA_WHITE,
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 2.5,
        borderColor: KARYA_BLACK,
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: KARYA_BLACK,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    avatarText: {
        fontSize: 22,
        fontWeight: '900',
        color: KARYA_YELLOW,
    },
    posterInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    posterName: {
        fontSize: 17,
        fontWeight: '800',
        color: KARYA_BLACK,
    },
    posterCollege: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    posterStats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 6,
    },
    statText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600',
    },
    statDivider: {
        fontSize: 12,
        color: '#CCC',
    },
    detailsRow: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 28,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailText: {
        fontSize: 14,
        color: KARYA_BLACK,
        fontWeight: '600',
    },
    applyButton: {
        flexDirection: 'row',
        backgroundColor: KARYA_BLACK,
        paddingVertical: 18,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    applyButtonText: {
        fontSize: 15,
        fontWeight: '800',
        color: KARYA_YELLOW,
        letterSpacing: 1,
    },
});
