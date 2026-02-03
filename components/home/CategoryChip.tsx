/**
 * CategoryChip - Filter button with bounce animation
 */
import React, { useRef } from 'react';
import { Pressable, Text, StyleSheet, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { KARYA_BLACK, KARYA_WHITE, KARYA_YELLOW } from './types';

interface Props {
    label: string;
    icon: string;
    isActive: boolean;
    onPress: () => void;
}

export function CategoryChip({ label, icon, isActive, onPress }: Props) {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePress = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 0.9, duration: 100, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, friction: 3, tension: 100, useNativeDriver: true }),
        ]).start();
        onPress();
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={handlePress}
            >
                <Feather name={icon as any} size={16} color={isActive ? KARYA_YELLOW : KARYA_BLACK} />
                <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: KARYA_WHITE,
        borderWidth: 2,
        borderColor: KARYA_BLACK,
        gap: 6,
    },
    chipActive: {
        backgroundColor: KARYA_BLACK,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: KARYA_BLACK,
        letterSpacing: 0.5,
    },
    labelActive: {
        color: KARYA_YELLOW,
    },
});
