import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, StatusBar, SafeAreaView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { BrandColors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface ChatPreview {
    id: string;
    name: string;
    lastMessage: string;
    time: string;
    unreadCount: number;
    type: 'text' | 'photo' | 'audio';
    avatarColor: string;
}

const MOCK_CHATS: ChatPreview[] = [
    {
        id: '1',
        name: 'Alex Rivera',
        lastMessage: 'Perfect. Please send over the Figma link...',
        time: '23:32',
        unreadCount: 0,
        type: 'text',
        avatarColor: BrandColors.yellow,
    },
    {
        id: '2',
        name: 'Sarah Jenkins',
        lastMessage: 'The wireframes look great! Approved.',
        time: '14:20',
        unreadCount: 2,
        type: 'text',
        avatarColor: '#26A69A',
    },
    {
        id: '3',
        name: 'Michael Chen',
        lastMessage: 'Photo',
        time: 'Yesterday',
        unreadCount: 0,
        type: 'photo',
        avatarColor: '#5C6BC0',
    },
    {
        id: '4',
        name: 'Emily Carter',
        lastMessage: 'Can we reschedule the sprint meeting?',
        time: 'Yesterday',
        unreadCount: 1,
        type: 'text',
        avatarColor: '#AB47BC',
    },
    {
        id: '5',
        name: 'David Ross',
        lastMessage: 'Contract signed. Lets start monday.',
        time: 'Mon',
        unreadCount: 0,
        type: 'text',
        avatarColor: '#78909C',
    },
    {
        id: '6',
        name: 'Jessica Wong',
        lastMessage: 'Audio Message',
        time: 'Mon',
        unreadCount: 0,
        type: 'audio',
        avatarColor: '#8D6E63',
    },
];

export default function MessagesListScreen() {
    const router = useRouter();

    const handleChatPress = (chatId: string, name: string) => {
        router.push({
            pathname: '/chat/[id]',
            params: { id: chatId, name: name }
        });
    };

    const renderItem = ({ item, index }: { item: ChatPreview; index: number }) => (
        <>
            <TouchableOpacity
                style={styles.chatItem}
                onPress={() => handleChatPress(item.id, item.name)}
                activeOpacity={0.6}
            >
                {/* Avatar */}
                <View style={[styles.avatar, { backgroundColor: item.avatarColor }]}>
                    {item.type === 'photo' ? (
                        <Ionicons name="people" size={24} color="#FFF" />
                    ) : (
                        <Text style={styles.avatarText}>{item.name.substring(0, 1)}</Text>
                    )}
                </View>

                {/* Content */}
                <View style={styles.contentContainer}>
                    <View style={styles.headerRow}>
                        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                        <Text style={[
                            styles.time,
                            item.unreadCount > 0 && { color: '#25D366', fontWeight: '700' }
                        ]}>
                            {item.time}
                        </Text>
                    </View>

                    <View style={styles.messageRow}>
                        <View style={styles.messagePreview}>
                            {item.type === 'photo' && (
                                <Ionicons name="image" size={14} color="#8696A0" style={{ marginRight: 4 }} />
                            )}
                            {item.type === 'audio' && (
                                <Ionicons name="mic" size={14} color="#8696A0" style={{ marginRight: 4 }} />
                            )}
                            <Text style={styles.lastMessage} numberOfLines={1}>
                                {item.lastMessage}
                            </Text>
                        </View>

                        {item.unreadCount > 0 && (
                            <View style={styles.unreadBadge}>
                                <Text style={styles.unreadText}>{item.unreadCount}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
            {/* Separator line */}
            {index < MOCK_CHATS.length - 1 && (
                <View style={styles.separator} />
            )}
        </>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFE600" />
            {/* Yellow Header Area */}
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Messages</Text>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="rgba(0,0,0,0.5)" />
                    <TextInput
                        placeholder="Search..."
                        style={styles.searchInput}
                        placeholderTextColor="rgba(0,0,0,0.4)"
                    />
                </View>
            </View>

            {/* White Chat List Area */}
            <View style={styles.chatListContainer}>
                <FlatList
                    data={MOCK_CHATS}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFE600',
    },
    headerContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: '#FFE600',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#000',
        marginBottom: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#000',
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#000',
    },
    chatListContainer: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: 8,
    },
    listContent: {
        paddingTop: 12,
        paddingBottom: 100,
    },
    chatItem: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.08)',
        marginLeft: 86,
        marginRight: 20,
    },
    // ... keep existing avatar styles ...
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '600',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
        color: BrandColors.black,
        flex: 1,
    },
    time: {
        fontSize: 12,
        color: BrandColors.mediumGray,
    },
    messageRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    messagePreview: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 16,
    },
    lastMessage: {
        fontSize: 14,
        color: BrandColors.mediumGray,
    },
    unreadBadge: {
        backgroundColor: BrandColors.green,
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    unreadText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
    },
});
