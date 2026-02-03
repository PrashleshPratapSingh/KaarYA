import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable, Animated, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { BrandColors, UIColors } from '../../constants/Colors';
import { User } from '../../types/messaging';

interface ProfileDetailsModalProps {
    visible: boolean;
    onClose: () => void;
    user: User;
}

export const ProfileDetailsModal: React.FC<ProfileDetailsModalProps> = ({
    visible,
    onClose,
    user,
}) => {
    const slideAnim = useRef(new Animated.Value(500)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        if (visible) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 0,
                    useNativeDriver: true,
                    damping: 20,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: 500,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const handleAction = (action: () => void) => {
        Haptics.selectionAsync();
        // Placeholder action
    };

    const getInitials = (name: string) => {
        const parts = name.split(' ');
        if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`;
        return name.slice(0, 2).toUpperCase();
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Animated.View
                    style={[
                        styles.cardContainer,
                        { transform: [{ translateY: slideAnim }, { scale: scaleAnim }] }
                    ]}
                >
                    {/* Decorative Header Bar */}
                    <View style={styles.headerBar} />

                    {/* Avatar Section */}
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
                        </View>
                        <View style={styles.onlineBadge} />
                    </View>

                    {/* User Info */}
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userRole}>Freelance UI/UX Designer</Text>

                    {/* GenZ Tags */}
                    <View style={styles.tagsRow}>
                        <View style={[styles.tag, { backgroundColor: '#F3E5F5' }]}>
                            <Text style={[styles.tagText, { color: '#9C27B0' }]}>✨ Creative</Text>
                        </View>
                        <View style={[styles.tag, { backgroundColor: '#E3F2FD' }]}>
                            <Text style={[styles.tagText, { color: '#1976D2' }]}>🚀 Fast</Text>
                        </View>
                        <View style={[styles.tag, { backgroundColor: '#FFF3E0' }]}>
                            <Text style={[styles.tagText, { color: '#F57C00' }]}>🔥 Pro</Text>
                        </View>
                    </View>

                    {/* Stats Grid */}
                    <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>4.9 ⭐</Text>
                            <Text style={styles.statLabel}>Rating</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>127</Text>
                            <Text style={styles.statLabel}>Gigs</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>98%</Text>
                            <Text style={styles.statLabel}>On Time</Text>
                        </View>
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8} onPress={() => handleAction(() => { })}>
                            <Text style={styles.primaryButtonText}>View Portfolio</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
                            <Ionicons name="gift-outline" size={24} color={BrandColors.black} />
                        </TouchableOpacity>
                    </View>

                </Animated.View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Slightly darker overlay for focus
        justifyContent: 'center', // Center it nicely
        alignItems: 'center',
        padding: 20,
    },
    cardContainer: {
        width: '100%',
        backgroundColor: BrandColors.cream,
        borderRadius: 30,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    headerBar: {
        width: 40,
        height: 4,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 2,
        marginBottom: 24,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: BrandColors.yellow,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#FFFFFF',
        shadowColor: BrandColors.yellow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    avatarText: {
        fontSize: 36,
        fontWeight: '700',
        color: BrandColors.black,
    },
    onlineBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: BrandColors.green,
        borderWidth: 3,
        borderColor: BrandColors.cream,
    },
    userName: {
        fontSize: 24,
        fontWeight: '800',
        color: BrandColors.black,
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    userRole: {
        fontSize: 14,
        fontWeight: '500',
        color: BrandColors.mediumGray,
        marginBottom: 20,
    },
    tagsRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 24,
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    tagText: {
        fontSize: 12,
        fontWeight: '600',
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
        paddingHorizontal: 10,
        borderRadius: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: BrandColors.black,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: BrandColors.mediumGray,
        fontWeight: '500',
    },
    divider: {
        width: 1,
        height: '80%',
        backgroundColor: '#F0F0F0',
        alignSelf: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    primaryButton: {
        flex: 1,
        backgroundColor: BrandColors.black,
        borderRadius: 16,
        paddingVertical: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: BrandColors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    iconButton: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
});
