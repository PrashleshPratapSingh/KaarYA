import { useState, useEffect } from 'react';
import { useAuth } from '../app/context/AuthContext';
import { onChatsChanged, type ChatThread } from './messaging';

export function useUnreadMessages() {
    const { user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!user) {
            setUnreadCount(0);
            return;
        }

        const unsubscribe = onChatsChanged(user.uid, (threads: ChatThread[]) => {
            let totalUnread = 0;
            threads.forEach((thread) => {
                const count = (thread.unreadCounts?.[user.uid] as number) || 0;
                totalUnread += count;
            });
            setUnreadCount(totalUnread);
        });

        return () => unsubscribe();
    }, [user]);

    return unreadCount;
}
