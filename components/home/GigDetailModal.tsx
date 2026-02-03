/**
 * GigDetailModal - Splash transition with comprehensive poster portfolio
 */
import React from 'react';
import { View, Text, StyleSheet, Pressable, Modal, ScrollView, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    interpolate,
    Extrapolation,
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

    // Button feedback - no bounce
    const applyButtonScale = useSharedValue(1);
    const closeButtonScale = useSharedValue(1);

    React.useEffect(() => {
        if (visible) {
            // Splash expand
            splashScale.value = withTiming(2.5, { duration: 400 });
            // Content fade in after splash
            contentOpacity.value = withDelay(200, withTiming(1, { duration: 300 }));
            contentTranslateY.value = withDelay(200, withTiming(0, { duration: 300 }));
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
        applyButtonScale.value = withTiming(0.95, { duration: 100 });
    };

    const handleApplyPressOut = () => {
        applyButtonScale.value = withTiming(1, { duration: 150 });
    };

    const handleClosePressIn = () => {
        closeButtonScale.value = withTiming(0.9, { duration: 100 });
    };

    const handleClosePressOut = () => {
        closeButtonScale.value = withTiming(1, { duration: 150 });
    };

    if (!gig) return null;

    const badgeColor = BADGE_COLORS[gig.collegeCode] || BADGE_COLORS.du;
    const posterDetails = gig.posterDetails;

    // Star rating component
    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<Feather key={i} name="star" size={14} color={KARYA_YELLOW} />);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<Feather key={i} name="star" size={14} color={KARYA_YELLOW} />);
            } else {
                stars.push(<Feather key={i} name="star" size={14} color="#DDD" />);
            }
        }
        return stars;
    };

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

                        {/* Gig Info Section */}
                        <View style={styles.gigInfoSection}>
                            <View style={[styles.collegeBadge, { backgroundColor: badgeColor }]}>
                                <Text style={styles.collegeBadgeText}>{gig.college}</Text>
                            </View>

                            <Text style={styles.title}>{gig.title}</Text>

                            <View style={styles.budgetRow}>
                                <View>
                                    <Text style={styles.budgetLabel}>BUDGET</Text>
                                    <Text style={styles.budgetAmount}>₹{gig.budget.toLocaleString()}</Text>
                                </View>
                                <View style={styles.quickStats}>
                                    <View style={styles.quickStat}>
                                        <Feather name="clock" size={14} color="#666" />
                                        <Text style={styles.quickStatText}>{gig.timeAgo}</Text>
                                    </View>
                                    <View style={styles.quickStat}>
                                        <Feather name="users" size={14} color="#666" />
                                        <Text style={styles.quickStatText}>{gig.applicants} applied</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Poster Portfolio Section */}
                        <View style={styles.portfolioSection}>
                            <Text style={styles.sectionTitle}>ABOUT THE POSTER</Text>

                            {/* Poster Header */}
                            <View style={styles.posterHeader}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>
                                        {gig.postedBy.charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                                <View style={styles.posterBasicInfo}>
                                    <View style={styles.nameRow}>
                                        <Text style={styles.posterName}>{gig.postedBy}</Text>
                                        {posterDetails?.verified && (
                                            <View style={styles.verifiedBadge}>
                                                <Feather name="check-circle" size={16} color="#4CAF50" />
                                                <Text style={styles.verifiedText}>Verified</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={styles.posterCollege}>{gig.college}</Text>
                                    {posterDetails?.memberSince && (
                                        <Text style={styles.memberSince}>
                                            Member since {posterDetails.memberSince}
                                        </Text>
                                    )}
                                </View>
                            </View>

                            {/* Bio */}
                            {posterDetails?.bio && (
                                <View style={styles.bioSection}>
                                    <Text style={styles.bioTitle}>What They Do</Text>
                                    <Text style={styles.bioText}>{posterDetails.bio}</Text>
                                </View>
                            )}

                            {/* Expertise */}
                            {posterDetails?.expertise && posterDetails.expertise.length > 0 && (
                                <View style={styles.expertiseSection}>
                                    <Text style={styles.expertiseTitle}>Areas of Expertise</Text>
                                    <View style={styles.expertiseTags}>
                                        {posterDetails.expertise.map((skill, index) => (
                                            <View key={index} style={styles.expertiseTag}>
                                                <Text style={styles.expertiseTagText}>{skill}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}

                            {/* Stats Cards */}
                            {posterDetails && (
                                <View style={styles.statsSection}>
                                    {/* Rating Card */}
                                    <View style={styles.statCard}>
                                        <View style={styles.starsRow}>
                                            {renderStars(posterDetails.rating)}
                                        </View>
                                        <Text style={styles.ratingValue}>{posterDetails.rating.toFixed(1)}</Text>
                                        <Text style={styles.ratingLabel}>
                                            from {posterDetails.reviewCount} reviews
                                        </Text>
                                    </View>

                                    {/* Gigs Completed Card */}
                                    <View style={styles.statCard}>
                                        <Feather name="briefcase" size={20} color="#2196F3" />
                                        <Text style={styles.statValue}>{posterDetails.pastGigs}</Text>
                                        <Text style={styles.statLabel}>Gigs Completed</Text>
                                    </View>

                                    {/* Completion Rate Card */}
                                    <View style={styles.statCard}>
                                        <Feather name="trending-up" size={20} color="#4CAF50" />
                                        <Text style={styles.statValue}>{posterDetails.completionRate}%</Text>
                                        <Text style={styles.statLabel}>Success Rate</Text>
                                    </View>

                                    {/* Response Time Card */}
                                    <View style={styles.statCard}>
                                        <Feather name="zap" size={20} color="#FF9800" />
                                        <Text style={styles.responseTime}>{posterDetails.responseTime}</Text>
                                        <Text style={styles.statLabel}>Avg. Response</Text>
                                    </View>
                                </View>
                            )}

                            {/* How They Work */}
                            <View style={styles.howTheyWorkSection}>
                                <Text style={styles.howTheyWorkTitle}>How They Work</Text>
                                <View style={styles.workStyle}>
                                    <View style={styles.workItem}>
                                        <Feather name="message-circle" size={18} color={KARYA_BLACK} />
                                        <Text style={styles.workItemText}>Quick communication</Text>
                                    </View>
                                    <View style={styles.workItem}>
                                        <Feather name="check-square" size={18} color={KARYA_BLACK} />
                                        <Text style={styles.workItemText}>Clear requirements</Text>
                                    </View>
                                    <View style={styles.workItem}>
                                        <Feather name="credit-card" size={18} color={KARYA_BLACK} />
                                        <Text style={styles.workItemText}>Prompt payments</Text>
                                    </View>
                                </View>
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
        paddingTop: 50,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
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
        marginBottom: 16,
    },

    // Gig Info Section
    gigInfoSection: {
        backgroundColor: KARYA_WHITE,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 2.5,
        borderColor: KARYA_BLACK,
    },
    collegeBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
        marginBottom: 12,
    },
    collegeBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        color: KARYA_WHITE,
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 22,
        fontWeight: '900',
        color: KARYA_BLACK,
        lineHeight: 28,
        marginBottom: 16,
    },
    budgetRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    budgetLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#888',
        letterSpacing: 1,
        marginBottom: 2,
    },
    budgetAmount: {
        fontSize: 32,
        fontWeight: '900',
        color: KARYA_BLACK,
    },
    quickStats: {
        alignItems: 'flex-end',
        gap: 4,
    },
    quickStat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    quickStatText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600',
    },

    // Portfolio Section
    portfolioSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: KARYA_BLACK,
        letterSpacing: 1.5,
        marginBottom: 12,
        opacity: 0.5,
    },
    posterHeader: {
        flexDirection: 'row',
        backgroundColor: KARYA_WHITE,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 2.5,
        borderColor: KARYA_BLACK,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: KARYA_BLACK,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    avatarText: {
        fontSize: 24,
        fontWeight: '900',
        color: KARYA_YELLOW,
    },
    posterBasicInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 2,
    },
    posterName: {
        fontSize: 18,
        fontWeight: '800',
        color: KARYA_BLACK,
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
    },
    verifiedText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#4CAF50',
    },
    posterCollege: {
        fontSize: 13,
        color: '#666',
        fontWeight: '600',
    },
    memberSince: {
        fontSize: 11,
        color: '#999',
        marginTop: 4,
    },

    // Bio Section
    bioSection: {
        backgroundColor: KARYA_WHITE,
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: KARYA_BLACK,
    },
    bioTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: KARYA_BLACK,
        marginBottom: 6,
    },
    bioText: {
        fontSize: 14,
        color: '#444',
        lineHeight: 20,
    },

    // Expertise Section
    expertiseSection: {
        marginBottom: 12,
    },
    expertiseTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: KARYA_BLACK,
        marginBottom: 8,
    },
    expertiseTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    expertiseTag: {
        backgroundColor: KARYA_YELLOW,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: KARYA_BLACK,
    },
    expertiseTagText: {
        fontSize: 12,
        fontWeight: '700',
        color: KARYA_BLACK,
    },

    // Stats Section
    statsSection: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 12,
    },
    statCard: {
        width: '48%',
        backgroundColor: KARYA_WHITE,
        borderRadius: 12,
        padding: 14,
        borderWidth: 2,
        borderColor: KARYA_BLACK,
        alignItems: 'center',
    },
    starsRow: {
        flexDirection: 'row',
        gap: 2,
        marginBottom: 4,
    },
    ratingValue: {
        fontSize: 24,
        fontWeight: '900',
        color: KARYA_BLACK,
    },
    ratingLabel: {
        fontSize: 10,
        color: '#888',
        fontWeight: '600',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '900',
        color: KARYA_BLACK,
        marginTop: 4,
    },
    statLabel: {
        fontSize: 10,
        color: '#888',
        fontWeight: '600',
        textAlign: 'center',
    },
    responseTime: {
        fontSize: 14,
        fontWeight: '800',
        color: KARYA_BLACK,
        marginTop: 4,
        textAlign: 'center',
    },

    // How They Work Section
    howTheyWorkSection: {
        backgroundColor: KARYA_WHITE,
        borderRadius: 12,
        padding: 14,
        borderWidth: 2,
        borderColor: KARYA_BLACK,
    },
    howTheyWorkTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: KARYA_BLACK,
        marginBottom: 10,
    },
    workStyle: {
        gap: 8,
    },
    workItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    workItemText: {
        fontSize: 13,
        color: '#444',
        fontWeight: '600',
    },

    // Apply Button
    applyButton: {
        flexDirection: 'row',
        backgroundColor: KARYA_BLACK,
        paddingVertical: 18,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginTop: 8,
    },
    applyButtonText: {
        fontSize: 15,
        fontWeight: '800',
        color: KARYA_YELLOW,
        letterSpacing: 1,
    },
});
