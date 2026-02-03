import React, { useState } from 'react';
import { Modal, View, Text, Pressable, TextInput, FlatList, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ChatMessage } from '../../lib/types/mywork';

interface GigChatModalProps {
    visible: boolean;
    onClose: () => void;
    gigId: string;
    gigTitle: string;
    messages: ChatMessage[];
    currentUserRole: 'client' | 'executor';
    onSendMessage: (text: string) => void;
}

export function GigChatModal({
    visible,
    onClose,
    gigTitle,
    messages,
    currentUserRole,
    onSendMessage
}: GigChatModalProps) {
    const [inputText, setInputText] = useState('');

    const handleSend = () => {
        if (inputText.trim()) {
            onSendMessage(inputText);
            setInputText('');
        }
    };

    const renderMessage = ({ item }: { item: ChatMessage }) => {
        const isMe = item.senderRole === currentUserRole;

        return (
            <View className={`mb-6 ${isMe ? 'items-end' : 'items-start'}`}>
                {/* Date bubble if needed, skipping for mock */}

                <View
                    className={`px-5 py-4 max-w-[80%] rounded-2xl shadow-sm ${isMe
                            ? 'bg-white rounded-tr-none'
                            : 'bg-karya-yellow rounded-tl-none'
                        }`}
                    style={{ elevation: 2 }}
                >
                    <Text className={`font-bold text-sm leading-relaxed ${isMe ? 'text-gray-800' : 'text-black'}`}>
                        {item.message}
                    </Text>
                </View>
                <Text className="text-[10px] text-gray-400 mt-2 font-medium px-1">
                    {isMe ? 'You' : item.senderName.split(' ')[0]}
                </Text>
            </View>
        );
    };

    return (
        <Modal visible={visible} animationType="fade" statusBarTranslucent>
            <View className="flex-1 bg-gray-50 pt-12">
                {/* Header */}
                <View className="px-6 pb-4 flex-row items-center justify-between z-10">
                    <Pressable onPress={onClose} className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm">
                        <Feather name="chevron-left" size={24} color="#000" />
                    </Pressable>
                    <View className="items-center">
                        <Text className="text-sm font-extrabold text-gray-900">Rohank.studio</Text>
                        <View className="flex-row items-center gap-1">
                            <View className="w-2 h-2 bg-green-500 rounded-full" />
                            <Text className="text-[10px] font-bold text-gray-400 uppercase">Phase 02: Design</Text>
                        </View>
                    </View>
                    <View className="bg-white px-3 py-1.5 rounded-full shadow-sm">
                        <Text className="text-xs font-bold text-gray-900">₹5,000</Text>
                    </View>
                </View>

                {/* Messages */}
                <FlatList
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ padding: 24, paddingBottom: 160 }}
                    className="flex-1"
                />

                {/* Input Area */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="absolute bottom-0 left-0 right-0 bg-white p-6 rounded-t-[40px] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
                >
                    <View className="flex-row items-center gap-3 mb-6">
                        <Pressable className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center">
                            <Feather name="plus" size={24} color="#666" />
                        </Pressable>
                        <TextInput
                            className="flex-1 bg-gray-50 h-12 rounded-full px-6 font-medium text-gray-700"
                            placeholder="Type a message..."
                            placeholderTextColor="#9CA3AF"
                            value={inputText}
                            onChangeText={setInputText}
                        />
                        <Pressable onPress={handleSend} className="w-12 h-12 bg-karya-yellow rounded-full items-center justify-center shadow-sm">
                            <Feather name="send" size={20} color="#000" style={{ marginLeft: 2 }} />
                        </Pressable>
                    </View>

                    <Pressable className="bg-karya-yellow rounded-2xl py-4 items-center flex-row justify-center gap-2 shadow-sm">
                        <Feather name="shield" size={18} color="#000" />
                        <Text className="font-extrabold text-sm text-black uppercase">RELEASE FUNDS</Text>
                    </Pressable>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}
