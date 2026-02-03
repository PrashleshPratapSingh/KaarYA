/**
 * Sample Gig Data
 */
import { Gig } from './types';

export const SAMPLE_GIGS: Gig[] = [
    {
        id: '1',
        title: 'Design a Brutalist Poster for College Fest',
        budget: 1500,
        postedBy: 'Aria S.',
        college: 'NIFT DELHI',
        collegeCode: 'nift',
        category: 'design',
        timeAgo: '2h ago',
        applicants: 5,
    },
    {
        id: '2',
        title: 'Write Copy for Startup Landing Page',
        budget: 2000,
        postedBy: 'Rohan K.',
        college: 'DU NORTH',
        collegeCode: 'du',
        category: 'writing',
        timeAgo: '4h ago',
        applicants: 3,
    },
    {
        id: '3',
        title: 'Build a React Native Component',
        budget: 3500,
        postedBy: 'Priya M.',
        college: 'IIT BOMBAY',
        collegeCode: 'iit',
        category: 'tech',
        timeAgo: '6h ago',
        applicants: 8,
    },
    {
        id: '4',
        title: 'Instagram Growth Strategy for New Brand',
        budget: 1800,
        postedBy: 'Vikram D.',
        college: 'BITS PILANI',
        collegeCode: 'bits',
        category: 'marketing',
        timeAgo: '1d ago',
        applicants: 12,
    },
];
