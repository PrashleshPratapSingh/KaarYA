import React from 'react';
import { Pressable, Text, Alert, Share } from 'react-native';
import { Feather } from '@expo/vector-icons';

export function ShareButton() {
    const handleShare = async () => {
        try {
            const portfolioLink = 'https://karya.app/portfolio/demo-user-123';

            await Share.share({
                message: `Check out my work portfolio on Karya! ${portfolioLink}`,
                url: portfolioLink,
            });
        } catch (error) {
            Alert.alert('Error', 'Could not share portfolio. Please try again.');
        }
    };

    return (
        <Pressable
            onPress={handleShare}
            className="absolute bottom-6 right-6 bg-karya-black w-14 h-14 rounded-full items-center justify-center shadow-lg"
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
            }}
        >
            <Feather name="share-2" size={22} color="#FFE500" />
        </Pressable>
    );
}
