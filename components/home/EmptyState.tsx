/**
 * EmptyState - Playful empty message with thinking mascot
 */
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { KARYA_BLACK } from './types';

const UpLogo = require('../../assets/images/up.png');

export function EmptyState() {
    return (
        <View style={styles.container}>
            <Image source={UpLogo} style={styles.foxImage} resizeMode="contain" />
            <Text style={styles.title}>its giving empty</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    foxImage: {
        width: 130,
        height: 130,
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: KARYA_BLACK,
        marginTop: 10,
    },
});
