import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Pressable, ScrollView, ActivityIndicator, Image, Alert } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Gig } from '../../../lib/types/mywork';
import { GigApplication, fetchApplicationsForGig, acceptApplication } from '../../../lib/applications';
import { initiatePayment } from '../../../lib/payments';
import { useAuth } from '../../../app/context/AuthContext';
import { useRouter } from 'expo-router';

interface GigDetailModalProps {
    visible: boolean;
    onClose: () => void;
    gig: Gig | null;
}

export function PipelineGigDetailModal({ visible, onClose, gig }: GigDetailModalProps) {
    const { user } = useAuth();
    const router = useRouter();
    const [applications, setApplications] = useState<GigApplication[]>([]);
    const [loading, setLoading] = useState(false);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        if (visible && gig && gig.status === 'open' && user?.uid === gig.clientId) {
            setLoading(true);
            fetchApplicationsForGig(gig.id)
                .then(apps => {
                    setApplications(apps.filter(a => a.status === 'pending'));
                })
                .catch(err => console.error('Failed to load applications', err))
                .finally(() => setLoading(false));
        } else {
            setApplications([]);
        }
    }, [visible, gig, user]);

    if (!gig) return null;

    const handleAcceptAndPay = async (application: GigApplication) => {
        if (!user || !gig) return;

        Alert.alert(
            'Accept & Pay',
            `You are about to accept ${application.worker?.name || 'this doer'} for ₹${gig.amount.toLocaleString('en-IN')}.\n\nThe funds will be held securely in escrow until the work is complete.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Proceed to Payment',
                    onPress: async () => {
                        setProcessingId(application.id);
                        try {
                            // 1. Initiate Razorpay Payment
                            const paymentResult = await initiatePayment({
                                amount: gig.amount,
                                gigId: gig.id,
                                clientId: user.uid,
                                executorId: application.worker_id,
                                description: `Escrow for Gig: ${gig.title}`,
                                prefill: { name: user.name || '' }
                            });

                            if (paymentResult.success) {
                                // 2. If payment succeeds, accept the application in Firestore
                                await acceptApplication(application.id, gig.id, application.worker_id);
                                
                                Alert.alert('✅ Success', 'Payment secured in escrow. The gig has been assigned!');
                                onClose();
                            } else if (paymentResult.error !== 'Payment cancelled by user') {
                                Alert.alert('Payment Failed', paymentResult.error || 'Something went wrong.');
                            }
                        } catch (err: any) {
                            Alert.alert('Payment Error', err.message || 'Could not complete the process.');
                        } finally {
                            setProcessingId(null);
                        }
                    }
                }
            ]
        );
    };

    const deadlineDate = new Date(gig.deadline);
    const startDate = gig.startTime ? new Date(gig.startTime) : null;

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const daysUntilStart = startDate
        ? Math.ceil((startDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : 0;

    const isClientOwner = user?.uid === gig.clientId;

    return (
        <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
            <View className="flex-1 bg-black/50 justify-end">
                <View className="bg-white rounded-t-[32px] max-h-[85%]">
                    <View className="p-6">
                        <View className="w-12 h-1 bg-gray-200 rounded-full self-center mb-6" />

                        {/* Header */}
                        <View className="flex-row items-start justify-between mb-6">
                            <View className="flex-1 mr-4">
                                <View className="bg-karya-yellow px-3 py-1 rounded-full self-start mb-2">
                                    <Text className="text-[10px] font-bold text-karya-black uppercase">
                                        {gig.status === 'upcoming' ? 'SCHEDULED' : gig.status.toUpperCase()}
                                    </Text>
                                </View>
                                <Text className="text-xl font-extrabold text-karya-black leading-tight">
                                    {gig.title}
                                </Text>
                            </View>
                            <Pressable onPress={onClose} className="p-2">
                                <Feather name="x" size={24} color="#000" />
                            </Pressable>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Applications Section (Only for Client Owner on Open Gigs) */}
                            {isClientOwner && gig.status === 'open' && (
                                <View className="mb-6">
                                    <Text className="text-[10px] font-bold text-gray-400 uppercase mb-3">APPLICATIONS</Text>
                                    
                                    {loading ? (
                                        <ActivityIndicator size="small" color="#FACC15" className="my-4" />
                                    ) : applications.length > 0 ? (
                                        <View className="gap-3">
                                            {applications.map((app) => (
                                                <View key={app.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                                                    <View className="flex-row items-center justify-between mb-3">
                                                        <View className="flex-row items-center flex-1 mr-2">
                                                            <View className="w-10 h-10 bg-karya-black rounded-full items-center justify-center mr-3">
                                                                <Text className="text-base font-bold text-karya-yellow">
                                                                    {app.worker?.name?.charAt(0) || '?'}
                                                                </Text>
                                                            </View>
                                                            <View>
                                                                <Text className="text-sm font-bold text-karya-black">{app.worker?.name}</Text>
                                                                <Text className="text-[10px] text-gray-500">{app.worker?.university || 'Student'}</Text>
                                                            </View>
                                                        </View>
                                                        <View className="flex-row items-center">
                                                            <Feather name="star" size={12} color="#FACC15" />
                                                            <Text className="text-xs font-bold ml-1">{app.worker?.rating_avg?.toFixed(1) || 'NEW'}</Text>
                                                        </View>
                                                    </View>

                                                    {app.message ? (
                                                        <Text className="text-xs text-gray-600 italic mb-3">"{app.message}"</Text>
                                                    ) : null}

                                                    <Pressable 
                                                        className="bg-karya-black rounded-xl py-3 flex-row justify-center items-center gap-2"
                                                        onPress={() => handleAcceptAndPay(app)}
                                                        disabled={processingId !== null}
                                                    >
                                                        {processingId === app.id ? (
                                                            <ActivityIndicator size="small" color="#FACC15" />
                                                        ) : (
                                                            <>
                                                                <Ionicons name="shield-checkmark" size={16} color="#FACC15" />
                                                                <Text className="text-karya-yellow font-bold text-sm">ACCEPT & PAY IN ESCROW</Text>
                                                            </>
                                                        )}
                                                    </Pressable>
                                                </View>
                                            ))}
                                        </View>
                                    ) : (
                                        <View className="bg-gray-50 rounded-2xl p-6 items-center">
                                            <Feather name="inbox" size={24} color="#9CA3AF" />
                                            <Text className="text-gray-500 font-medium text-sm mt-2 text-center">No applications yet.{'\n'}We'll notify you when someone applies.</Text>
                                        </View>
                                    )}
                                </View>
                            )}

                            {/* Client Info (For Doer View) */}
                            {!isClientOwner && (
                                <View className="bg-gray-50 rounded-2xl p-4 mb-4">
                                    <Text className="text-[10px] font-bold text-gray-400 uppercase mb-2">CLIENT</Text>
                                    <View className="flex-row items-center gap-3">
                                        <View className="w-12 h-12 bg-karya-black rounded-full items-center justify-center">
                                            <Text className="text-lg font-bold text-karya-yellow">
                                                {gig.clientName.charAt(0)}
                                            </Text>
                                        </View>
                                        <View>
                                            <Text className="text-base font-bold text-karya-black">{gig.clientName}</Text>
                                            <Text className="text-xs text-gray-400">Verified Client</Text>
                                        </View>
                                    </View>
                                </View>
                            )}

                            {/* Timeline */}
                            <View className="bg-gray-50 rounded-2xl p-4 mb-4">
                                <Text className="text-[10px] font-bold text-gray-400 uppercase mb-3">TIMELINE</Text>

                                {startDate && (
                                    <View className="flex-row items-center gap-3 mb-4">
                                        <View className="w-10 h-10 bg-karya-yellow rounded-xl items-center justify-center">
                                            <Feather name="play" size={18} color="#000" />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-xs text-gray-400 uppercase">Starts</Text>
                                            <Text className="text-base font-bold text-karya-black">
                                                {formatDate(startDate)}
                                            </Text>
                                            <Text className="text-sm text-gray-500">{formatTime(startDate)}</Text>
                                        </View>
                                        {daysUntilStart > 0 && (
                                            <View className="bg-karya-black px-3 py-1.5 rounded-full">
                                                <Text className="text-xs font-bold text-karya-yellow">
                                                    IN {daysUntilStart} DAYS
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                )}

                                <View className="flex-row items-center gap-3">
                                    <View className="w-10 h-10 bg-red-100 rounded-xl items-center justify-center">
                                        <Feather name="flag" size={18} color="#EF4444" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-xs text-gray-400 uppercase">Deadline</Text>
                                        <Text className="text-base font-bold text-karya-black">
                                            {formatDate(deadlineDate)}
                                        </Text>
                                        <Text className="text-sm text-gray-500">{formatTime(deadlineDate)}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Payment */}
                            <View className="bg-karya-black rounded-2xl p-4 mb-6">
                                <Text className="text-[10px] font-bold text-white/50 uppercase mb-2">BUDGET</Text>
                                <Text className="text-3xl font-extrabold text-karya-yellow">
                                    ₹{gig.amount.toLocaleString('en-IN')}
                                </Text>
                                <Text className="text-xs text-white/50 mt-1">Ready for escrow</Text>
                            </View>
                        </ScrollView>

                        {/* Action Button */}
                        <Pressable
                            onPress={onClose}
                            className="bg-karya-yellow py-4 rounded-2xl items-center mt-4"
                        >
                            <Text className="text-karya-black font-extrabold text-base">CLOSE</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
