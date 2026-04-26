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
import { PipelineGigDetailModal } from '@/components/my-work/pipeline/PipelineGigDetailModal';
import { RoleSelection } from '@/components/my-work/RoleSelection';
import { ProfileModal } from '@/components/my-work/ProfileModal';

// Updated components
import { OngoingGigCard } from '@/components/my-work/pipeline/OngoingGigCard';
import { UpcomingGigCard } from '@/components/my-work/pipeline/UpcomingGigCard';
import { HustleGoalCard } from '@/components/my-work/stash/HustleGoalCard';

// Data
import { Gig, ChatMessage, FileAttachment, TalentProfile } from '@/lib/types/mywork';

// Firestore Realtime integration
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { gigRowToGig, type GigRow } from '@/lib/queries';
import { getOrCreateChat, onMessagesChanged, sendMessage } from '@/lib/messaging';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type Tab = 'stash' | 'pipeline' | 'portfolio';
type ViewMode = 'selection' | 'client' | 'executor';

export default function MyWorkScreen() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { tab } = useLocalSearchParams<{ tab: Tab }>();

    const [viewMode, setViewMode] = useState<ViewMode>('selection');
    const [activeTab, setActiveTab] = useState<Tab>(tab || 'pipeline');

    // Update active tab if param changes
    useEffect(() => {
        if (tab && (tab === 'stash' || tab === 'pipeline' || tab === 'portfolio')) {
            setActiveTab(tab);
            if (viewMode === 'selection') {
                setViewMode('executor'); // Auto-select executor if linking to a specific tab
            }
        }
    }, [tab]);
    const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [selectedProfile, setSelectedProfile] = useState<TalentProfile | null>(null);

    // UI States
    const [chatModalVisible, setChatModalVisible] = useState(false);
    const [uploadModalVisible, setUploadModalVisible] = useState(false);
    const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [profileModalVisible, setProfileModalVisible] = useState(false);

    // Earnings Data state
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
    const monthlyEarnings = [
        { month: 'JANUARY', amount: '18,750' },
        { month: 'DECEMBER', amount: '22,400' },
        { month: 'NOVEMBER', amount: '15,200' },
    ];

    // State for gigs
    const [ongoingGigs, setOngoingGigs] = useState<Gig[]>([]);
    const [upcomingGigs, setUpcomingGigs] = useState<Gig[]>([]);
    const [completedGigs, setCompletedGigs] = useState<Gig[]>([]);

    // Fetch real-time gigs from Firestore for Pipeline
    useEffect(() => {
        if (!user || (viewMode !== 'executor' && viewMode !== 'client')) return;

        const qRef = collection(db, 'gigs');

        // Listen to gigs where we are involved
        const q = query(
            qRef,
            where(viewMode === 'client' ? 'client_id' : 'executor_id', '==', user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const liveGigs = snapshot.docs.map(doc => {
                const data = doc.data() as GigRow;
                data.id = doc.id;

                // Convert DB schema to UI Gig schema
                return {
                    id: doc.id,
                    title: data.title,
                    clientName: "Rohan K.", // Mocked for now
                    clientId: data.client_id || user.uid,
                    amount: (data.budget_min ?? 0) / 100,
                    status: data.status as 'ongoing' | 'upcoming' | 'completed',
                    dueDate: data.deadline ? new Date(data.deadline).toLocaleDateString() : 'TBD',
                    deadline: data.deadline || '',
                    progress: 0,
                    unreadMessages: 0,
                    tags: data.skills || [],
                    chatMessages: [],
                    filesRequired: ['Final Assets'],
                    filesUploaded: []
                } as Gig;
            });

            // Split into ongoing/upcoming manually for UI
            const liveOngoing = liveGigs.filter(g => g.status === 'ongoing');
            const liveUpcoming = liveGigs.filter(g => g.status === 'upcoming');
            const liveCompleted = liveGigs.filter(g => g.status === 'completed');

            setOngoingGigs(liveOngoing);
            setUpcomingGigs(liveUpcoming);
            setCompletedGigs(liveCompleted);
        }, (error) => {
            console.error("Firestore Error in pipeline:", error);
            setOngoingGigs([]);
            setUpcomingGigs([]);
            setCompletedGigs([]);
        });

        return () => unsubscribe();
    }, [viewMode, user]);

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
        // Mock profile logic disabled for now until user profiles are in DB
        setProfileModalVisible(true);
    };

    const handleOpenChat = async (gig: Gig) => {
        setSelectedGig(gig);

        // If it's a real gig, get or create the global chat thread
        if (!gig.id.startsWith('gig-') && user) {
            try {
                // In a real app, you'd pull the actual other user's ID/Name from the Gig data
                const otherUserId = viewMode === 'client' ? 'executor1' : 'client1';
                const otherUserName = viewMode === 'client' ? 'Executor User' : gig.clientName;

                const chatId = await getOrCreateChat(
                    user.uid,
                    otherUserId,
                    otherUserName,
                    null, // avatar
                    user.name || (viewMode === 'client' ? 'Client' : 'Executor User'),
                    gig.id,
                    gig.title
                );
                setActiveChatId(chatId);
            } catch (error) {
                console.error("Failed to initialize chat:", error);
            }
        }

        setChatModalVisible(true);
    };

    // Chat Real-time Listener
    useEffect(() => {
        if (!selectedGig || !chatModalVisible) return;

        // If it's a real gig, use the global messaging listener
        if (!selectedGig.id.startsWith('gig-') && activeChatId && user) {
            const unsubscribe = onMessagesChanged(activeChatId, (msgs) => {
                // Convert global ChatMessage to UI ChatMessage
                const uiMessages: ChatMessage[] = msgs.map(m => ({
                    id: m.id,
                    gigId: selectedGig.id,
                    senderId: m.senderId,
                    senderName: m.senderId === user.uid ? 'You' : (viewMode === 'client' ? 'Executor' : selectedGig.clientName),
                    senderRole: m.senderId === user.uid
                        ? (viewMode === 'client' ? 'client' : 'executor')
                        : (viewMode === 'client' ? 'executor' : 'client'),
                    message: m.text,
                    timestamp: m.createdAt,
                    isRead: m.status === 'read'
                }));

                setSelectedGig(prev => {
                    if (!prev) return prev;
                    if (prev.chatMessages?.length === uiMessages.length) return prev;
                    return { ...prev, chatMessages: uiMessages };
                });
            });

            return () => unsubscribe();
        }
    }, [selectedGig?.id, chatModalVisible, activeChatId]);

    const handleOpenUpload = (gig: Gig) => {
        setSelectedGig(gig);
        setUploadModalVisible(true);
    };

    const handleOpenDetail = (gig: Gig) => {
        setSelectedGig(gig);
        setDetailModalVisible(true);
    };

    const handleSendMessage = async (text: string) => {
        if (!selectedGig) return;

        // If it's a mock gig (e.g. "gig-1"), we just update local state since it doesn't exist in DB
        if (selectedGig.id.startsWith('gig-')) {
            const newMessage: ChatMessage = {
                id: Math.random().toString(),
                gigId: selectedGig.id,
                senderId: 'executor1',
                senderName: 'You',
                senderRole: 'executor',
                message: text,
                timestamp: new Date().toISOString(),
                isRead: true,
            };

            const updatedGig = {
                ...selectedGig,
                chatMessages: [...(selectedGig.chatMessages || []), newMessage]
            };
            setSelectedGig(updatedGig);
            if (viewMode === 'executor') {
                setOngoingGigs(prev => prev.map(g => g.id === selectedGig.id ? updatedGig : g));
            }
            return;
        }

        // Real Firestore Global Chat Workflow
        if (activeChatId && user) {
            try {
                await sendMessage(
                    user.uid,
                    activeChatId,
                    text,
                    'text'
                );
                // Result will automatically sync back via onMessagesChanged useEffect
            } catch (error) {
                console.error("Failed to send message:", error);
            }
        }
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

    // Loading/Auth State UI
    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-karya-yellow justify-center items-center">
                <Text>Loading Workspace...</Text>
            </SafeAreaView>
        );
    }

    if (!user) {
        return (
            <SafeAreaView className="flex-1 bg-karya-yellow justify-center items-center p-10">
                <Ionicons name="lock-closed" size={64} color="rgba(0,0,0,0.2)" />
                <Text className="text-center mt-4 text-base text-black/50 mb-6 font-medium">
                    Please log in to view your gigs, manage invoices, and sync your workflow.
                </Text>
                <Pressable
                    onPress={() => router.push('/onboarding')}
                    className="bg-black py-3 px-8 rounded-full active:opacity-80"
                >
                    <Text className="text-white font-bold">Sign In</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    // Initial Selection Screen
    if (viewMode === 'selection') {
        return <RoleSelection onSelectRole={setViewMode} userName={user.name || undefined} />;
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

                </View>

                {/* Title */}
                <Text className="text-3xl font-extrabold text-karya-black tracking-tight uppercase">
                    {viewMode === 'client' ? 'Client Dashboard' : 'My Work'}
                </Text>
            </View>

            {/* Content for CLIENT Dashboard */}
            {viewMode === 'client' && (
                <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 140 }}>
                    {/* Dynamic Summary Card */}
                    {(() => {
                        const totalEscrow = ongoingGigs.reduce((acc, gig) => acc + gig.amount, 0);
                        const totalReleased = completedGigs.reduce((acc, gig) => acc + gig.amount, 0);
                        const totalAssigned = totalEscrow + totalReleased;
                        
                        return (
                            <View className="bg-karya-black rounded-[32px] p-6 mb-6">
                                <Text className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">
                                    TOTAL WORK ASSIGNED
                                </Text>
                                <Text className="text-5xl font-extrabold text-karya-yellow tracking-tight">
                                    ₹{totalAssigned.toLocaleString('en-IN')}
                                </Text>
                                <View className="mt-6 flex-row gap-8">
                                    <View>
                                        <Text className="text-[10px] font-bold text-white/50 uppercase mb-1">IN ESCROW (ACTIVE)</Text>
                                        <Text className="text-xl font-bold text-white">{ongoingGigs.length} Gigs</Text>
                                    </View>
                                    <View>
                                        <Text className="text-[10px] font-bold text-white/50 uppercase mb-1">COMPLETED</Text>
                                        <Text className="text-xl font-bold text-white">{completedGigs.length} Gigs</Text>
                                    </View>
                                </View>
                            </View>
                        );
                    })()}

                    {/* Quick Actions Panel */}
                    <View className="flex-row gap-4 mb-6">
                        <Pressable
                            onPress={() => router.push('/post-gig')}
                            className="flex-1 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm active:scale-[0.98] items-center justify-center"
                        >
                            <View className="w-10 h-10 bg-karya-yellow/20 rounded-full items-center justify-center mb-2">
                                <Feather name="plus" size={20} color="#000" />
                            </View>
                            <Text className="font-bold text-karya-black">Post a Gig</Text>
                        </Pressable>
                        
                        <Pressable
                            onPress={() => {
                                // Future functionality
                            }}
                            className="flex-1 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm active:scale-[0.98] items-center justify-center"
                        >
                            <View className="w-10 h-10 bg-black/5 rounded-full items-center justify-center mb-2">
                                <Feather name="check-circle" size={20} color="#000" />
                            </View>
                            <Text className="font-bold text-karya-black">Review</Text>
                        </Pressable>
                    </View>

                    <Text className="text-sm font-bold text-karya-black/60 mb-4 px-1 uppercase tracking-wide">
                        ACTIVE ASSIGNMENTS
                    </Text>

                    {ongoingGigs.length > 0 ? (
                        ongoingGigs.map((gig) => (
                            <Pressable
                                key={gig.id}
                                onPress={() => handleOpenChat(gig)}
                                className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-50 active:scale-[0.98]"
                            >
                                <View className="flex-row justify-between items-start mb-2">
                                    <View className="bg-green-100 px-2 py-1 rounded-md">
                                        <Text className="text-[10px] font-bold text-green-700 uppercase">{gig.status}</Text>
                                    </View>
                                    <Text className="text-base font-extrabold text-karya-black">₹{gig.amount.toLocaleString('en-IN')}</Text>
                                </View>
                                <Text className="text-xl font-extrabold text-karya-black mb-1">{gig.title}</Text>

                                <View className="flex-row items-center gap-2 mb-4">
                                    <View className="w-5 h-5 bg-karya-yellow rounded-full items-center justify-center">
                                        <Feather name="user" size={10} color="black" />
                                    </View>
                                    <Text className="text-xs text-gray-400 font-bold">Client: <Text className="text-karya-black">{gig.clientName}</Text></Text>
                                </View>

                                <View className="bg-gray-100 h-2 rounded-full overflow-hidden mb-2">
                                    <View className="h-full bg-karya-black" style={{ width: `${gig.progress}%` }} />
                                </View>
                                <Text className="text-[10px] text-right font-bold text-gray-400">{gig.progress}% Complete</Text>
                            </Pressable>
                        ))
                    ) : (
                        <View className="py-10 items-center">
                            <Text className="text-gray-400 font-bold">No active assignments found.</Text>
                        </View>
                    )}

                    <Text className="text-sm font-bold text-karya-black/60 mb-4 px-1 uppercase tracking-wide mt-4">
                        UPCOMING LAUNCHES
                    </Text>

                    {upcomingGigs.length > 0 ? (
                        upcomingGigs.map((gig) => (
                            <UpcomingGigCard key={gig.id} gig={gig} onPress={() => handleOpenChat(gig)} />
                        ))
                    ) : (
                        <View className="py-10 items-center">
                            <Text className="text-gray-400 font-bold">No upcoming launches found.</Text>
                        </View>
                    )}
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
                            <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 140 }}>
                                <StashCard
                                    balance={14500}
                                    pendingPayment={8420}
                                    onWithdraw={() => setWithdrawModalVisible(true)}
                                />

                                <HustleGoalCard />

                                {/* EARNINGS HISTORY */}
                                <View className="bg-karya-black rounded-[32px] p-6 mb-6 flex-row items-center justify-between shadow-lg">
                                    <View className="flex-1">
                                        <View className="flex-row items-center gap-2 mb-1">
                                            <Text className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{monthlyEarnings[selectedMonthIndex].month} EARNINGS</Text>
                                            <View className="bg-karya-yellow/20 px-2 py-0.5 rounded-full">
                                                <Text className="text-[8px] font-bold text-karya-yellow">PROCESSED</Text>
                                            </View>
                                        </View>
                                        <Text className="text-3xl font-extrabold text-white">₹{monthlyEarnings[selectedMonthIndex].amount}</Text>
                                    </View>
                                    <View className="flex-row items-center gap-2">
                                        <Pressable
                                            onPress={() => setSelectedMonthIndex((prev) => (prev + 1) % monthlyEarnings.length)}
                                            className="w-10 h-10 bg-white/10 rounded-xl items-center justify-center active:bg-white/20"
                                        >
                                            <Feather name="chevron-left" size={18} color="white" />
                                        </Pressable>
                                        <Pressable
                                            onPress={() => setSelectedMonthIndex((prev) => (prev - 1 + monthlyEarnings.length) % monthlyEarnings.length)}
                                            className="w-10 h-10 bg-white/10 rounded-xl items-center justify-center active:bg-white/20"
                                        >
                                            <Feather name="chevron-right" size={18} color="white" />
                                        </Pressable>
                                    </View>
                                </View>

                                {/* Receipts Header */}
                                <View className="flex-row items-center justify-between mb-4 px-1">
                                    <Text className="text-sm font-bold text-karya-black uppercase tracking-wide">ACTIVITY LOG</Text>
                                    <Text className="text-xs font-bold text-karya-yellow bg-karya-black px-2 py-1 rounded-md">View All</Text>
                                </View>

                                <TransactionHistory transactions={[]} />
                            </ScrollView>
                        )}

                        {/* PIPELINE TAB */}
                        {activeTab === 'pipeline' && (
                            <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 140 }}>
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
                            <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 140 }}>
                                <View className="mb-4 px-1">
                                    <Text className="text-sm font-bold text-karya-black/60 uppercase tracking-wide">YOUR HUSTLE HISTORY</Text>
                                </View>
                                <PortfolioGrid
                                    completedGigs={[]}
                                    onGigPress={(gig) => handleOpenProfile(gig.clientId)}
                                />
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

                    <PipelineGigDetailModal
                        visible={detailModalVisible}
                        onClose={() => setDetailModalVisible(false)}
                        gig={selectedGig}
                    />
                </>
            )}

        </SafeAreaView>
    );
}
