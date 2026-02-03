import { Gig, CompletedGig, WalletData, Transaction, ChatMessage } from '../types/mywork';

// Mock Chat Messages
export const mockChatMessages: Record<string, ChatMessage[]> = {
    'ag1': [
        {
            id: 'msg1',
            gigId: 'ag1',
            senderId: 'client1',
            senderName: 'TechStart Inc.',
            senderRole: 'client',
            message: 'Hey! Looking forward to seeing the designs. Can you share some initial concepts by tomorrow?',
            timestamp: '2026-02-02T10:30:00Z',
            isRead: true,
        },
        {
            id: 'msg2',
            gigId: 'ag1',
            senderId: 'executor1',
            senderName: 'You',
            senderRole: 'executor',
            message: 'Absolutely! I\'ll have 3 design concepts ready for you by EOD tomorrow.',
            timestamp: '2026-02-02T11:15:00Z',
            isRead: true,
        },
        {
            id: 'msg3',
            gigId: 'ag1',
            senderId: 'client1',
            senderName: 'TechStart Inc.',
            senderRole: 'client',
            message: 'Perfect! Also, can you make sure the color scheme matches our brand guidelines?',
            timestamp: '2026-02-03T09:00:00Z',
            isRead: false,
        },
    ],
    'ag2': [
        {
            id: 'msg4',
            gigId: 'ag2',
            senderId: 'client2',
            senderName: 'Cafe Mocha',
            senderRole: 'client',
            message: 'Hi! For the Instagram posts, we prefer a warm, cozy aesthetic.',
            timestamp: '2026-02-01T14:00:00Z',
            isRead: true,
        },
    ],
};

// Mock Wallet Data
export const mockWalletData: WalletData = {
    totalBalance: 14500,
    pendingFunds: 8000,
    availableFunds: 6500,
    transactions: [
        {
            id: 't1',
            type: 'credit',
            amount: 2500,
            description: 'Logo Design - Rohan K.',
            date: '2026-02-02T00:00:00Z',
            gigId: 'cg1',
        },
        {
            id: 't2',
            type: 'credit',
            amount: 1500,
            description: 'Blog Post - Aria Singh',
            date: '2026-02-01T00:00:00Z',
            gigId: 'cg2',
        },
        {
            id: 't3',
            type: 'debit',
            amount: 500,
            description: 'Withdrawal to UPI',
            date: '2026-01-31T00:00:00Z',
        },
        {
            id: 't4',
            type: 'credit',
            amount: 3000,
            description: 'Website Mockups - Priya M.',
            date: '2026-01-30T00:00:00Z',
            gigId: 'cg3',
        },
        {
            id: 't5',
            type: 'credit',
            amount: 1200,
            description: 'Social Media Graphics',
            date: '2026-01-29T00:00:00Z',
            gigId: 'cg4',
        },
    ],
};

// Mock Active Gigs - ONGOING
export const mockOngoingGigs: Gig[] = [
    {
        id: 'ag1',
        title: 'Product Photo Lab',
        clientId: 'client1',
        clientName: 'High-end Retouching Task',
        amount: 8000,
        deadline: '2026-02-05T18:00:00Z',
        progress: 65,
        unreadMessages: 3,
        status: 'ongoing',
        chatMessages: mockChatMessages['ag1'],
    },
    {
        id: 'ag2',
        title: 'Neon Brand Assets',
        clientId: 'client2',
        clientName: 'Cyberpunk Aesthetic',
        amount: 12000,
        deadline: '2026-02-06T12:00:00Z',
        progress: 80,
        unreadMessages: 1,
        status: 'ongoing',
        chatMessages: mockChatMessages['ag2'],
    },
];

// Mock Upcoming Gigs
export const mockUpcomingGigs: Gig[] = [
    {
        id: 'ug1',
        title: 'Social Media Assets',
        clientId: 'client4',
        clientName: 'Branding Kit • 48h limit',
        amount: 5000,
        deadline: '2026-02-12T18:00:00Z',
        startTime: '2026-02-09T09:00:00Z',
        progress: 0,
        unreadMessages: 0,
        status: 'upcoming',
    },
    {
        id: 'ug2',
        title: 'Video Subtitles',
        clientId: 'client5',
        clientName: 'Transcription • 12h limit',
        amount: 2500,
        deadline: '2026-02-15T18:00:00Z',
        startTime: '2026-02-11T10:00:00Z',
        progress: 0,
        unreadMessages: 0,
        status: 'upcoming',
    },
];

// Mock Completed Gigs
export const mockCompletedGigs: CompletedGig[] = [
    {
        id: 'cg1',
        title: 'Content Strategy',
        clientId: 'client6',
        clientName: 'TechFlow',
        amount: 4200,
        deadline: '2026-01-25T18:00:00Z',
        progress: 100,
        unreadMessages: 0,
        status: 'completed',
        completedDate: '2026-02-04T16:30:00Z',
        vibeBadges: ['STRATEGIST', 'MVP'],
        workSnippet: '📊 Validated 3 marketing angles for Q1 launch',
        rating: 5,
    },
    {
        id: 'cg2',
        title: '3D Character Model',
        clientId: 'client7',
        clientName: 'GameStudio X',
        amount: 15000,
        deadline: '2026-01-22T18:00:00Z',
        progress: 100,
        unreadMessages: 0,
        status: 'completed',
        completedDate: '2026-01-22T15:00:00Z',
        vibeBadges: ['POLYGON WIZARD', 'FAST TURNAROUND'],
        workSnippet: '👾 Low-poly character assets for mobile runner',
        rating: 5,
    },
    {
        id: 'cg3',
        title: 'UX Audit Report',
        clientId: 'client8',
        clientName: 'FinTech App',
        amount: 6500,
        deadline: '2026-01-20T18:00:00Z',
        progress: 100,
        unreadMessages: 0,
        status: 'completed',
        completedDate: '2026-01-20T17:45:00Z',
        vibeBadges: ['INSIGHTFUL', 'DETAILED'],
        workSnippet: '📱 Identified 15 friction points in onboarding',
        rating: 5,
    },
];

// Mock Client Gigs (Work Assigned by User)
export const mockClientGigs: Gig[] = [
    {
        id: 'cg_assigned_1',
        title: 'Corporate Rebranding',
        clientId: 'me',
        clientName: 'Me',
        amount: 25000,
        deadline: '2026-03-01T10:00:00Z',
        progress: 40,
        unreadMessages: 5,
        status: 'ongoing',
        chatMessages: [],
    },
    {
        id: 'cg_assigned_2',
        title: 'iOS App Development',
        clientId: 'me',
        clientName: 'Me',
        amount: 150000,
        deadline: '2026-04-15T18:00:00Z',
        progress: 15,
        unreadMessages: 2,
        status: 'ongoing',
    },
];

export const mockClientUpcomingGigs: Gig[] = [
    {
        id: 'cg_upcoming_1',
        title: 'Marketing Campaign Manager',
        clientId: 'me',
        clientName: 'Me',
        amount: 12000,
        deadline: '2026-02-20T09:00:00Z',
        startTime: '2026-02-18T09:00:00Z',
        progress: 0,
        unreadMessages: 0,
        status: 'upcoming',
    }
];
