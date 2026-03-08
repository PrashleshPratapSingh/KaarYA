/**
 * Firestore Messaging Layer — KaarYa
 *
 * Real-time chat backed by Firestore collections:
 *   - `chats/{chatId}` — Chat thread metadata
 *   - `chats/{chatId}/messages/{messageId}` — Individual messages
 */
import {
    collection,
    doc,
    addDoc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    serverTimestamp,
    updateDoc,
    Timestamp,
    type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ChatThread {
    id: string;
    participantIds: string[];
    participantNames: Record<string, string>;
    participantAvatars: Record<string, string | null>;
    gigId?: string;
    gigTitle?: string;
    lastMessage: string;
    lastMessageAt: string;
    lastSenderId: string;
    unreadCounts: Record<string, number>;
    createdAt: string;
}

export interface ChatMessage {
    id: string;
    chatId: string;
    senderId: string;
    text: string;
    type: 'text' | 'image' | 'audio';
    mediaUrl?: string;
    status: 'sent' | 'delivered' | 'read';
    createdAt: string;
}

// ─── Chat Thread Operations ─────────────────────────────────────────────────

/**
 * Get or create a chat thread between two users (optionally tied to a gig).
 */
export async function getOrCreateChat(
    currentUserId: string,
    otherUserId: string,
    otherUserName: string,
    otherUserAvatar: string | null,
    currentUserName: string,
    gigId?: string,
    gigTitle?: string
): Promise<string> {

    // Check if a chat already exists between these users (for this gig if specified)
    const chatsRef = collection(db, 'chats');
    const constraints = [
        where('participantIds', 'array-contains', currentUserId),
    ];
    const q = query(chatsRef, ...constraints);
    const snapshot = await getDocs(q);

    // Find existing chat with same participants (and same gig if specified)
    for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        if (data.participantIds.includes(otherUserId)) {
            if (!gigId || data.gigId === gigId) {
                return docSnap.id;
            }
        }
    }

    // Create new chat thread
    const chatData = {
        participantIds: [currentUserId, otherUserId],
        participantNames: {
            [currentUserId]: currentUserName,
            [otherUserId]: otherUserName,
        },
        participantAvatars: {
            [currentUserId]: null,
            [otherUserId]: otherUserAvatar,
        },
        gigId: gigId || null,
        gigTitle: gigTitle || null,
        lastMessage: '',
        lastMessageAt: serverTimestamp(),
        lastSenderId: '',
        unreadCounts: {
            [currentUserId]: 0,
            [otherUserId]: 0,
        },
        createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(chatsRef, chatData);
    return docRef.id;
}

/**
 * Fetch all chat threads for the current user.
 */
export async function fetchChats(currentUserId: string): Promise<ChatThread[]> {

    const chatsRef = collection(db, 'chats');
    const q = query(
        chatsRef,
        where('participantIds', 'array-contains', currentUserId),
        orderBy('lastMessageAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => {
        const data = d.data();
        return {
            id: d.id,
            ...data,
            lastMessageAt: data.lastMessageAt?.toDate?.()
                ? data.lastMessageAt.toDate().toISOString()
                : new Date().toISOString(),
            createdAt: data.createdAt?.toDate?.()
                ? data.createdAt.toDate().toISOString()
                : new Date().toISOString(),
        } as ChatThread;
    });
}

/**
 * Listen to chat threads in real-time.
 */
export function onChatsChanged(
    currentUserId: string,
    callback: (chats: ChatThread[]) => void
): Unsubscribe {

    const chatsRef = collection(db, 'chats');
    const q = query(
        chatsRef,
        where('participantIds', 'array-contains', currentUserId),
        orderBy('lastMessageAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
        const chats = snapshot.docs.map((d) => {
            const data = d.data();
            return {
                id: d.id,
                ...data,
                lastMessageAt: data.lastMessageAt?.toDate?.()
                    ? data.lastMessageAt.toDate().toISOString()
                    : new Date().toISOString(),
                createdAt: data.createdAt?.toDate?.()
                    ? data.createdAt.toDate().toISOString()
                    : new Date().toISOString(),
            } as ChatThread;
        });
        callback(chats);
    });
}

// ─── Message Operations ─────────────────────────────────────────────────────

/**
 * Send a text message in a chat.
 */
export async function sendMessage(
    currentUserId: string,
    chatId: string,
    text: string,
    type: 'text' | 'image' | 'audio' = 'text',
    mediaUrl?: string
): Promise<string> {

    const messageData = {
        chatId,
        senderId: currentUserId,
        text,
        type,
        mediaUrl: mediaUrl || null,
        status: 'sent',
        createdAt: serverTimestamp(),
    };

    // Add message to subcollection
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const docRef = await addDoc(messagesRef, messageData);

    // Update chat thread metadata
    const chatRef = doc(db, 'chats', chatId);
    const chatSnap = await getDoc(chatRef);
    if (chatSnap.exists()) {
        const chatData = chatSnap.data();
        const otherIds = (chatData.participantIds as string[]).filter(
            (id) => id !== currentUserId
        );

        // Increment unread count for other participants
        const unreadCounts = { ...(chatData.unreadCounts || {}) };
        for (const otherId of otherIds) {
            unreadCounts[otherId] = (unreadCounts[otherId] || 0) + 1;
        }

        await updateDoc(chatRef, {
            lastMessage: type === 'text' ? text : `📎 ${type}`,
            lastMessageAt: serverTimestamp(),
            lastSenderId: currentUserId,
            unreadCounts,
        });
    }

    return docRef.id;
}

/**
 * Listen to messages in a chat in real-time.
 */
export function onMessagesChanged(
    chatId: string,
    callback: (messages: ChatMessage[]) => void
): Unsubscribe {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map((d) => {
            const data = d.data();
            return {
                id: d.id,
                ...data,
                createdAt: data.createdAt?.toDate?.()
                    ? data.createdAt.toDate().toISOString()
                    : new Date().toISOString(),
            } as ChatMessage;
        });
        callback(messages);
    });
}

/**
 * Mark all messages in a chat as read for the current user.
 */
export async function markChatAsRead(currentUserId: string, chatId: string): Promise<void> {

    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, {
        [`unreadCounts.${currentUserId}`]: 0,
    });
}
