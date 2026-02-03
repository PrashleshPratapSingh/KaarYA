/**
 * Sparkle - Animated star decoration
 */
import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { KARYA_BLACK } from './types';

interface Props {
    delay?: number;
    size?: number;
}

export function Sparkle({ delay = 0, size = 16 }: Props) {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const anim = Animated.loop(
            Animated.sequence([
                Animated.delay(delay),
                Animated.parallel([
                    Animated.timing(scaleAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
                    Animated.timing(rotateAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
                ]),
                Animated.timing(scaleAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
                Animated.delay(2000),
            ])
        );
        anim.start();
        return () => anim.stop();
    }, []);

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    return (
        <Animated.View style={[styles.sparkle, { transform: [{ scale: scaleAnim }, { rotate }] }]}>
            <Feather name="star" size={size} color={KARYA_BLACK} />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    sparkle: {
        position: 'absolute',
    },
});
