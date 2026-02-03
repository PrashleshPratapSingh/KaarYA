/**
 * EmptyState - Playful empty message with thinking mascot
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { KaaryaMascot } from './KaaryaMascot';
import { KARYA_BLACK } from './types';

export function EmptyState() {
    return (
        <View style={styles.container}>
            <KaaryaMascot mood="thinking" size={100} />
            <Text style={styles.title}>Hmm, nothing here yet...</Text>
            <Text style={styles.subtitle}>Try another category or check back soon!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: KARYA_BLACK,
        marginTop: 20,
    },
    subtitle: {
        fontSize: 14,
        color: KARYA_BLACK,
        marginTop: 8,
        textAlign: 'center',
        opacity: 0.6,
    },
});
