/**
 * KaaryaMascot - Animated character with expressions
 * Duolingo-style bouncing mascot
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { KARYA_BLACK, KARYA_YELLOW, KARYA_WHITE, MascotMood } from './types';

interface Props {
    mood?: MascotMood;
    size?: number;
}

export function KaaryaMascot({ mood = 'happy', size = 80 }: Props) {
    const bounceAnim = useRef(new Animated.Value(0)).current;
    const waveAnim = useRef(new Animated.Value(0)).current;
    const blinkAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Bounce animation
        const bounce = Animated.loop(
            Animated.sequence([
                Animated.timing(bounceAnim, {
                    toValue: -8,
                    duration: 600,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(bounceAnim, {
                    toValue: 0,
                    duration: 600,
                    easing: Easing.in(Easing.quad),
                    useNativeDriver: true,
                }),
            ])
        );
        bounce.start();

        // Blink animation
        const blink = Animated.loop(
            Animated.sequence([
                Animated.delay(3000),
                Animated.timing(blinkAnim, {
                    toValue: 0.1,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(blinkAnim, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                }),
            ])
        );
        blink.start();

        // Wave animation
        if (mood === 'waving' || mood === 'excited') {
            const wave = Animated.loop(
                Animated.sequence([
                    Animated.timing(waveAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
                    Animated.timing(waveAnim, { toValue: -1, duration: 300, useNativeDriver: true }),
                    Animated.timing(waveAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
                ])
            );
            wave.start();
        }

        return () => {
            bounce.stop();
            blink.stop();
        };
    }, [mood]);

    const waveRotate = waveAnim.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: ['-20deg', '0deg', '20deg'],
    });

    const getMouthStyle = () => {
        switch (mood) {
            case 'excited':
                return { width: 20, height: 14, borderRadius: 10 };
            case 'thinking':
                return { width: 12, height: 4, borderRadius: 2, marginLeft: 8 };
            default:
                return { width: 24, height: 12, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 };
        }
    };

    return (
        <Animated.View
            style={[
                styles.container,
                { width: size, height: size * 1.2 },
                { transform: [{ translateY: bounceAnim }] },
            ]}
        >
            {/* Body */}
            <View style={[styles.body, { width: size * 0.7, height: size * 0.5 }]}>
                <Text style={[styles.letter, { fontSize: size * 0.25 }]}>K</Text>
            </View>

            {/* Head */}
            <View style={[styles.head, { width: size * 0.6, height: size * 0.5 }]}>
                <View style={styles.eyes}>
                    <Animated.View style={[styles.eye, { opacity: blinkAnim, width: size * 0.1, height: size * 0.12 }]} />
                    <Animated.View style={[styles.eye, { opacity: blinkAnim, width: size * 0.1, height: size * 0.12 }]} />
                </View>
                <View style={[styles.mouth, getMouthStyle()]} />
            </View>

            {/* Arms */}
            <View style={styles.arms}>
                <View style={[styles.arm, { width: size * 0.15, height: size * 0.35 }]} />
                <Animated.View
                    style={[
                        styles.arm,
                        { width: size * 0.15, height: size * 0.35 },
                        { transform: [{ rotate: waveRotate }] },
                    ]}
                />
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    body: {
        backgroundColor: KARYA_BLACK,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    letter: {
        color: KARYA_YELLOW,
        fontWeight: '900',
    },
    head: {
        backgroundColor: KARYA_BLACK,
        borderRadius: 100,
        position: 'absolute',
        top: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    eyes: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 4,
    },
    eye: {
        backgroundColor: KARYA_WHITE,
        borderRadius: 100,
    },
    mouth: {
        backgroundColor: KARYA_YELLOW,
        marginTop: 2,
    },
    arms: {
        position: 'absolute',
        bottom: 15,
        left: -15,
        right: -15,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    arm: {
        backgroundColor: KARYA_BLACK,
        borderRadius: 8,
    },
});
