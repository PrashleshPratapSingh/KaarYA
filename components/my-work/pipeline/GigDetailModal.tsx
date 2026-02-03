import React from 'react';
import { Modal, View, Text, Pressable, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Gig } from '../../../lib/types/mywork';

interface GigDetailModalProps {
    visible: boolean;
    onClose: () => void;
    gig: Gig | null;
}

export function GigDetailModal({ visible, onClose, gig }: GigDetailModalProps) {
    if (!gig) return null;

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
                            {/* Client Info */}
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
                                <Text className="text-[10px] font-bold text-white/50 uppercase mb-2">PAYMENT</Text>
                                <Text className="text-3xl font-extrabold text-karya-yellow">
                                    ₹{gig.amount.toLocaleString('en-IN')}
                                </Text>
                                <Text className="text-xs text-white/50 mt-1">Secured in escrow</Text>
                            </View>
                        </ScrollView>

                        {/* Action Button */}
                        <Pressable
                            onPress={onClose}
                            className="bg-karya-yellow py-4 rounded-2xl items-center mt-4"
                        >
                            <Text className="text-karya-black font-extrabold text-base">GOT IT</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
