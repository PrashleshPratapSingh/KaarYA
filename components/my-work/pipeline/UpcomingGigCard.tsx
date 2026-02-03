import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Share, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Gig } from '@/lib/types/mywork';

interface UpcomingGigCardProps {
    gig: Gig;
    onPress?: () => void;
}

export function UpcomingGigCard({ gig, onPress }: UpcomingGigCardProps) {
    const [timeToStart, setTimeToStart] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [isSoon, setIsSoon] = useState(false);

    useEffect(() => {
        const calculateTime = () => {
            const now = new Date().getTime();
            const start = gig.startTime ? new Date(gig.startTime).getTime() : now;
            const diff = start - now;

            if (diff <= 0) {
                setIsSoon(false);
                return;
            }

            const totalHours = diff / (1000 * 60 * 60);
            if (totalHours < 48) {
                setIsSoon(true);
                const hours = Math.floor(totalHours);
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                setTimeToStart({ hours, minutes, seconds });
            } else {
                setIsSoon(false);
            }
        };

        calculateTime();
        const interval = setInterval(calculateTime, 1000);
        return () => clearInterval(interval);
    }, [gig.startTime]);

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Excited for this upcoming gig on KaarYA: "${gig.title}"! 🚀`,
            });
        } catch (error: any) {
            Alert.alert(error.message);
        }
    };

    const dateObj = gig.startTime ? new Date(gig.startTime) : new Date();
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const dayNum = dateObj.getDate();
    const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();

    const timerLabel = `${String(timeToStart.hours).padStart(2, '0')}:${String(timeToStart.minutes).padStart(2, '0')}:${String(timeToStart.seconds).padStart(2, '0')}`;

    if (isSoon) {
        return (
            <Pressable
                onPress={onPress}
                className="bg-karya-black rounded-[32px] p-5 mb-4 flex-row items-center border border-karya-yellow/20 active:scale-[0.99]"
            >
                <View className="bg-karya-yellow rounded-2xl p-3 items-center justify-center mr-4">
                    <Feather name="clock" size={20} color="black" />
                </View>

                <View className="flex-1">
                    <Text className="text-[10px] font-bold text-karya-yellow uppercase tracking-widest mb-1">STARTS IN</Text>
                    <Text className="text-2xl font-extrabold text-white tracking-tighter">
                        {timerLabel}
                    </Text>
                    <Text className="text-xs text-white/40 font-bold mt-1 uppercase" numberOfLines={1}>
                        {gig.title}
                    </Text>
                </View>

                <Pressable
                    onPress={handleShare}
                    className="w-10 h-10 bg-white/10 rounded-full items-center justify-center mr-2"
                >
                    <Feather name="share-2" size={16} color="white" />
                </Pressable>
                <Feather name="chevron-right" size={24} color="#FFE500" />
            </Pressable>
        );
    }

    return (
        <Pressable
            onPress={onPress}
            className="bg-white rounded-[32px] p-5 mb-4 border border-gray-100 shadow-sm active:bg-gray-50 transition-all"
        >
            <View className="flex-row items-start justify-between mb-4">
                <View className="bg-gray-50 rounded-2xl p-3 items-center justify-center">
                    <Text className="text-[10px] font-extrabold text-gray-400 uppercase">{monthName}</Text>
                    <Text className="text-xl font-extrabold text-karya-black">{dayNum}</Text>
                </View>

                <View className="flex-row gap-2">
                    <Pressable
                        onPress={handleShare}
                        className="w-10 h-10 bg-gray-50 rounded-xl items-center justify-center active:scale-95"
                    >
                        <Feather name="share-2" size={16} color="#000" />
                    </Pressable>
                    <View className="w-10 h-10 bg-karya-yellow rounded-xl items-center justify-center">
                        <Feather name="calendar" size={18} color="black" />
                    </View>
                </View>
            </View>

            <View>
                <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">UPCOMING PROJECT</Text>
                <Text className="text-2xl font-extrabold text-karya-black leading-tight">
                    {gig.title}
                </Text>
                <View className="flex-row items-center gap-2 mt-2">
                    <View className="w-5 h-5 bg-gray-100 rounded-full items-center justify-center">
                        <Feather name="user" size={10} color="#9CA3AF" />
                    </View>
                    <Text className="text-xs text-gray-400 font-bold uppercase">{gig.clientName}</Text>
                </View>
            </View>
        </Pressable>
    );
}
