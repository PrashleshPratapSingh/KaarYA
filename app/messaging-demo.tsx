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
} from 'react-native';
import { MessageBubble } from '../components/messaging/MessageBubble';
import { MessageInput } from '../components/messaging/MessageInput';
import { ChatHeader } from '../components/messaging/ChatHeader';
import { Message, User } from '../types/messaging';
import { BrandColors } from '../constants/Colors';

export default function MessagingDemo() {
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

    const otherUser: User = {
        id: 'other',
        name: 'ALEX RIVERA',
        status: 'online',
    };

    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        // Scroll to bottom when messages change
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
        // You can handle file attachments here
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isOwnMessage = item.senderId === currentUser.id;
        return (
            <MessageBubble
                message={item}
                isOwnMessage={isOwnMessage}
                senderName={isOwnMessage ? undefined : otherUser.name}
            />
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

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={BrandColors.cream} />

            <View style={styles.container}>
                <ChatHeader
                    user={otherUser}
                    onBack={() => console.log('Back pressed')}
                    onViewProfile={() => console.log('View profile')}
                    onViewGig={() => console.log('View gig')}
                />

                {renderStatusIndicator()}

                <KeyboardAvoidingView
                    style={styles.chatContainer}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                >
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
                    />

                    <MessageInput
                        onSendMessage={handleSendMessage}
                        onSendAudio={handleSendAudio}
                        onAttachFile={handleAttachFile}
                    />
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
        marginVertical: 20,
        marginHorizontal: 20,
    },
    dateLine: {
        flex: 1,
        height: 2,
        backgroundColor: BrandColors.black,
    },
    dateContainer: {
        marginHorizontal: 12,
    },
    dateBox: {
        backgroundColor: BrandColors.black,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    dateText: {
        fontSize: 11,
        fontWeight: '700',
        color: BrandColors.white,
        letterSpacing: 0.5,
    },
    statusBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: BrandColors.lightCream,
        borderBottomWidth: 2,
        borderBottomColor: BrandColors.black,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: BrandColors.green,
        marginRight: 8,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
        color: BrandColors.black,
        letterSpacing: 0.5,
    },
});
