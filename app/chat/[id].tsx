import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    SafeAreaView,
    StatusBar,
    Platform,
    KeyboardAvoidingView,
    Alert,
    Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { MessageBubble } from '../../components/messaging/MessageBubble';
import { MessageInput } from '../../components/messaging/MessageInput';
import { ChatHeader } from '../../components/messaging/ChatHeader';
import { GigDetailsModal } from '../../components/messaging/GigDetailsModal';
import { MessageOptionsModal } from '../../components/messaging/MessageOptionsModal';
import { ProfileDetailsModal } from '../../components/messaging/ProfileDetailsModal';
import * as Clipboard from 'expo-clipboard';
import { Message, User } from '../../types/messaging';
import { BrandColors } from '../../constants/Colors';
import { onMessagesChanged, sendMessage, markChatAsRead, type ChatMessage } from '../../lib/messaging';
import { uploadChatMedia } from '../../lib/storage';
import { useAuth } from '../context/AuthContext';

export default function ChatRoomScreen() {
    const router = useRouter();
    const { id, name } = useLocalSearchParams();
    const { user } = useAuth();
    const chatId = typeof id === 'string' ? id : '';

    const [messages, setMessages] = useState<Message[]>([]);

    const currentUser: User = {
        id: user?.uid || 'me',
        name: 'You',
        status: 'online',
    };

    const displayName = typeof name === 'string' ? name : 'User';

    const otherUser: User = {
        id: 'other', // We don't have the exact ID here easily without fetching the thread, but we just need name for display
        name: displayName,
        status: 'online',
    };

    const flatListRef = useRef<FlatList>(null);

    // Subscribe to real-time messages
    useEffect(() => {
        if (!chatId || !user) return;

        // Mark chat as read when opening
        markChatAsRead(user.uid, chatId).catch(console.error);

        const unsubscribe = onMessagesChanged(chatId, (fetchedMessages: ChatMessage[]) => {
            const mappedMessages: Message[] = fetchedMessages.map(m => ({
                id: m.id,
                text: m.text,
                senderId: m.senderId,
                createdAt: new Date(m.createdAt).getTime(),
                type: m.type,
                status: m.status,
                mediaUrl: m.mediaUrl,
            }));
            setMessages(mappedMessages);

            // Mark as read again if new messages come in while screen is open
            markChatAsRead(user.uid, chatId).catch(console.error);
        });

        return () => unsubscribe();
    }, [chatId, user]);

    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages]);

    const handleSendMessage = async (text: string) => {
        if (!chatId || !user) return;
        try {
            await sendMessage(user.uid, chatId, text, 'text');
        } catch (error) {
            console.error('Failed to send text message:', error);
            Alert.alert('Error', 'Failed to send message');
        }
    };

    const handleSendAudio = async (uri: string, duration: number) => {
        if (!chatId || !user) return;
        try {
            const downloadUrl = await uploadChatMedia(chatId, user.uid, uri, 'audio');
            await sendMessage(user.uid, chatId, 'Audio message', 'audio', downloadUrl);
        } catch (error) {
            console.error('Failed to send audio message:', error);
            Alert.alert('Error', 'Failed to send audio');
        }
    };

    const handleAttachFile = async (uri: string, type: string) => {
        if (!chatId || !user) return;
        try {
            const mediaType = type.startsWith('image') ? 'image' : 'document';
            const downloadUrl = await uploadChatMedia(chatId, user.uid, uri, mediaType);
            await sendMessage(user.uid, chatId, mediaType === 'image' ? '📎 Image' : '📎 Document', mediaType, downloadUrl);
        } catch (error) {
            console.error('Failed to attach file:', error);
            Alert.alert('Error', 'Failed to send attachment');
        }
    };

    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [optionsVisible, setOptionsVisible] = useState(false);

    const handleMessageLongPress = (message: Message) => {
        setSelectedMessage(message);
        setOptionsVisible(true);
    };

    const handleCopy = async (message: Message) => {
        if (message.text) {
            await Clipboard.setStringAsync(message.text);
        }
    };

    const handleDelete = (message: Message) => {
        Alert.alert(
            'Delete Message',
            'Are you sure you want to delete this message?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setMessages(prev => prev.filter(m => m.id !== message.id));
                    }
                }
            ]
        );
    };

    const handleReply = (message: Message) => {
        Alert.alert('Reply', `Replying to: ${message.text?.substring(0, 20)}...`);
    };

    const handleReact = (message: Message, emoji: string) => {
        setMessages(prev => prev.map(m => {
            if (m.id === message.id) {
                const newReactions = { ...(m.reactions || {}) };
                if (newReactions[currentUser.id] === emoji) {
                    delete newReactions[currentUser.id];
                } else {
                    newReactions[currentUser.id] = emoji;
                }
                return { ...m, reactions: newReactions };
            }
            return m;
        }));
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isOwnMessage = item.senderId === currentUser.id;
        return (
            <Pressable onLongPress={() => handleMessageLongPress(item)}>
                <MessageBubble
                    message={item}
                    isOwnMessage={isOwnMessage}
                    senderName={isOwnMessage ? undefined : otherUser.name}
                />
            </Pressable>
        );
    };

    const renderDateSeparator = () => (
        <View style={styles.dateSeparator}>
            <View style={styles.dateLine} />
            <View style={styles.dateContainer}>
                <View style={styles.dateBox}>
                    <Text style={styles.dateText}>TODAY</Text>
                </View>
            </View>
            <View style={styles.dateLine} />
        </View>
    );

    const renderStatusIndicator = () => (
        <View style={styles.statusBar}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>GIG IN PROGRESS</Text>
        </View>
    );

    const handleBack = () => {
        router.back();
    };

    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const handleViewProfile = () => {
        setProfileModalVisible(true);
    };

    const [gigModalVisible, setGigModalVisible] = useState(false);
    const handleViewGig = () => {
        setGigModalVisible(true);
    };

    return (
        <View style={styles.outerContainer}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar
                barStyle="dark-content"
                backgroundColor={BrandColors.cream}
                translucent={false}
            />
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                >
                    <ChatHeader
                        user={otherUser}
                        onBack={handleBack}
                        onViewProfile={handleViewProfile}
                        onViewGig={handleViewGig}
                    />

                    {renderStatusIndicator()}

                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderMessage}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.messageList}
                        ListHeaderComponent={renderDateSeparator}
                        showsVerticalScrollIndicator={false}
                        onContentSizeChange={() =>
                            flatListRef.current?.scrollToEnd({ animated: true })
                        }
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="interactive"
                    />

                    <MessageInput
                        onSendMessage={handleSendMessage}
                        onSendAudio={handleSendAudio}
                        onAttachFile={handleAttachFile}
                    />
                </KeyboardAvoidingView>

                <GigDetailsModal
                    visible={gigModalVisible}
                    onClose={() => setGigModalVisible(false)}
                />

                <ProfileDetailsModal
                    visible={profileModalVisible}
                    onClose={() => setProfileModalVisible(false)}
                    user={otherUser}
                />

                <MessageOptionsModal
                    visible={optionsVisible}
                    onClose={() => setOptionsVisible(false)}
                    message={selectedMessage}
                    isOwnMessage={selectedMessage?.senderId === currentUser.id}
                    onReply={handleReply}
                    onCopy={handleCopy}
                    onDelete={handleDelete}
                    onReact={handleReact}
                />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: BrandColors.cream,
    },
    safeArea: {
        flex: 1,
        backgroundColor: BrandColors.cream,
    },
    container: {
        flex: 1,
        backgroundColor: BrandColors.cream,
    },
    chatContainer: {
        flex: 1,
    },
    messageList: {
        paddingVertical: 16,
    },
    dateSeparator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
        marginHorizontal: 24,
    },
    dateLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    dateContainer: {
        marginHorizontal: 12,
    },
    dateBox: {
        backgroundColor: 'rgba(91, 95, 255, 0.08)',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(91, 95, 255, 0.2)',
    },
    dateText: {
        fontSize: 11,
        fontWeight: '700',
        color: BrandColors.purple,
        letterSpacing: 1,
    },
    statusBar: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        marginVertical: 12,
        paddingVertical: 8,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(46, 204, 113, 0.1)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(46, 204, 113, 0.2)',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: BrandColors.green,
        marginRight: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
        color: BrandColors.green,
        letterSpacing: 0.8,
    },
});
