/**
 * Firestore Seed Script — KaarYa
 *
 * Run this once to populate Firestore with sample gigs for development & testing.
 *
 * Usage from any screen:
 *   import { seedFirestore } from '../lib/seed';
 *   await seedFirestore(); // Call once, then remove
 *
 * Or call from the developer console / a debug button.
 */
import { collection, addDoc, serverTimestamp, getDocs, query, limit } from 'firebase/firestore';
import { db } from './firebase';

const SAMPLE_GIGS = [
    {
        title: 'Instagram Reel Editor Needed',
        description: 'Looking for someone to edit 3 Instagram reels for our cafe launch. Must know trending transitions and have CapCut experience.',
        category: 'video',
        status: 'open',
        budget_min: 150000, // ₹1,500 in paise
        budget_max: 150000,
        budget_type: 'fixed',
        skills: ['Video Editing', 'CapCut', 'Instagram'],
        urgency: 'urgent',
        applications_count: 4,
        views_count: 27,
    },
    {
        title: 'Design a Minimal Logo',
        description: 'Need a clean, minimal logo for a tech startup. Should work in both light and dark backgrounds. Deliverables: SVG + PNG.',
        category: 'design',
        status: 'open',
        budget_min: 250000, // ₹2,500
        budget_max: 250000,
        budget_type: 'fixed',
        skills: ['Logo Design', 'Illustrator', 'Figma'],
        urgency: 'normal',
        applications_count: 8,
        views_count: 45,
    },
    {
        title: 'SEO Blog Articles (5 posts)',
        description: 'Write 5 SEO-optimized blog articles for a fitness brand. Each article should be 800-1200 words with proper keyword placement.',
        category: 'writing',
        status: 'open',
        budget_min: 350000, // ₹3,500
        budget_max: 350000,
        budget_type: 'fixed',
        skills: ['SEO Writing', 'Content Marketing', 'WordPress'],
        urgency: 'normal',
        applications_count: 12,
        views_count: 63,
    },
    {
        title: 'React Native Bug Fix',
        description: 'Our Expo app has a navigation bug where the tab bar disappears after deep linking. Need someone familiar with expo-router.',
        category: 'development',
        status: 'open',
        budget_min: 200000, // ₹2,000
        budget_max: 200000,
        budget_type: 'fixed',
        skills: ['React Native', 'Expo', 'TypeScript'],
        urgency: 'urgent',
        applications_count: 3,
        views_count: 19,
    },
    {
        title: 'Social Media Campaign Plan',
        description: 'Create a 30-day social media content calendar for a new D2C skincare brand. Include post ideas, hashtags, and posting schedule.',
        category: 'marketing',
        status: 'open',
        budget_min: 400000, // ₹4,000
        budget_max: 400000,
        budget_type: 'fixed',
        skills: ['Social Media Marketing', 'Content Strategy', 'Canva'],
        urgency: 'normal',
        applications_count: 6,
        views_count: 38,
    },
    {
        title: 'UI/UX Case Study Presentation',
        description: 'Need a polished case study presentation for my portfolio. I have the content, just need someone to make it look amazing in Figma.',
        category: 'design',
        status: 'open',
        budget_min: 180000, // ₹1,800
        budget_max: 180000,
        budget_type: 'fixed',
        skills: ['Figma', 'Presentation Design', 'UI/UX'],
        urgency: 'normal',
        applications_count: 5,
        views_count: 31,
    },
];

/**
 * Seed Firestore with sample gigs.
 * Checks if gigs already exist to avoid duplicates.
 */
export async function seedFirestore(): Promise<void> {
    // Check if gigs already exist
    const existing = await getDocs(query(collection(db, 'gigs'), limit(1)));
    if (!existing.empty) {
        console.log('🌱 Firestore already has gigs, skipping seed.');
        return;
    }

    console.log('🌱 Seeding Firestore with sample gigs...');

    // Use a dummy client_id (this would be a real user in production)
    const dummyClientId = 'seed-user-001';

    for (const gig of SAMPLE_GIGS) {
        await addDoc(collection(db, 'gigs'), {
            ...gig,
            client_id: dummyClientId,
            deadline: null,
            created_at: serverTimestamp(),
        });
    }

    console.log(`🌱 Seeded ${SAMPLE_GIGS.length} gigs into Firestore!`);
}
