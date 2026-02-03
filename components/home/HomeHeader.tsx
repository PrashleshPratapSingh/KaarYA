/**
 * HomeHeader - Clean title with notification bell
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KARYA_BLACK, KARYA_WHITE } from './types';

interface Props {
    onNotificationPress?: () => void;
}

const ACCENT_YELLOW = '#FACC15';
const STORAGE_KEY = '@kaarya_onboarding_data';

export function HomeHeader({ onNotificationPress }: Props) {
    const [userName, setUserName] = useState<string>('');

    useEffect(() => {
        const loadUserName = async () => {
            try {
                const savedData = await AsyncStorage.getItem(STORAGE_KEY);
                if (savedData) {
                    const data = JSON.parse(savedData);
                    if (data.name) {
                        // Get first name only for cleaner display
                        const firstName = data.name.split(' ')[0];
                        setUserName(firstName.toUpperCase());
                    }
                }
            } catch (error) {
                console.error('Failed to load username:', error);
            }
        };

        loadUserName();
    }, []);

    return (
        <View style={styles.header}>
            {/* Greeting Row - WHAT'S + Username */}
            <View style={styles.greetingRow}>
                <Text style={styles.greeting}>WHAT'S</Text>
                {userName ? (
                    <View style={styles.userNameBadge}>
                        <Text style={styles.userName}>{userName}</Text>
                    </View>
                ) : null}
            </View>

            {/* Main Row - HUSTLING box + Bell aligned */}
            <View style={styles.mainRow}>
                {/* Creative white rectangle badge for HUSTLING */}
                <View style={styles.hustlingBadge}>
                    <View style={styles.hustlingShadow} />
                    <View style={styles.hustlingBox}>
                        <Text style={styles.brandTitle}>HUSTLING</Text>
                        <View style={styles.questionMark}>
                            <Text style={styles.questionText}>?</Text>
                        </View>
                    </View>
                </View>

                {/* Notification Bell - Aligned with HUSTLING box */}
                <Pressable style={styles.notificationBtn} onPress={onNotificationPress}>
                    <Feather name="bell" size={26} color={KARYA_BLACK} />
                    <View style={styles.notificationDot} />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'column',
        paddingHorizontal: 20,
        paddingTop: 56,
        paddingBottom: 20,
    },
    mainRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greetingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        gap: 8,
    },
    greeting: {
        fontSize: 14,
        fontWeight: '700',
        color: KARYA_BLACK,
        letterSpacing: 3,
        opacity: 0.6,
    },
    userNameBadge: {
        backgroundColor: KARYA_BLACK,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        transform: [{ rotate: '-2deg' }],
    },
    userName: {
        fontSize: 14,
        fontWeight: '900',
        color: KARYA_WHITE,
        letterSpacing: 1,
    },
    hustlingBadge: {
        position: 'relative',
        marginTop: 2,
    },
    hustlingShadow: {
        position: 'absolute',
        top: 4,
        left: 4,
        right: -4,
        bottom: -4,
        backgroundColor: KARYA_BLACK,
        borderRadius: 8,
    },
    hustlingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: KARYA_WHITE,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
        borderWidth: 3,
        borderColor: KARYA_BLACK,
    },
    brandTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: KARYA_BLACK,
        letterSpacing: -0.5,
    },
    questionMark: {
        marginLeft: 6,
        backgroundColor: ACCENT_YELLOW,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2.5,
        borderColor: KARYA_BLACK,
        transform: [{ rotate: '12deg' }],
    },
    questionText: {
        fontSize: 20,
        fontWeight: '900',
        color: KARYA_BLACK,
    },
    notificationBtn: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: KARYA_WHITE,
        borderWidth: 3,
        borderColor: KARYA_BLACK,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationDot: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#F44336',
        borderWidth: 2,
        borderColor: KARYA_WHITE,
    },
});
