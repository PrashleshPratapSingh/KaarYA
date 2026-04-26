import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Share, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Gig } from '@/lib/types/mywork';
import { CountdownCircularProgress } from '../CountdownCircularProgress';

interface OngoingGigCardProps {
    gig: Gig;
    onOpenChat: () => void;
    onOpenUpload: () => void;
    onPressProfile?: () => void;
}

export function OngoingGigCard({ gig, onOpenChat, onOpenUpload, onPressProfile }: OngoingGigCardProps) {
    const totalHours = (new Date(gig.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60);
    const showTimer = totalHours > 0 && totalHours < 48;

    return (
        <View className="bg-white rounded-[32px] p-6 mb-4 shadow-sm">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-base font-extrabold text-karya-black">Active Now</Text>
                <View className="bg-karya-black px-3 py-1.5 rounded-full">
                    <Text className="text-[10px] font-bold text-karya-yellow uppercase">⚡ {showTimer ? 'ON FIRE' : 'IN GRIND'}</Text>
                </View>
            </View>

            {/* Timer Ring or Deadline Date */}
            <View className="items-center mb-6">
                {showTimer ? (
                    <CountdownCircularProgress
                        deadline={gig.deadline}
                        size={180}
                        strokeWidth={12}
                    />
                ) : (
                    <View className="bg-gray-50 rounded-[32px] w-full py-10 items-center border border-gray-100">
                        <View className="w-16 h-16 bg-white rounded-2xl shadow-sm items-center justify-center mb-3">
                            <Feather name="calendar" size={32} color="#FFE500" />
                        </View>
                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px] mb-1">DEADLINE</Text>
                        <Text className="text-2xl font-extrabold text-karya-black">
                            {new Date(gig.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </Text>
                    </View>
                )}
            </View>

            {/* Gig Info */}
            <View className="items-center mb-6">
                <Text className="text-xl font-extrabold text-karya-black text-center">{gig.title}</Text>
                <Pressable onPress={onPressProfile} className="flex-row items-center gap-1.5 mt-1 active:opacity-60">
                    <Text className="text-sm text-gray-400 font-bold">{gig.clientName}</Text>
                    <Feather name="external-link" size={10} color="#9CA3AF" />
                </Pressable>
            </View>

            {/* Upload Button - Updated to 'Project Done' style */}
            <Pressable
                onPress={onOpenUpload}
                className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[32px] py-8 items-center justify-center mb-4 overflow-hidden"
            >
                <View className="items-center">
                    <View className="w-20 h-20 bg-white rounded-2xl shadow-sm items-center justify-center mb-3">
                        <Feather name="image" size={32} color="#D1D5DB" />
                    </View>
                    <Text className="text-sm font-extrabold text-karya-black">Upload Finished Work</Text>
                    <Text className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Snap & Earn</Text>
                </View>
            </Pressable>

            {/* Share Button (replacing chat per request) */}
            <View className="flex-row items-center justify-center gap-6 py-2 border-t border-gray-50 mt-2">
                <Pressable onPress={handleShare} className="flex-row items-center gap-2 active:scale-95">
                    <View className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center">
                        <Feather name="share-2" size={18} color="#000" />
                    </View>
                    <Text className="text-xs font-bold text-karya-black">SHARE PROJECT</Text>
                </Pressable>
            </View>
        </View>
    );
}
