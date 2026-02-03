/**
 * CategoryChip - Simple bouncy filter chip
 */
import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { KARYA_BLACK, KARYA_WHITE, KARYA_YELLOW } from './types';

interface Props {
    label: string;
    icon: keyof typeof Feather.glyphMap;
    isActive?: boolean;
    onPress?: () => void;
    index?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CategoryChip({ label, icon, isActive = false, onPress }: Props) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.9, { damping: 20, stiffness: 400 });
    };

    const handlePressOut = () => {
        scale.value = withSequence(
            withSpring(1.05, { damping: 10, stiffness: 500 }),
            withSpring(1, { damping: 15, stiffness: 300 })
        );
    };

    return (
        <AnimatedPressable
            style={[
                styles.chip,
                isActive && styles.chipActive,
                animatedStyle,
            ]}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            <Feather
                name={icon}
                size={14}
                color={isActive ? KARYA_YELLOW : KARYA_BLACK}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
                {label}
            </Text>
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: KARYA_WHITE,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 2.5,
        borderColor: KARYA_BLACK,
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
