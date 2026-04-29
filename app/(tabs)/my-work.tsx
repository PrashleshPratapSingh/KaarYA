import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, BackHandler, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';

// Components
import { StashCard } from '@/components/my-work/stash/StashCard';
import { WithdrawModal } from '@/components/my-work/stash/WithdrawModal';
import { OngoingGigCard } from '@/components/my-work/pipeline/OngoingGigCard';
import { UpcomingGigCard } from '@/components/my-work/pipeline/UpcomingGigCard';
import { GigChatModal } from '@/components/my-work/pipeline/GigChatModal';
import { FileUploadModal } from '@/components/my-work/pipeline/FileUploadModal';
import { PipelineGigDetailModal } from '@/components/my-work/pipeline/PipelineGigDetailModal';
import { RoleSelection } from '@/components/my-work/RoleSelection';

// Data
import { Gig, ChatMessage } from '@/lib/types/mywork';

// Firestore
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { type GigRow, deleteGig, closeGig } from '@/lib/queries';
import { getOrCreateChat, onMessagesChanged, sendMessage } from '@/lib/messaging';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'expo-router';
import { initiatePayment } from '@/lib/payments';

type ViewMode = 'selection' | 'client' | 'executor';

export default function MyWorkScreen() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [viewMode, setViewMode] = useState<ViewMode>('selection');

    // Gig state
    const [ongoingGigs, setOngoingGigs] = useState<Gig[]>([]);
    const [upcomingGigs, setUpcomingGigs] = useState<Gig[]>([]);
    const [completedGigs, setCompletedGigs] = useState<Gig[]>([]);

    // Modal state
    const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [chatModalVisible, setChatModalVisible] = useState(false);
    const [uploadModalVisible, setUploadModalVisible] = useState(false);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);

    // ── BackHandler: Always go back to Role Selection ──
    useEffect(() => {
        if (viewMode === 'selection') return; // Don't intercept on selection screen

        const handler = BackHandler.addEventListener('hardwareBackPress', () => {
            setViewMode('selection');
            return true; // Prevent default back behavior
        });

        return () => handler.remove();
    }, [viewMode]);

    // ── Fetch real gigs from Firestore ──
    useEffect(() => {
        if (!user || viewMode === 'selection') return;

        const qRef = collection(db, 'gigs');
        const q = query(
            qRef,
            where(viewMode === 'client' ? 'client_id' : 'executor_id', '==', user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const liveGigs = snapshot.docs.map(doc => {
                const data = doc.data() as GigRow;
                return {
                    id: doc.id,
                    title: data.title,
                    clientName: 'Client',
                    clientId: data.client_id || user.uid,
                    amount: (data.budget_min ?? 0) / 100,
                    status: data.status as 'ongoing' | 'upcoming' | 'completed',
                    dueDate: data.deadline ? new Date(data.deadline).toLocaleDateString() : 'TBD',
                    deadline: data.deadline || '',
                    progress: 0,
                    unreadMessages: 0,
                    tags: data.skills || [],
                    chatMessages: [],
                    filesRequired: [],
                    filesUploaded: [],
                } as Gig;
            });

            setOngoingGigs(liveGigs.filter(g => g.status === 'ongoing'));
            setUpcomingGigs(liveGigs.filter(g => g.status === 'upcoming' || g.status === 'open' || g.status === 'pending'));
            setCompletedGigs(liveGigs.filter(g => g.status === 'completed'));
        }, (error) => {
            console.error('Firestore gig listener error:', error);
        });

        return () => unsubscribe();
    }, [viewMode, user]);

    // ── Chat Logic ──
    const handleOpenChat = async (gig: Gig) => {
        setSelectedGig(gig);
        if (user && !gig.id.startsWith('gig-')) {
            try {
                const otherUserId = viewMode === 'client' ? 'executor1' : gig.clientId;
                const otherUserName = viewMode === 'client' ? 'Executor' : gig.clientName;
                const chatId = await getOrCreateChat(
                    user.uid, otherUserId, otherUserName, null,
                    user.name || 'User', gig.id, gig.title
                );
                setActiveChatId(chatId);
            } catch (err) {
                console.error('Chat init failed:', err);
            }
        }
        setChatModalVisible(true);
    };

    useEffect(() => {
        if (!selectedGig || !chatModalVisible || !activeChatId || !user) return;
        if (selectedGig.id.startsWith('gig-')) return;

        const unsubscribe = onMessagesChanged(activeChatId, (msgs) => {
            const uiMessages: ChatMessage[] = msgs.map(m => ({
                id: m.id,
                gigId: selectedGig.id,
                senderId: m.senderId,
                senderName: m.senderId === user.uid ? 'You' : 'Other',
                senderRole: m.senderId === user.uid
                    ? (viewMode === 'client' ? 'client' : 'executor')
                    : (viewMode === 'client' ? 'executor' : 'client'),
                message: m.text,
                timestamp: m.createdAt,
                isRead: m.status === 'read',
            }));
            setSelectedGig(prev => prev ? { ...prev, chatMessages: uiMessages } : prev);
        });

        return () => unsubscribe();
    }, [selectedGig?.id, chatModalVisible, activeChatId]);

    const handleSendMessage = async (text: string) => {
        if (!selectedGig || !activeChatId || !user) return;
        try {
            await sendMessage(user.uid, activeChatId, text, 'text');
        } catch (err) {
            console.error('Send message failed:', err);
        }
    };

    const handleOpenUpload = (gig: Gig) => {
        setSelectedGig(gig);
        setUploadModalVisible(true);
    };

    const handleOpenDetail = (gig: Gig) => {
        setSelectedGig(gig);
        setDetailModalVisible(true);
    };

    const handleWithdraw = (amount: number, upiId: string) => {
        Alert.alert('Withdraw Initiated', `₹${amount} withdrawal to ${upiId} will be processed once payment integration is live.`);
    };

    // ── Delete / Close Gig ────────────────────────────────────────────────────
    const handleDeleteGig = (gig: Gig) => {
        Alert.alert(
            '🗑️ Remove Gig',
            `What do you want to do with "${gig.title}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Close Gig',
                    onPress: async () => {
                        try {
                            await closeGig(gig.id, user!.uid);
                            Alert.alert('Done', 'Gig has been closed.');
                        } catch (err: any) {
                            Alert.alert('Error', err?.message || 'Could not close gig.');
                        }
                    },
                },
                {
                    text: 'Delete Permanently',
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert(
                            '⚠️ Are you sure?',
                            'This cannot be undone. The gig will be permanently deleted.',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                    text: 'Yes, Delete',
                                    style: 'destructive',
                                    onPress: async () => {
                                        try {
                                            await deleteGig(gig.id, user!.uid);
                                            Alert.alert('Deleted', 'Gig has been permanently deleted.');
                                        } catch (err: any) {
                                            Alert.alert('Error', err?.message || 'Could not delete gig.');
                                        }
                                    },
                                },
                            ]
                        );
                    },
                },
            ]
        );
    };

    // ── Fund Escrow (Client Dashboard) ────────────────────────────────
    const handleFundEscrow = async (gig?: Gig) => {
        if (!user) return;

        const targetGig = gig || ongoingGigs[0] || upcomingGigs[0];
        if (!targetGig) {
            Alert.alert('No Active Gigs', 'Post a gig first, then fund it via escrow.');
            return;
        }

        try {
            const result = await initiatePayment({
                amount: targetGig.amount,
                gigId: targetGig.id,
                clientId: user.uid,
                executorId: targetGig.clientId, // clientId field holds executor in this mapping
                description: `Escrow: ${targetGig.title}`,
                prefill: { name: user.name || '' },
            });

            if (result.success) {
                Alert.alert('✅ Escrow Funded!', `Payment of ₹${targetGig.amount} is now secured in escrow.`);
            } else if (result.error !== 'Payment cancelled by user') {
                Alert.alert('Payment Failed', result.error || 'Something went wrong.');
            }
        } catch (err: any) {
            Alert.alert('Payment Error', err?.message || 'An unexpected error occurred.');
        }
    };

    // ── Loading / Auth States ──
    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-karya-yellow justify-center items-center">
                <Text className="font-bold text-karya-black/50">Loading...</Text>
            </SafeAreaView>
        );
    }

    if (!user) {
        return (
            <SafeAreaView className="flex-1 bg-karya-yellow justify-center items-center px-10">
                <Ionicons name="lock-closed" size={48} color="rgba(0,0,0,0.15)" />
                <Text className="text-center mt-4 text-base text-black/50 mb-6 font-medium">
                    Sign in to manage your gigs and earnings.
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

    // ── Role Selection ──
    if (viewMode === 'selection') {
        return <RoleSelection onSelectRole={setViewMode} userName={user.name || undefined} />;
    }

    // ── Compute Stats ──
    const totalEscrow = ongoingGigs.reduce((acc, g) => acc + g.amount, 0);
    const totalCompleted = completedGigs.reduce((acc, g) => acc + g.amount, 0);
    const allGigsCount = ongoingGigs.length + upcomingGigs.length + completedGigs.length;

    return (
        <SafeAreaView className="flex-1 bg-karya-yellow" edges={['top']}>
            {/* Header */}
            <View className="px-5 pt-4 pb-4">
                <View className="flex-row items-center justify-between mb-2">
                    <Pressable
                        onPress={() => setViewMode('selection')}
                        className="w-10 h-10 bg-white/20 rounded-full items-center justify-center active:bg-white/40"
                    >
                        <Feather name="arrow-left" size={20} color="black" />
                    </Pressable>
                    <View className="bg-white/20 px-3 py-1 rounded-full">
                        <Text className="text-[10px] font-bold text-karya-black uppercase tracking-widest">
                            {viewMode === 'client' ? '● CLIENT' : '● EXECUTOR'}
                        </Text>
                    </View>
                </View>
                <Text className="text-3xl font-extrabold text-karya-black tracking-tight uppercase">
                    {viewMode === 'client' ? 'Client Dashboard' : 'My Work'}
                </Text>
            </View>

            {/* ────────────────── CLIENT DASHBOARD ────────────────── */}
            {viewMode === 'client' && (
                <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 140 }}>
                    {/* Summary Card */}
                    <View className="bg-karya-black rounded-[32px] p-6 mb-6">
                        <Text className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">
                            TOTAL WORK ASSIGNED
                        </Text>
                        <Text className="text-5xl font-extrabold text-karya-yellow tracking-tight">
                            ₹{(totalEscrow + totalCompleted).toLocaleString('en-IN')}
                        </Text>
                        <View className="mt-6 flex-row gap-8">
                            <View>
                                <Text className="text-[10px] font-bold text-white/50 uppercase mb-1">IN ESCROW</Text>
                                <Text className="text-xl font-bold text-white">{ongoingGigs.length} Gigs</Text>
                            </View>
                            <View>
                                <Text className="text-[10px] font-bold text-white/50 uppercase mb-1">COMPLETED</Text>
                                <Text className="text-xl font-bold text-white">{completedGigs.length} Gigs</Text>
                            </View>
                        </View>
                    </View>

                    {/* Quick Actions */}
                    <View className="flex-row gap-4 mb-6">
                        <Pressable
                            onPress={() => router.push('/post-gig')}
                            className="flex-1 bg-white border border-gray-100 rounded-[28px] p-5 items-center justify-center active:scale-[0.97]"
                        >
                            <View className="w-12 h-12 bg-karya-yellow/20 rounded-full items-center justify-center mb-3">
                                <Feather name="plus" size={22} color="#000" />
                            </View>
                            <Text className="font-extrabold text-karya-black text-sm">Post a Gig</Text>
                            <Text className="text-[10px] text-gray-400 font-medium mt-1">Create new work</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => handleFundEscrow()}
                            className="flex-1 bg-white border border-gray-100 rounded-[28px] p-5 items-center justify-center active:scale-[0.97]"
                        >
                            <View className="w-12 h-12 bg-green-50 rounded-full items-center justify-center mb-3">
                                <Feather name="shield" size={22} color="#22C55E" />
                            </View>
                            <Text className="font-extrabold text-karya-black text-sm">Fund Escrow</Text>
                            <Text className="text-[10px] text-gray-400 font-medium mt-1">Secure payment</Text>
                        </Pressable>
                    </View>

                    {/* Active Assignments */}
                    <Text className="text-sm font-bold text-karya-black/60 mb-4 px-1 uppercase tracking-wide">
                        ACTIVE ASSIGNMENTS
                    </Text>

                    {ongoingGigs.length > 0 ? (
                        ongoingGigs.map((gig) => (
                            <Pressable
                                key={gig.id}
                                onPress={() => handleOpenChat(gig)}
                                onLongPress={() => handleDeleteGig(gig)}
                                className="bg-white rounded-[28px] p-5 mb-4 border border-gray-50 active:scale-[0.98]"
                            >
                                <View className="flex-row justify-between items-start mb-3">
                                    <View className="bg-green-100 px-3 py-1 rounded-full">
                                        <Text className="text-[10px] font-bold text-green-700 uppercase">{gig.status}</Text>
                                    </View>
                                    <View className="flex-row items-center gap-3">
                                        <Text className="text-lg font-extrabold text-karya-black">₹{gig.amount.toLocaleString('en-IN')}</Text>
                                        <Pressable
                                            onPress={() => handleDeleteGig(gig)}
                                            hitSlop={8}
                                            className="w-8 h-8 bg-red-50 rounded-full items-center justify-center"
                                        >
                                            <Feather name="trash-2" size={14} color="#EF4444" />
                                        </Pressable>
                                    </View>
                                </View>
                                <Text className="text-xl font-extrabold text-karya-black mb-3">{gig.title}</Text>
                                <View className="bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <View className="h-full bg-karya-black rounded-full" style={{ width: `${gig.progress}%` }} />
                                </View>
                                <Text className="text-[10px] text-right font-bold text-gray-400 mt-1">{gig.progress}% Complete</Text>
                            </Pressable>
                        ))
                    ) : (
                        <View className="py-16 items-center bg-white rounded-[28px]">
                            <Feather name="inbox" size={40} color="rgba(0,0,0,0.08)" />
                            <Text className="text-karya-black font-extrabold text-lg mt-4">No Active Gigs</Text>
                            <Text className="text-karya-black/40 text-xs font-medium mt-1">Post a gig to get started</Text>
                        </View>
                    )}

                    {/* Pending Gigs */}
                    {upcomingGigs.length > 0 && (
                        <>
                            <Text className="text-sm font-bold text-karya-black/60 mb-4 px-1 uppercase tracking-wide mt-6">
                                PENDING / OPEN
                            </Text>
                            {upcomingGigs.map((gig) => (
                                <View key={gig.id} className="flex-row items-center mb-3 gap-2">
                                    <View className="flex-1">
                                        <UpcomingGigCard gig={gig} onPress={() => handleOpenDetail(gig)} />
                                    </View>
                                    <Pressable
                                        onPress={() => handleDeleteGig(gig)}
                                        className="w-10 h-10 bg-red-50 rounded-2xl items-center justify-center"
                                        hitSlop={6}
                                    >
                                        <Feather name="trash-2" size={16} color="#EF4444" />
                                    </Pressable>
                                </View>
                            ))}
                        </>
                    )}
                </ScrollView>
            )}

            {/* ────────────────── EXECUTOR DASHBOARD ────────────────── */}
            {viewMode === 'executor' && (
                <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 140 }}>
                    {/* Wallet Card */}
                    <StashCard
                        balance={totalCompleted}
                        pendingPayment={totalEscrow}
                        onWithdraw={() => setWithdrawModalVisible(true)}
                        onDeposit={() => Alert.alert('Coming Soon', 'Deposit functionality will be available once payment integration is live.')}
                    />

                    {/* Active Pipeline */}
                    <Text className="text-sm font-bold text-karya-black/60 mb-4 px-1 uppercase tracking-wide">
                        ACTIVE PIPELINE
                    </Text>

                    {ongoingGigs.length > 0 ? (
                        ongoingGigs.map((gig) => (
                            <OngoingGigCard
                                key={gig.id}
                                gig={gig}
                                onOpenChat={() => handleOpenChat(gig)}
                                onOpenUpload={() => handleOpenUpload(gig)}
                                onPressProfile={() => {}}
                            />
                        ))
                    ) : upcomingGigs.length > 0 ? null : (
                        <View className="py-16 items-center bg-white rounded-[28px] mb-6">
                            <Feather name="zap" size={40} color="rgba(0,0,0,0.08)" />
                            <Text className="text-karya-black font-extrabold text-lg mt-4">No Active Gigs</Text>
                            <Text className="text-karya-black/40 text-xs font-medium mt-1">Apply to gigs from the Home Feed!</Text>
                        </View>
                    )}

                    {/* Upcoming / Pending */}
                    {upcomingGigs.length > 0 && (
                        <>
                            <Text className="text-sm font-bold text-karya-black/60 mb-4 px-1 uppercase tracking-wide mt-2">
                                UPCOMING
                            </Text>
                            {upcomingGigs.map((gig) => (
                                <UpcomingGigCard key={gig.id} gig={gig} onPress={() => handleOpenDetail(gig)} />
                            ))}
                        </>
                    )}

                    {/* Completed Gigs */}
                    {completedGigs.length > 0 && (
                        <>
                            <Text className="text-sm font-bold text-karya-black/60 mb-4 px-1 uppercase tracking-wide mt-6">
                                COMPLETED
                            </Text>
                            {completedGigs.map((gig) => (
                                <Pressable
                                    key={gig.id}
                                    className="bg-white rounded-[28px] p-5 mb-4 border border-gray-50"
                                >
                                    <View className="flex-row justify-between items-center">
                                        <View className="flex-1 mr-4">
                                            <Text className="text-base font-extrabold text-karya-black">{gig.title}</Text>
                                            <Text className="text-xs text-gray-400 font-medium mt-1">{gig.dueDate}</Text>
                                        </View>
                                        <View className="items-end">
                                            <Text className="text-lg font-extrabold text-green-600">₹{gig.amount.toLocaleString('en-IN')}</Text>
                                            <View className="bg-green-100 px-2 py-0.5 rounded-full mt-1">
                                                <Text className="text-[9px] font-bold text-green-700 uppercase">Paid</Text>
                                            </View>
                                        </View>
                                    </View>
                                </Pressable>
                            ))}
                        </>
                    )}
                </ScrollView>
            )}

            {/* ────────────────── MODALS ────────────────── */}
            <WithdrawModal
                visible={withdrawModalVisible}
                onClose={() => setWithdrawModalVisible(false)}
                balance={totalCompleted}
                onWithdraw={handleWithdraw}
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
                        onUpload={() => {}}
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
