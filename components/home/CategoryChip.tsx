/**
 * CategoryChip - Static filter chip with subtle press feedback
 * No bouncing - stays within frame
 */
import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
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
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const handlePressIn = () => {
        // Subtle scale down - no bounce
        scale.value = withTiming(0.96, { duration: 100 });
        opacity.value = withTiming(0.8, { duration: 100 });
    };

    const handlePressOut = () => {
        // Quick return to normal - no overshoot
        scale.value = withTiming(1, { duration: 150 });
        opacity.value = withTiming(1, { duration: 150 });
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
