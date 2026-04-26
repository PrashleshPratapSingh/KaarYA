import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, SafeAreaView, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import { onChatsChanged, type ChatThread } from '../../lib/messaging';
import { useAuth } from '../context/AuthContext';
import * as Haptics from 'expo-haptics';

interface ChatPreview {
    id: string;
    name: string;
    lastMessage: string;
    time: string;
    unreadCount: number;
    type: 'text' | 'photo' | 'audio';
}

export default function MessagesListScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [chats, setChats] = useState<ChatPreview[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const unsubscribe = onChatsChanged(user.uid, (threads: ChatThread[]) => {
            const mappedChats: ChatPreview[] = threads.map(thread => {
                // participantNames is keyed by userId, not by index
                const otherUserId = thread.participantIds.find(pid => pid !== user.uid) || '';
                const otherName = thread.participantNames?.[otherUserId] || 'User';
                
                let timeStr = '';
                if (thread.lastMessageAt) {
                    const date = new Date(thread.lastMessageAt);
                    const now = new Date();
                    const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                    if (isToday) {
                        timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    } else {
                        timeStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                    }
                }

                return {
                    id: thread.id,
                    name: otherName,
                    lastMessage: thread.lastMessage || 'No messages yet',
                    time: timeStr,
                    unreadCount: (thread.unreadCounts?.[user.uid] as number) || 0,
                    type: thread.lastMessage.startsWith('📎') ? 'photo' : 'text',
                };
            });

            setChats(mappedChats);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleChatPress = (chatId: string, name: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push({
            pathname: '/chat/[id]',
            params: { id: chatId, name: name }
        });
    };

    const filteredChats = chats.filter(chat => 
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" />
            
            <ScrollView 
                className="flex-1" 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Minimal Yellow Header */}
                <View className="bg-[#FFE600] pt-12 pb-10 px-6 rounded-b-[40px]">
                    <Text className="text-black font-black text-3xl tracking-tight uppercase">Messages</Text>
                    <Text className="text-black/40 font-bold text-xs uppercase tracking-widest mt-1">
                        {chats.filter(c => c.unreadCount > 0).length} Unread Conversations
                    </Text>

                    {/* Clean Search Bar */}
                    <View className="bg-white rounded-2xl px-4 py-3 flex-row items-center mt-6 shadow-sm">
                        <Feather name="search" size={18} color="black" opacity={0.2} />
                        <TextInput
                            placeholder="Search chats..."
                            placeholderTextColor="rgba(0,0,0,0.2)"
                            className="flex-1 ml-3 font-bold text-sm"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                {/* Chat List */}
                <View className="px-5 mt-8">
                    {loading ? (
                        <ActivityIndicator size="large" color="#FFE600" className="mt-10" />
                    ) : !user ? (
                        <View className="items-center py-20 bg-gray-50 rounded-[30px] px-10">
                            <Ionicons name="lock-closed" size={48} color="rgba(0,0,0,0.1)" />
                            <Text className="text-center mt-4 text-gray-400 font-bold">Sign in to view messages</Text>
                            <TouchableOpacity 
                                onPress={() => router.push('/onboarding')}
                                className="bg-black px-8 py-4 rounded-2xl mt-6"
                            >
                                <Text className="text-white font-bold uppercase">Log In</Text>
                            </TouchableOpacity>
                        </View>
                    ) : filteredChats.length === 0 ? (
                        <View className="items-center py-20">
                            <Text className="text-gray-300 font-bold italic">No messages found</Text>
                        </View>
                    ) : (
                        filteredChats.map(chat => (
                            <TouchableOpacity
                                key={chat.id}
                                onPress={() => handleChatPress(chat.id, chat.name)}
                                activeOpacity={0.7}
                                className="bg-white border border-gray-100 rounded-[30px] p-5 mb-4 flex-row items-center justify-between"
                            >
                                <View className="flex-row items-center flex-1">
                                    {/* Avatar Box - Inspired by Activity Icons */}
                                    <View className="w-12 h-12 bg-[#FFE600] rounded-2xl items-center justify-center">
                                        <Text className="text-black font-black text-lg">{chat.name.substring(0, 1)}</Text>
                                        {chat.unreadCount > 0 && (
                                            <View className="absolute -top-1 -right-1 w-4 h-4 bg-black rounded-full border-2 border-white" />
                                        )}
                                    </View>

                                    <View className="ml-4 flex-1 mr-4">
                                        <View className="flex-row justify-between items-center mb-1">
                                            <Text className="text-black font-bold text-base tracking-tight flex-1" numberOfLines={1}>
                                                {chat.name}
                                            </Text>
                                            <Text className="text-black/30 text-[10px] font-bold ml-2">
                                                {chat.time}
                                            </Text>
                                        </View>
                                        <View className="flex-row items-center">
                                            {chat.type === 'photo' && <Feather name="image" size={12} color="#999" className="mr-1" />}
                                            <Text className="text-black/40 text-xs font-medium flex-1" numberOfLines={1}>
                                                {chat.lastMessage}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="black" opacity={0.1} />
                            </TouchableOpacity>
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
