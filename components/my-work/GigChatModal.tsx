import React, { useState, useRef, useEffect } from 'react';
import { Modal, View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { ChatMessage } from '../../lib/types/mywork';

interface GigChatModalProps {
    visible: boolean;
    onClose: () => void;
    gigId: string;
    gigTitle: string;
    messages: ChatMessage[];
    currentUserRole: 'client' | 'executor';
    onSendMessage: (message: string) => void;
}

export function GigChatModal({
    visible,
    onClose,
    gigId,
    gigTitle,
    messages,
    currentUserRole,
    onSendMessage,
}: GigChatModalProps) {
    const [inputText, setInputText] = useState('');
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        // Auto-scroll to bottom when new messages arrive
        if (visible) {
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages, visible]);

    const handleSend = () => {
        if (inputText.trim()) {
            onSendMessage(inputText.trim());
            setInputText('');
        }
    };

    const MessageBubble = ({ message }: { message: ChatMessage }) => {
        const isMyMessage = message.senderRole === currentUserRole;
        const formattedTime = new Date(message.timestamp).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
        });

        return (
            <View className={`mb-3 ${isMyMessage ? 'items-end' : 'items-start'}`}>
                {!isMyMessage && (
                    <Text className="text-xs font-bold text-gray-600 mb-1">
                        {message.senderName}
                    </Text>
                )}
                <View className={`max-w-[75%] p-3 border-2 ${isMyMessage
                        ? 'bg-karya-yellow border-karya-black'
                        : 'bg-white border-gray-300'
                    }`}>
                    <Text className={`text-sm ${isMyMessage ? 'text-karya-black' : 'text-gray-800'
                        }`}>
                        {message.message}
                    </Text>
                    <Text className={`text-xs mt-1 ${isMyMessage ? 'text-karya-black/60' : 'text-gray-500'
                        }`}>
                        {formattedTime}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="fullScreen"
        >
            <SafeAreaView className="flex-1 bg-white">
                {/* Header */}
                <View className="bg-karya-black border-b-brutal border-karya-black px-4 py-3 flex-row items-center">
                    <Pressable onPress={onClose} className="mr-3">
                        <Feather name="arrow-left" size={24} color="#FFDE03" />
                    </Pressable>
                    <View className="flex-1">
                        <Text className="text-lg font-bold text-karya-yellow tracking-tight">
                            {gigTitle}
                        </Text>
                        <Text className="text-xs text-white/70">Gig Chat</Text>
                    </View>
                    <Feather name="more-vertical" size={20} color="#FFDE03" />
                </View>

                {/* Messages */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    className="flex-1"
                    keyboardVerticalOffset={0}
                >
                    <ScrollView
                        ref={scrollViewRef}
                        className="flex-1 px-4 py-4 bg-gray-50"
                        contentContainerStyle={{ flexGrow: 1 }}
                    >
                        {messages.length === 0 ? (
                            <View className="flex-1 items-center justify-center">
                                <Feather name="message-circle" size={48} color="#D1D5DB" />
                                <Text className="text-gray-400 mt-4 text-center">
                                    No messages yet{'\n'}Start the conversation!
                                </Text>
                            </View>
                        ) : (
                            messages.map((message) => (
                                <MessageBubble key={message.id} message={message} />
                            ))
                        )}
                    </ScrollView>

                    {/* Input Area */}
                    <View className="bg-white border-t-brutal border-gray-300 px-4 py-3 flex-row items-center gap-2">
                        <Pressable className="p-2">
                            <Feather name="paperclip" size={24} color="#6B7280" />
                        </Pressable>

                        <TextInput
                            className="flex-1 bg-gray-100 border-2 border-gray-300 px-4 py-3 text-base"
                            placeholder="Type a message..."
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                            maxLength={500}
                        />

                        <Pressable
                            onPress={handleSend}
                            className={`p-3 ${inputText.trim() ? 'bg-karya-yellow' : 'bg-gray-300'
                                } border-2 border-karya-black`}
                            disabled={!inputText.trim()}
                        >
                            <Feather
                                name="send"
                                size={20}
                                color={inputText.trim() ? '#000000' : '#9CA3AF'}
                            />
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    );
}
