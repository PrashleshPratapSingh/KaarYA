export interface User {
    id: string;
    name: string;
    avatar?: string;
    status?: 'online' | 'offline';
}

export interface Message {
    id: string;
    text?: string;
    senderId: string;
    createdAt: number;
    type: 'text' | 'audio' | 'image';
    mediaUrl?: string;
    duration?: number;
    status: 'sent' | 'delivered' | 'read';
    reactions?: Record<string, string>; // userId -> emoji
}

export const REACTION_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '👏'];

export interface ChatThread {
    id: string;
    participants: User[];
    lastMessage?: Message;
    unreadCount?: number;
}
