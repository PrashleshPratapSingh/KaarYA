import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

// Components
import { StashCard } from '../../components/my-work/stash/StashCard';
import { FundsBreakdown } from '../../components/my-work/stash/FundsBreakdown';
import { TransactionHistory } from '../../components/my-work/stash/TransactionHistory';
import { PortfolioGrid } from '../../components/my-work/portfolio/PortfolioGrid';
import { ShareButton } from '../../components/my-work/portfolio/ShareButton';
import { GigChatModal } from '../../components/my-work/pipeline/GigChatModal';
import { FileUploadModal } from '../../components/my-work/pipeline/FileUploadModal';

// Updated components
import { OngoingGigCard } from '../../components/my-work/pipeline/OngoingGigCard';
import { UpcomingGigCard } from '../../components/my-work/pipeline/UpcomingGigCard';

// Data
import {
    mockWalletData,
    mockOngoingGigs,
    mockUpcomingGigs,
    mockCompletedGigs,
} from '../../lib/mock/mywork-data';
import { Gig, ChatMessage, FileAttachment } from '../../lib/types/mywork';

type Tab = 'stash' | 'pipeline' | 'portfolio';

export default function MyWorkScreen() {
    const [activeTab, setActiveTab] = useState<Tab>('pipeline');
    const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
    const [chatModalVisible, setChatModalVisible] = useState(false);
    const [uploadModalVisible, setUploadModalVisible] = useState(false);
    const [ongoingGigs, setOngoingGigs] = useState(mockOngoingGigs);
    const [upcomingGigs, setUpcomingGigs] = useState(mockUpcomingGigs);

    // Auto-transition upcoming gigs to ongoing
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const readyGigs = upcomingGigs.filter(gig => {
                if (!gig.startTime) return false;
                return new Date(gig.startTime).getTime() <= now;
            });

            if (readyGigs.length > 0) {
                const transitioned = readyGigs.map(g => ({ ...g, status: 'ongoing' as const }));
                setOngoingGigs([...ongoingGigs, ...transitioned]);
                setUpcomingGigs(upcomingGigs.filter(g => !readyGigs.includes(g)));
            }
        }, 10000); // Check every 10 seconds

        return () => clearInterval(interval);
    }, [ongoingGigs, upcomingGigs]);

    // Handlers
    const handleOpenChat = (gig: Gig) => {
        setSelectedGig(gig);
        setChatModalVisible(true);
    };

    const handleOpenUpload = (gig: Gig) => {
        setSelectedGig(gig);
        setUploadModalVisible(true);
    };

    const handleSendMessage = (message: string) => {
        console.log('Sending message:', message);
        // TODO: Integrate with Convex
    };

    const handleUploadFiles = async (files: Partial<FileAttachment>[]) => {
        console.log('Uploading files:', files);
        // TODO: Integrate with Convex storage
    };

    const TabButton = ({ tab, icon, label }: { tab: Tab; icon: string; label: string }) => (
        <Pressable
            onPress={() => setActiveTab(tab)}
            className={`flex-1 py-3.5 px-3 flex-row items-center justify-center gap-2 rounded-full mx-1 ${activeTab === tab ? 'bg-karya-black' : 'bg-transparent'
                }`}
        >
            <Feather name={icon as any} size={14} color={activeTab === tab ? '#FFE500' : '#000000'} />
            <Text
                className={`text-[10px] font-bold tracking-tight uppercase ${activeTab === tab ? 'text-karya-yellow' : 'text-karya-black/70'
                    }`}
            >
                {label}
            </Text>
        </Pressable>
    );

    return (
        <SafeAreaView className="flex-1 bg-karya-yellow" edges={['top']}>
            {/* Header */}
            <View className="bg-karya-yellow px-5 pt-4 pb-2">
                <Text className="text-3xl font-extrabold text-karya-black tracking-tight">MY WORK</Text>
            </View>

            {/* Tab Navigation */}
            <View className="bg-karya-yellow flex-row px-4 py-3">
                <TabButton tab="stash" icon="dollar-sign" label="STASH" />
                <TabButton tab="pipeline" icon="zap" label="PIPELINE" />
                <TabButton tab="portfolio" icon="award" label="PORTFOLIO" />
            </View>

            {/* Content */}
            <View className="flex-1 bg-karya-yellow">
                {activeTab === 'stash' && (
                    <ScrollView className="flex-1" contentContainerStyle={{ padding: 20 }}>
                        <StashCard balance={14500} />

                        {/* The Stash - Escrow Section */}
                        <View className="bg-karya-black rounded-3xl p-5 mb-5">
                            <View className="flex-row items-center justify-between mb-4">
                                <View className="flex-row items-center gap-2">
                                    <View className="bg-karya-yellow px-2.5 py-1 rounded-full">
                                        <Text className="text-[9px] font-bold text-karya-black uppercase">ESCROW</Text>
                                    </View>
                                    <Text className="text-base font-extrabold text-white">THE STASH</Text>
                                </View>
                                <Text className="text-xl font-extrabold text-white">₹1,200</Text>
                            </View>
                            <Text className="text-xs text-white/60 font-medium">
                                Pending payout from <Text className="text-karya-yellow font-bold">3 gigs</Text>.
                            </Text>
                            <Text className="text-[10px] text-white/40 font-medium mt-1 uppercase">LOCKED</Text>
                        </View>

                        {/* Receipts Header */}
                        <View className="flex-row items-center justify-between mb-4 px-1">
                            <Text className="text-sm font-bold text-karya-black uppercase tracking-wide">RECEIPTS</Text>
                            <Text className="text-xs font-bold text-karya-black/50">See All</Text>
                        </View>

                        <TransactionHistory transactions={mockWalletData.transactions} />

                        {/* Withdraw Button */}
                        <View className="mt-6">
                            <Pressable className="bg-karya-black rounded-2xl py-5 flex-row items-center justify-center gap-2">
                                <Text className="text-sm font-extrabold text-white uppercase tracking-wide">WITHDRAW TO UPI</Text>
                                <Feather name="arrow-up-right" size={18} color="white" />
                            </Pressable>
                        </View>
                    </ScrollView>
                )}

                {activeTab === 'pipeline' && (
                    <ScrollView className="flex-1" contentContainerStyle={{ paddingTop: 16, paddingHorizontal: 20, paddingBottom: 100 }}>
                        {/* Ongoing Gigs Section */}
                        {ongoingGigs.length > 0 && (
                            <View className="mb-6">
                                {ongoingGigs.map((gig) => (
                                    <OngoingGigCard
                                        key={gig.id}
                                        gig={gig}
                                        onOpenChat={() => handleOpenChat(gig)}
                                        onOpenUpload={() => handleOpenUpload(gig)}
                                    />
                                ))}
                            </View>
                        )}

                        {/* Upcoming Gigs Section */}
                        {upcomingGigs.length > 0 && (
                            <View>
                                <Text className="text-sm font-bold text-karya-black/60 mb-4 px-1 uppercase tracking-wide">
                                    UPCOMING GIGS
                                </Text>
                                {upcomingGigs.map((gig) => (
                                    <UpcomingGigCard key={gig.id} gig={gig} />
                                ))}
                            </View>
                        )}

                        {ongoingGigs.length === 0 && upcomingGigs.length === 0 && (
                            <View className="items-center justify-center py-20 bg-white rounded-3xl">
                                <Feather name="inbox" size={64} color="#00000015" />
                                <Text className="text-karya-black/30 mt-4 font-bold text-lg">No active gigs</Text>
                                <Text className="text-karya-black/20 mt-1 text-sm">Strike a gig to get started!</Text>
                            </View>
                        )}
                    </ScrollView>
                )}

                {activeTab === 'portfolio' && (
                    <ScrollView className="flex-1" contentContainerStyle={{ padding: 20 }}>
                        <View className="mb-4 px-1">
                            <Text className="text-sm font-bold text-karya-black/60 uppercase tracking-wide">YOUR HUSTLE HISTORY</Text>
                        </View>
                        <PortfolioGrid completedGigs={mockCompletedGigs} />
                        <ShareButton />
                    </ScrollView>
                )}
            </View>

            {/* Modals */}
            {selectedGig && (
                <>
                    <GigChatModal
                        visible={chatModalVisible}
                        onClose={() => setChatModalVisible(false)}
                        gigId={selectedGig.id}
                        gigTitle={selectedGig.title}
                        messages={selectedGig.chatMessages || []}
                        currentUserRole="executor"
                        onSendMessage={handleSendMessage}
                    />

                    <FileUploadModal
                        visible={uploadModalVisible}
                        onClose={() => setUploadModalVisible(false)}
                        gigId={selectedGig.id}
                        gigTitle={selectedGig.title}
                        onUpload={() => handleUploadFiles([])}
                    />
                </>
            )}
        </SafeAreaView>
    );
}
