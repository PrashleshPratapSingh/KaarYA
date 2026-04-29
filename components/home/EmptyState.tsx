/**
 * EmptyState - Playful empty message with thinking mascot
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { KARYA_BLACK } from './types';

export function EmptyState() {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="briefcase-search-outline" size={48} color={KARYA_BLACK} style={{ opacity: 0.2 }} />
            </View>
            <Text style={styles.title}>All Caught Up!</Text>
            <Text style={styles.subtitle}>There are no open gigs right now. Check back soon for new opportunities.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        paddingHorizontal: 40,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(0,0,0,0.03)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: KARYA_BLACK,
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 14,
        color: KARYA_BLACK,
        opacity: 0.5,
        textAlign: 'center',
        lineHeight: 20,
        fontWeight: '500',
    },
});
