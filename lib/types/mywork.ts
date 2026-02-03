/**
 * TypeScript interfaces and types for My Work Dashboard
 */

export type UserRole = 'client' | 'executor';

export interface Transaction {
    id: string;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    date: string; // ISO timestamp
    gigId?: string;
}

export interface ChatMessage {
    id: string;
    gigId: string;
    senderId: string;
    senderName: string;
    senderRole: 'client' | 'executor';
    message: string;
    timestamp: string;
    fileAttachments?: FileAttachment[];
    isRead: boolean;
}

export interface FileAttachment {
    id: string;
    name: string;
    uri: string;
    size: number;
    type: string;
    uploadedAt: string;
}

export interface Gig {
    id: string;
    title: string;
    clientId: string;
    clientName: string;
    clientAvatar?: string;
    executorId?: string;
    executorName?: string;
    executorAvatar?: string;
    amount: number;
    deadline: string; // ISO timestamp
    startTime?: string; // ISO timestamp for upcoming gigs
    progress: number; // 0-100
    unreadMessages: number;
    status: 'upcoming' | 'ongoing' | 'review' | 'completed' | 'pending';
    deliverables?: FileAttachment[];
    chatMessages?: ChatMessage[];
}

export interface CompletedGig extends Gig {
    completedDate: string;
    vibeBadges: string[]; // e.g., ['Speed Demon', 'Goat']
    workSnippet: string; // URL or text description
    rating?: number;
}

export interface WalletData {
    totalBalance: number;
    pendingFunds: number;
    availableFunds: number;
    transactions: Transaction[];
}

export interface TalentProfile {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    completedGigs: number;
    badges: string[];
    lastHired?: string;
    rank: 'Rookie' | 'Pro Hustler' | 'G.O.A.T.';
}
