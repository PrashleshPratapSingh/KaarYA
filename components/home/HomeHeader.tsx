/**
 * HomeHeader - Clean title with notification bell
 */
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { KARYA_BLACK, KARYA_WHITE } from './types';

interface Props {
    onNotificationPress?: () => void;
}

export function HomeHeader({ onNotificationPress }: Props) {
    return (
        <View style={styles.header}>
            <View>
                <Text style={styles.greeting}>WHAT'S</Text>
                <Text style={styles.brandTitle}>HUSTLING?</Text>
            </View>
            <Pressable style={styles.notificationBtn} onPress={onNotificationPress}>
                <Feather name="bell" size={22} color={KARYA_BLACK} />
                <View style={styles.notificationDot} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 56,
        paddingBottom: 16,
    },
    greeting: {
        fontSize: 16,
        fontWeight: '700',
        color: KARYA_BLACK,
        letterSpacing: 2,
        opacity: 0.7,
    },
    brandTitle: {
        fontSize: 36,
        fontWeight: '900',
        color: KARYA_BLACK,
        letterSpacing: -1,
        marginTop: -4,
    },
    notificationBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
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
