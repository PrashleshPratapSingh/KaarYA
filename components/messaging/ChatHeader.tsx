import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BrandColors, UIColors } from '../../constants/Colors';
import { User } from '../../types/messaging';

interface ChatHeaderProps {
    user: User;
    onBack: () => void;
    onViewProfile?: () => void;
    onViewGig?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
    user,
    onBack,
    onViewProfile,
    onViewGig,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.leftSection}>
                <TouchableOpacity
                    onPress={onBack}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <Ionicons name="chevron-back" size={24} color={BrandColors.black} />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onViewProfile}
                    style={styles.userInfo}
                    activeOpacity={0.7}
                >
                    {user.avatar ? (
                        <Image source={{ uri: user.avatar }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>
                                {user.name.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    )}
                    <View style={styles.nameContainer}>
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={styles.userStatus}>
                            {user.status === 'online' ? '● Online' : 'Offline'}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.rightSection}>
                {onViewGig && (
                    <TouchableOpacity
                        style={styles.gigButton}
                        onPress={onViewGig}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.gigButtonText}>VIEW GIG</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: BrandColors.cream,
        paddingHorizontal: 16,
        paddingVertical: 14,
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 14,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.08)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 2.5,
        borderColor: BrandColors.yellow,
    },
    avatarPlaceholder: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: BrandColors.yellow,
        borderWidth: 2.5,
        borderColor: BrandColors.black,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    avatarText: {
        fontSize: 20,
        fontWeight: '700',
        color: BrandColors.black,
    },
    nameContainer: {
        marginLeft: 12,
        flex: 1,
    },
    userName: {
        fontSize: 17,
        fontWeight: '700',
        color: BrandColors.black,
        letterSpacing: 0.3,
    },
    userStatus: {
        fontSize: 13,
        color: BrandColors.green,
        marginTop: 3,
        fontWeight: '500',
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    gigButton: {
        backgroundColor: BrandColors.black,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    gigButtonText: {
        fontSize: 11,
        fontWeight: '700',
        color: BrandColors.white,
        letterSpacing: 0.8,
    },
});
