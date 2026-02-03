import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Gig } from '@/lib/types/mywork';
import Svg, { Circle } from 'react-native-svg';

interface OngoingGigCardProps {
    gig: Gig;
    onOpenChat: () => void;
    onOpenUpload: () => void;
    onPressProfile?: () => void;
}

export function OngoingGigCard({ gig, onOpenChat, onOpenUpload, onPressProfile }: OngoingGigCardProps) {
    const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculateTime = () => {
            const now = new Date().getTime();
            const deadline = new Date(gig.deadline).getTime();
            const diff = deadline - now;
            if (diff <= 0) {
                setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
                return;
            }
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeRemaining({ hours, minutes, seconds });
        };
        calculateTime();
        const interval = setInterval(calculateTime, 1000);
        return () => clearInterval(interval);
    }, [gig.deadline]);

    const timeLabel = `${String(timeRemaining.hours).padStart(2, '0')}:${String(timeRemaining.minutes).padStart(2, '0')}`;

    // Calculate progress for ring (0-100)
    const totalDuration = 24 * 60 * 60 * 1000; // Assume 24hr total
    const elapsed = totalDuration - (timeRemaining.hours * 60 * 60 * 1000 + timeRemaining.minutes * 60 * 1000);
    const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

    const size = 180;
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <View className="bg-white rounded-[32px] p-6 mb-4 shadow-sm">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-base font-extrabold text-karya-black">Active Now</Text>
                <View className="bg-karya-black px-3 py-1.5 rounded-full">
                    <Text className="text-[10px] font-bold text-karya-yellow uppercase">⚡ ON FIRE</Text>
                </View>
            </View>

            {/* Timer Ring */}
            <View className="items-center mb-6">
                <View style={{ width: size, height: size }}>
                    <Svg width={size} height={size} style={{ position: 'absolute' }}>
                        {/* Background ring */}
                        <Circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            stroke="#F3F4F6"
                            strokeWidth={strokeWidth}
                            fill="transparent"
                        />
                        {/* Progress ring */}
                        <Circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            stroke="#FFE500"
                            strokeWidth={strokeWidth}
                            fill="transparent"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            rotation="-90"
                            origin={`${size / 2}, ${size / 2}`}
                        />
                    </Svg>
                    <View className="absolute inset-0 items-center justify-center">
                        <Text className="text-4xl font-extrabold text-karya-black tracking-tight">
                            {timeLabel}
                        </Text>
                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">
                            TIME LEFT
                        </Text>
                    </View>
                </View>
            </View>

            {/* Gig Info */}
            <View className="items-center mb-6">
                <Text className="text-xl font-extrabold text-karya-black text-center">{gig.title}</Text>
                <Pressable onPress={onPressProfile} className="flex-row items-center gap-1.5 mt-1 active:opacity-60">
                    <Text className="text-sm text-gray-400 font-bold">{gig.clientName}</Text>
                    <Feather name="external-link" size={10} color="#9CA3AF" />
                </Pressable>
            </View>

            {/* Upload Button - Yellow like reference */}
            <Pressable
                onPress={onOpenUpload}
                className="bg-karya-yellow rounded-2xl py-5 items-center justify-center mb-4"
            >
                <View className="flex-row items-center gap-2">
                    <Text className="text-3xl">🚀</Text>
                </View>
                <Text className="text-sm font-extrabold text-karya-black mt-2">DROP FILES HERE!</Text>
                <Text className="text-[10px] font-bold text-karya-black/50 mt-1">TAP TO BROWSE</Text>
            </Pressable>

            {/* Chat Button */}
            <Pressable
                onPress={onOpenChat}
                className="flex-row items-center justify-center gap-2 py-3"
            >
                <Feather name="message-circle" size={16} color="#000" />
                <Text className="text-sm font-bold text-karya-black">Chat with {gig.clientName.split(' ')[0]}</Text>
                {gig.unreadMessages > 0 && (
                    <View className="bg-red-500 w-5 h-5 rounded-full items-center justify-center">
                        <Text className="text-[10px] font-bold text-white">{gig.unreadMessages}</Text>
                    </View>
                )}
            </Pressable>
        </View>
    );
}
