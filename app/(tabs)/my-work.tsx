import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

// Components
import { StashCard } from '@/components/my-work/stash/StashCard';
import { TransactionHistory } from '@/components/my-work/stash/TransactionHistory';
import { PortfolioGrid } from '@/components/my-work/portfolio/PortfolioGrid';
import { ShareButton } from '@/components/my-work/portfolio/ShareButton';
import { GigChatModal } from '@/components/my-work/pipeline/GigChatModal';
import { FileUploadModal } from '@/components/my-work/pipeline/FileUploadModal';
import { WithdrawModal } from '@/components/my-work/stash/WithdrawModal';
import { GigDetailModal } from '@/components/my-work/pipeline/GigDetailModal';
import { RoleSelection } from '@/components/my-work/RoleSelection';
import { ProfileModal } from '@/components/my-work/ProfileModal';

// Updated components
import { OngoingGigCard } from '@/components/my-work/pipeline/OngoingGigCard';
import { UpcomingGigCard } from '@/components/my-work/pipeline/UpcomingGigCard';

// Data
import {
    mockWalletData,
    mockOngoingGigs,
    mockUpcomingGigs,
    mockCompletedGigs,
    mockClientGigs,
    mockClientUpcomingGigs,
    mockTalentProfiles,
} from '@/lib/mock/mywork-data';
import { Gig, ChatMessage, FileAttachment, TalentProfile } from '@/lib/types/mywork';

type Tab = 'stash' | 'pipeline' | 'portfolio';
type ViewMode = 'selection' | 'client' | 'executor';

export default function MyWorkScreen() {
    const [viewMode, setViewMode] = useState<ViewMode>('selection');
    const [activeTab, setActiveTab] = useState<Tab>('pipeline');
    const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
    const [selectedProfile, setSelectedProfile] = useState<TalentProfile | null>(null);

    // UI States
    const [chatModalVisible, setChatModalVisible] = useState(false);
    const [uploadModalVisible, setUploadModalVisible] = useState(false);
    const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [profileModalVisible, setProfileModalVisible] = useState(false);

    // State for gigs
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


    // Profile Handlers
    const handleOpenProfile = (userId: string) => {
        const profile = mockTalentProfiles[userId] || mockTalentProfiles['executor1']; // fallback
        setSelectedProfile(profile);
        setProfileModalVisible(true);
    };

    const handleOpenChat = (gig: Gig) => {
        setSelectedGig(gig);
        setChatModalVisible(true);
    };

    const handleOpenUpload = (gig: Gig) => {
        setSelectedGig(gig);
        setUploadModalVisible(true);
    };

    const handleOpenDetail = (gig: Gig) => {
        setSelectedGig(gig);
        setDetailModalVisible(true);
    };

    const handleSendMessage = (message: string) => {
        console.log('Sending message:', message);
    };

    const handleUploadFiles = async (files: Partial<FileAttachment>[]) => {
        console.log('Uploading files:', files);
    };

    const handleWithdraw = (amount: number, upiId: string) => {
        console.log(`Withdrawing ${amount} to ${upiId}`);
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

    // Initial Selection Screen
    if (viewMode === 'selection') {
        return <RoleSelection onSelectRole={setViewMode} />;
    }

    return (
        <SafeAreaView className="flex-1 bg-karya-yellow" edges={['top']}>
            {/* Header */}
            <View className="px-5 pt-4 pb-4">
                {/* Navigation Row */}
                <View className="flex-row items-center justify-between mb-2">
                    <Pressable
                        onPress={() => setViewMode('selection')}
                        className="w-10 h-10 bg-white/20 rounded-full items-center justify-center active:bg-white/40"
                    >
                        <Feather name="arrow-left" size={20} color="black" />
                    </Pressable>

                    {viewMode === 'client' && (
                        <View className="bg-blue-500 px-3 py-1 rounded-full">
                            <Text className="text-[10px] font-bold text-white uppercase">CLIENT MODE</Text>
                        </View>
                    )}
                </View>

                {/* Title */}
                <Text className="text-3xl font-extrabold text-karya-black tracking-tight uppercase">
                    {viewMode === 'client' ? 'Client Dashboard' : 'My Work'}
                </Text>
            </View>

            {/* Content for CLIENT Dashboard */}
            {viewMode === 'client' && (
                <ScrollView className="flex-1" contentContainerStyle={{ padding: 20 }}>
                    {/* Summary Card */}
                    <View className="bg-karya-black rounded-[32px] p-6 mb-6">
                        <Text className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">
                            TOTAL WORK ASSIGNED
                        </Text>
                        <Text className="text-5xl font-extrabold text-karya-yellow tracking-tight">
                            ₹187k
                        </Text>
                        <View className="mt-6 flex-row gap-8">
                            <View>
                                <Text className="text-[10px] font-bold text-white/50 uppercase mb-1">ACTIVE</Text>
                                <Text className="text-xl font-bold text-white">2 Gigs</Text>
                            </View>
                            <View>
                                <Text className="text-[10px] font-bold text-white/50 uppercase mb-1">COMPLETED</Text>
                                <Text className="text-xl font-bold text-white">14 Gigs</Text>
                            </View>
                        </View>
                    </View>

                    <Text className="text-sm font-bold text-karya-black/60 mb-4 px-1 uppercase tracking-wide">
                        ACTIVE ASSIGNMENTS
                    </Text>

                    {mockClientGigs.map((gig) => (
                        <Pressable
                            key={gig.id}
                            onPress={() => handleOpenProfile('executor1')} // Simulating clicking assigned person
                            className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-50 active:scale-[0.98]"
                        >
                            <View className="flex-row justify-between items-start mb-2">
                                <View className="bg-green-100 px-2 py-1 rounded-md">
                                    <Text className="text-[10px] font-bold text-green-700 uppercase">IN PROGRESS</Text>
                                </View>
                                <Text className="text-base font-extrabold text-karya-black">₹{gig.amount.toLocaleString('en-IN')}</Text>
                            </View>
                            <Text className="text-xl font-extrabold text-karya-black mb-1">{gig.title}</Text>

                            <View className="flex-row items-center gap-2 mb-4">
                                <View className="w-5 h-5 bg-karya-yellow rounded-full items-center justify-center">
                                    <Feather name="user" size={10} color="black" />
                                </View>
                                <Text className="text-xs text-gray-400 font-bold">Assigned to: <Text className="text-karya-black">Rohan K.</Text></Text>
                            </View>

                            <View className="bg-gray-100 h-2 rounded-full overflow-hidden mb-2">
                                <View className="h-full bg-karya-black" style={{ width: `${gig.progress}%` }} />
                            </View>
                            <Text className="text-[10px] text-right font-bold text-gray-400">{gig.progress}% Complete</Text>
                        </Pressable>
                    ))}

                    <Text className="text-sm font-bold text-karya-black/60 mb-4 px-1 uppercase tracking-wide mt-4">
                        UPCOMING LAUNCHES
                    </Text>

                    {mockClientUpcomingGigs.map((gig) => (
                        <UpcomingGigCard key={gig.id} gig={gig} onPress={() => handleOpenProfile('newbie1')} />
                    ))}
                </ScrollView>
            )}

            {/* Content for EXECUTOR Dashboard */}
            {viewMode === 'executor' && (
                <>
                    {/* Tab Navigation */}
                    <View className="bg-karya-yellow flex-row px-4 py-3">
                        <TabButton tab="stash" icon="dollar-sign" label="STASH" />
                        <TabButton tab="pipeline" icon="zap" label="PIPELINE" />
                        <TabButton tab="portfolio" icon="award" label="PORTFOLIO" />
                    </View>

                    {/* Executor Content */}
                    <View className="flex-1 bg-karya-yellow">
                        {/* STASH TAB */}
                        {activeTab === 'stash' && (
                            <ScrollView className="flex-1" contentContainerStyle={{ padding: 20 }}>
                                <StashCard
                                    balance={14500}
                                    onWithdraw={() => setWithdrawModalVisible(true)}
                                />

                                {/* The Stash - Escrow Section */}
                                <View className="bg-white rounded-3xl p-5 mb-5 shadow-sm">
                                    <View className="flex-row items-center justify-between mb-4">
                                        <View className="flex-row items-center gap-2">
                                            <View className="bg-karya-black px-2.5 py-1 rounded-full">
                                                <Feather name="lock" size={10} color="#FFE500" />
                                            </View>
                                            <Text className="text-base font-extrabold text-karya-black">THE VAULT</Text>
                                            <View className="bg-gray-100 px-2 py-0.5 rounded-md">
                                                <Text className="text-[10px] font-bold text-gray-400 uppercase">ESCROW</Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View className="mb-4">
                                        <View className="flex-row justify-between mb-2">
                                            <Text className="text-[10px] font-bold text-gray-400 uppercase">GOAL PROGRESS</Text>
                                            <Text className="text-[10px] font-bold text-gray-400">
                                                <Text className="text-karya-black text-sm">₹6,500</Text> / 10k
                                            </Text>
                                        </View>
                                        <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <View className="h-full bg-karya-yellow w-[65%]" />
                                        </View>
                                    </View>

                                    <View className="flex-row gap-3">
                                        <View className="flex-1 bg-gray-50 rounded-2xl p-3">
                                            <Text className="text-[10px] text-gray-400 font-bold uppercase mb-1">PENDING</Text>
                                            <Text className="text-lg font-extrabold text-karya-black">₹8,000</Text>
                                        </View>
                                        <View className="flex-1 bg-gray-50 rounded-2xl p-3">
                                            <Text className="text-[10px] text-gray-400 font-bold uppercase mb-1">LOCKED</Text>
                                            <Text className="text-lg font-extrabold text-karya-black">₹2,400</Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Receipts Header */}
                                <View className="flex-row items-center justify-between mb-4 px-1">
                                    <Text className="text-sm font-bold text-karya-black uppercase tracking-wide">ACTIVITY LOG</Text>
                                    <Text className="text-xs font-bold text-karya-yellow bg-karya-black px-2 py-1 rounded-md">View All</Text>
                                </View>

                                <TransactionHistory transactions={mockWalletData.transactions} />
                            </ScrollView>
                        )}

                        {/* PIPELINE TAB */}
                        {activeTab === 'pipeline' && (
                            <ScrollView className="flex-1" contentContainerStyle={{ paddingTop: 16, paddingHorizontal: 20, paddingBottom: 100 }}>
                                {/* Ongoing Gigs Section - LIMIT TO 1 */}
                                {ongoingGigs.length > 0 && (
                                    <View className="mb-6">
                                        <OngoingGigCard
                                            gig={ongoingGigs[0]}
                                            onOpenChat={() => handleOpenChat(ongoingGigs[0])}
                                            onOpenUpload={() => handleOpenUpload(ongoingGigs[0])}
                                            onPressProfile={() => handleOpenProfile('client1')}
                                        />
                                    </View>
                                )}

                                {/* Upcoming Gigs Section */}
                                {upcomingGigs.length > 0 && (
                                    <View>
                                        <Text className="text-base font-extrabold text-karya-black mb-4 uppercase tracking-tight">
                                            Upcoming
                                        </Text>
                                        {upcomingGigs.map((gig) => (
                                            <UpcomingGigCard
                                                key={gig.id}
                                                gig={gig}
                                                onPress={() => handleOpenDetail(gig)}
                                            />
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

                        {/* PORTFOLIO TAB */}
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
                </>
            )}

            {/* Modals */}
            <WithdrawModal
                visible={withdrawModalVisible}
                onClose={() => setWithdrawModalVisible(false)}
                balance={14500}
                onWithdraw={handleWithdraw}
            />

            <ProfileModal
                visible={profileModalVisible}
                onClose={() => setProfileModalVisible(false)}
                profile={selectedProfile}
            />

            {selectedGig && (
                <>
                    <GigChatModal
                        visible={chatModalVisible}
                        onClose={() => setChatModalVisible(false)}
                        gigId={selectedGig.id}
                        gigTitle={selectedGig.title}
                        messages={selectedGig.chatMessages || []}
                        currentUserRole={viewMode === 'client' ? 'client' : 'executor'}
                        onSendMessage={handleSendMessage}
                    />

                    <FileUploadModal
                        visible={uploadModalVisible}
                        onClose={() => setUploadModalVisible(false)}
                        gigId={selectedGig.id}
                        gigTitle={selectedGig.title}
                        onUpload={() => handleUploadFiles([])}
                    />

                    <GigDetailModal
                        visible={detailModalVisible}
                        onClose={() => setDetailModalVisible(false)}
                        gig={selectedGig}
                    />
                </>
            )}

        </SafeAreaView>
    );
}
