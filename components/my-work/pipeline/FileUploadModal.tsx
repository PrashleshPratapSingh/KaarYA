import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

export interface FileUploadModalProps {
    visible: boolean;
    onClose: () => void;
    gigId: string;
    gigTitle: string;
    onUpload: () => void;
}

export function FileUploadModal({ visible, onClose, gigTitle, onUpload }: FileUploadModalProps) {
    return (
        <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
            <View className="flex-1 bg-black/50 justify-end">
                <View className="bg-white rounded-t-[40px] p-8 pb-12">
                    <View className="w-12 h-1 bg-gray-200 rounded-full self-center mb-8" />

                    <Text className="text-xl font-extrabold text-gray-900 text-center mb-2">
                        Upload Assets
                    </Text>
                    <Text className="text-sm text-gray-500 text-center mb-8 px-8">
                        {gigTitle}
                    </Text>

                    <View className="border-2 border-dashed border-gray-200 rounded-3xl h-48 items-center justify-center bg-gray-50 mb-8">
                        <View className="w-16 h-16 bg-white rounded-full items-center justify-center shadow-sm mb-4">
                            <Feather name="folder-plus" size={24} color="#FFE500" />
                        </View>
                        <Text className="text-sm font-bold text-gray-400">Tap to browse files</Text>
                    </View>

                    <Pressable
                        onPress={onUpload}
                        className="bg-karya-black py-4 rounded-2xl items-center shadow-lg shadow-black/20"
                    >
                        <Text className="text-white font-extrabold text-base">UPLOAD NOW</Text>
                    </Pressable>

                    <Pressable onPress={onClose} className="mt-4 py-2 items-center">
                        <Text className="text-gray-400 font-bold text-xs">CANCEL</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}
