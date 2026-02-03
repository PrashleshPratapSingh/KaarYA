import React from 'react';
import { Modal, View, Text, Pressable, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { TalentProfile } from '../../lib/types/mywork';

interface ProfileModalProps {
    visible: boolean;
    onClose: () => void;
    profile: TalentProfile | null;
}

export function ProfileModal({ visible, onClose, profile }: ProfileModalProps) {
    if (!profile) return null;

    const getRankColor = (rank: string) => {
        switch (rank) {
            case 'G.O.A.T.': return '#FFE500';
            case 'Pro Hustler': return '#22C55E';
            default: return '#3B82F6';
        }
    };

    return (
        <Modal visible={visible} animationType="fade" transparent statusBarTranslucent>
            <View className="flex-1 bg-black/60 justify-center items-center px-6">
                <View className="bg-white rounded-[40px] w-full p-8 items-center shadow-2xl">
                    {/* Rank Badge */}
                    <View
                        className="absolute -top-4 px-6 py-2 rounded-full shadow-lg"
                        style={{ backgroundColor: getRankColor(profile.rank) }}
                    >
                        <Text className="text-sm font-extrabold text-karya-black uppercase tracking-widest">
                            {profile.rank}
                        </Text>
                    </View>

                    <Pressable
                        onPress={onClose}
                        className="absolute right-6 top-6 w-10 h-10 bg-gray-50 rounded-full items-center justify-center"
                    >
                        <Feather name="x" size={20} color="#000" />
                    </Pressable>

                    {/* Avatar */}
                    <View className="w-32 h-32 bg-karya-yellow rounded-[32px] mb-6 items-center justify-center border-4 border-karya-black overflow-hidden">
                        {profile.avatar ? (
                            <Image source={{ uri: profile.avatar }} className="w-full h-full" />
                        ) : (
                            <Feather name="user" size={64} color="#000" />
                        )}
                    </View>

                    {/* Info */}
                    <Text className="text-3xl font-extrabold text-karya-black mb-1">{profile.name}</Text>
                    <View className="flex-row items-center gap-2 mb-8">
                        <View className="flex-row items-center bg-gray-100 px-3 py-1 rounded-full">
                            <Feather name="star" size={14} color="#F59E0B" fill="#F59E0B" />
                            <Text className="text-sm font-bold text-gray-700 ml-1">{profile.rating.toFixed(1)}</Text>
                        </View>
                        <Text className="text-gray-300">•</Text>
                        <Text className="text-sm font-bold text-gray-500 uppercase tracking-tight">
                            {profile.completedGigs} Gigs Completed
                        </Text>
                    </View>

                    {/* Stats Grid */}
                    <View className="flex-row gap-4 mb-8">
                        <View className="flex-1 bg-gray-50 p-4 rounded-3xl border border-gray-100">
                            <Text className="text-[10px] font-bold text-gray-400 uppercase mb-2">Vibe Check</Text>
                            <View className="flex-row flex-wrap gap-2">
                                {profile.badges.map((badge: string, idx: number) => (
                                    <View key={idx} className="bg-white px-2 py-1 rounded-md border border-gray-100">
                                        <Text className="text-[10px] font-bold text-karya-black uppercase">{badge}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* CTA */}
                    <Pressable
                        onPress={onClose}
                        className="bg-karya-black w-full py-4 rounded-2xl items-center shadow-md active:scale-95 transition-all"
                    >
                        <Text className="text-white font-extrabold text-base uppercase tracking-widest">Done</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}
