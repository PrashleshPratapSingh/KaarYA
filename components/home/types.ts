/**
 * KaarYa Brand Colors & Types
 */

// Brand Colors
export const KARYA_YELLOW = '#FFE500';
export const KARYA_BLACK = '#000000';
export const KARYA_WHITE = '#FFFFFF';

// College Badge Colors
export const BADGE_COLORS = {
    nift: '#E91E63',
    iit: '#4CAF50',
    du: '#2196F3',
    bits: '#FF9800',
    nlu: '#9C27B0',
} as const;

// Types
export type CategoryType = 'all' | 'design' | 'writing' | 'tech' | 'marketing';
export type MascotMood = 'happy' | 'excited' | 'thinking' | 'waving';

export interface Gig {
    id: string;
    title: string;
    budget: number;
    postedBy: string;
    college: string;
    collegeCode: keyof typeof BADGE_COLORS;
    category: CategoryType;
    timeAgo: string;
    applicants: number;
}

import { Feather } from '@expo/vector-icons';

// Categories Config
export const CATEGORIES: { key: CategoryType; label: string; icon: keyof typeof Feather.glyphMap }[] = [
    { key: 'all', label: 'ALL', icon: 'grid' },
    { key: 'design', label: 'DESIGN', icon: 'pen-tool' },
    { key: 'writing', label: 'WRITING', icon: 'edit-3' },
    { key: 'tech', label: 'TECH', icon: 'code' },
    { key: 'marketing', label: 'MARKETING', icon: 'trending-up' },
];
