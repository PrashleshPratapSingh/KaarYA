import React from 'react';
import { Pressable, View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface ChatBubbleProps {
    unreadCount: number;
    gigId: string;
    onPress: () => void;
}

export function ChatBubble({ unreadCount, gigId, onPress }: ChatBubbleProps) {
    return (
        <Pressable
            onPress={onPress}
            className="bg-karya-black border-brutal border-karya-black w-14 h-14 items-center justify-center relative"
        >
            <Feather name="message-circle" size={24} color="#FFFFFF" />

            {unreadCount > 0 && (
                <View className="absolute -top-2 -right-2 bg-red-600 border-2 border-white rounded-full w-6 h-6 items-center justify-center">
                    <Text className="text-white text-xs font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </Text>
                </View>
            )}
        </Pressable>
    );
}
