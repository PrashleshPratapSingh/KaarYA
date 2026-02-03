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

export default function ChatRoomScreen() {
    const router = useRouter();
    const { id, name } = useLocalSearchParams();

    // Mock Messages (In real app, fetch based on ID)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Hey! Just checking in on the progress for the landing page hero section. How\'s it looking?',
            senderId: 'other',
            createdAt: Date.now() - 600000,
            type: 'text',
            status: 'read',
        },
        {
            id: '2',
            text: 'Finished the desktop layout! Moving on to responsive versions now. Should be ready for review by EOD.',
            senderId: 'me',
            createdAt: Date.now() - 300000,
            type: 'text',
            status: 'read',
        },
        {
            id: '3',
            text: 'Perfect. Please send over the Figma link once you have the mobile screens done. 🔥',
            senderId: 'other',
            createdAt: Date.now() - 60000,
            type: 'text',
            status: 'read',
        },
    ]);

    const currentUser: User = {
        id: 'me',
        name: 'You',
        status: 'online',
    };

    const displayName = typeof name === 'string' ? name : 'Alex Rivera';

    const otherUser: User = {
        id: 'other',
        name: displayName,
        status: 'online',
    };

    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages]);

    const handleSendMessage = (text: string) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            text,
            senderId: currentUser.id,
            createdAt: Date.now(),
            type: 'text',
            status: 'sent',
        };
        setMessages((prev) => [...prev, newMessage]);
    };

    const handleSendAudio = (uri: string, duration: number) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            senderId: currentUser.id,
            createdAt: Date.now(),
            type: 'audio',
            mediaUrl: uri,
            duration,
            status: 'sent',
        };
        setMessages((prev) => [...prev, newMessage]);
    };

    const handleAttachFile = (uri: string, type: string) => {
        console.log('File attached:', uri, type);
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
