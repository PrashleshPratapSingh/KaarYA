import React from 'react';
import { Pressable, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface DeliverableUploadButtonProps {
    gigId: string;
    onPress: () => void;
}

export function DeliverableUploadButton({ gigId, onPress }: DeliverableUploadButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            className="bg-karya-yellow border-brutal border-karya-black py-3 flex-row items-center justify-center gap-2"
        >
            <Feather name="upload" size={18} color="#000000" />
            <Text className="font-bold text-sm text-karya-black tracking-tight">
                UPLOAD
            </Text>
        </Pressable>
    );
}
