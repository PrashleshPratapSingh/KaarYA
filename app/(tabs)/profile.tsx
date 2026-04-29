import { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Image, Modal, Pressable, ScrollView, ActivityIndicator } from "react-native";
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, interpolate, Extrapolate } from "react-native-reanimated";
import { useTabBarContext } from '../../app/context/TabBarContext';
import { useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from "expo-router";
import { fetchUser, UserRow } from '@/lib/queries';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Skill chip color palette — cycles through 4 vivid options
const SKILL_COLORS = [
    { bg: '#FFE600', text: '#000' },      // KaarYa yellow
    { bg: '#000000', text: '#FFE600' },    // Black + yellow text
    { bg: '#E8F5E9', text: '#1B5E20' },    // Soft green
    { bg: '#FFF3E0', text: '#E65100' },    // Soft orange
];

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [userData, setUserData] = useState<UserRow | null>(() => {
        if (user) {
            return {
                id: user.uid,
                name: user.name || '',
                email: user.email || '',
                avatar_url: user.avatarUrl || null,
                university: '',
                bio: '',
                skills: [],
                gigs_completed: 0,
                rating_avg: 5.0,
                total_earnings: 0,
                is_verified: false,
                role: 'user',
                rating_count: 0,
                wallet_balance: 0,
                created_at: new Date().toISOString()
            } as UserRow;
        }
        return null;
    });
    const [isLoading, setIsLoading] = useState(!user);

    const [showSettings, setShowSettings] = useState(false);
    const [showPlayerCard, setShowPlayerCard] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const loadUserData = async () => {
                if (!user?.uid) return;
                try {
                    const data = await fetchUser(user.uid);
                    setUserData(data);
                } catch (error) {
                    console.log('Using local fallback for profile data');
                } finally {
                    setIsLoading(false);
                }
            };
            loadUserData();
        }, [user])
    );

    const { scrollY } = useTabBarContext();

    useFocusEffect(
        useCallback(() => {
            scrollY.value = 0;
            return () => {};
        }, [scrollY])
    );

    const curveStyle = useAnimatedStyle(() => {
        const translateY = interpolate(scrollY.value, [-150, -50, 0, 50], [-60, -20, 0, 30], Extrapolate.CLAMP);
        const scaleX = interpolate(scrollY.value, [-100, 0], [1.3, 1], Extrapolate.CLAMP);
        return { transform: [{ translateY }, { scaleX }] };
    });

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => { scrollY.value = event.contentOffset.y; },
    });

    if (isLoading) {
        return (
            <View className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#FFE600" />
            </View>
        );
    }

    if (!userData) {
        return (
            <View className="flex-1 bg-white items-center justify-center">
                <Text className="text-black font-bold">Failed to load profile.</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            <Animated.ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 60 }}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
            >
                {/* ── Header ── */}
                <View className="relative">
                    <LinearGradient
                        colors={['#FFE600', '#FFF176']}
                        className="w-full h-64 pt-14 px-5 items-end"
                    >
                        <TouchableOpacity
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                setShowSettings(true);
                            }}
                            className="w-10 h-10 bg-black/10 rounded-full items-center justify-center border border-black/10"
                        >
                            <Ionicons name="settings-outline" size={22} color="black" />
                        </TouchableOpacity>
                    </LinearGradient>

                    {/* Profile Card */}
                    <View className="px-5 -mt-24">
                        <View
                            className="bg-white rounded-[40px] p-6"
                            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 6 }}
                        >
                            <View className="flex-row items-center">
                                <View
                                    className="w-24 h-24 rounded-full overflow-hidden bg-gray-100"
                                    style={{ borderWidth: 3, borderColor: '#FFE600' }}
                                >
                                    {userData.avatar_url ? (
                                        <Image source={{ uri: userData.avatar_url }} className="w-full h-full" resizeMode="cover" />
                                    ) : (
                                        <View className="w-full h-full bg-black items-center justify-center">
                                            <Text className="text-[#FFE600] font-black text-3xl">
                                                {userData.name ? userData.name.charAt(0).toUpperCase() : '?'}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                                <View className="ml-5 flex-1">
                                    <Text className="text-black font-black text-2xl tracking-tight leading-tight">
                                        {userData.name || 'User'}
                                    </Text>
                                    <View className="flex-row items-center mt-1">
                                        <View className="bg-black px-2 py-0.5 rounded-md mr-2">
                                            <Text className="text-[#FFE600] font-black text-[9px] uppercase tracking-widest">
                                                {userData.role?.toUpperCase() || 'STUDENT'}
                                            </Text>
                                        </View>
                                        {userData.is_verified && (
                                            <MaterialIcons name="verified" size={14} color="#FFE600" />
                                        )}
                                    </View>
                                    <Text className="text-black/40 font-bold text-xs mt-1">
                                        {userData.university || 'Student'}
                                    </Text>
                                </View>
                            </View>

                            <Text className="text-black/60 mt-5 font-medium leading-5">
                                {userData.bio || 'Building the future of student work at KaarYa.'}
                            </Text>

                            <View className="h-[1px] bg-black/5 my-5" />

                            {/* Color-coded stats */}
                            <View className="flex-row gap-3">
                                <View className="flex-1 bg-[#FFE600] rounded-2xl py-3 items-center">
                                    <Text className="text-black font-black text-xl">{userData.gigs_completed}</Text>
                                    <Text className="text-black/50 font-bold text-[9px] uppercase tracking-widest mt-0.5">Gigs</Text>
                                </View>
                                <View className="flex-1 bg-black rounded-2xl py-3 items-center">
                                    <Text className="text-[#FFE600] font-black text-xl">{(userData.rating_avg ?? 0).toFixed(1)}</Text>
                                    <Text className="text-white/40 font-bold text-[9px] uppercase tracking-widest mt-0.5">Rating</Text>
                                </View>
                                <View className="flex-1 bg-[#F0FFF4] rounded-2xl py-3 items-center border border-green-100">
                                    <Text className="text-green-700 font-black text-xl">₹{userData.total_earnings}</Text>
                                    <Text className="text-green-400 font-bold text-[9px] uppercase tracking-widest mt-0.5">Earned</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* ── Identity Card ── */}
                <View className="mt-8 px-5">
                    <TouchableOpacity
                        onPress={() => {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            setShowPlayerCard(true);
                        }}
                        activeOpacity={0.9}
                    >
                        <View
                            className="w-full bg-black rounded-[28px] overflow-hidden"
                            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 15, elevation: 8 }}
                        >
                            {/* Yellow top accent bar */}
                            <View className="h-1.5 bg-[#FFE600]" />

                            <View className="flex-row p-6 items-center">
                                {/* Avatar */}
                                <View className="w-14 h-14 rounded-2xl overflow-hidden bg-[#FFE600]/10 border border-[#FFE600]/20 mr-4">
                                    {userData.avatar_url ? (
                                        <Image source={{ uri: userData.avatar_url }} className="w-full h-full" resizeMode="cover" />
                                    ) : (
                                        <View className="w-full h-full items-center justify-center">
                                            <Text className="text-[#FFE600] font-black text-xl">
                                                {userData.name ? userData.name.charAt(0).toUpperCase() : '?'}
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                {/* Info */}
                                <View className="flex-1">
                                    <View className="bg-[#FFE600] self-start px-2 py-0.5 rounded-md mb-1.5">
                                        <Text className="text-black font-black text-[8px] tracking-widest uppercase">Identity Pass</Text>
                                    </View>
                                    <Text className="text-white font-black text-xl tracking-tight leading-none">
                                        {userData.name ? userData.name.toUpperCase() : 'USER'}
                                    </Text>
                                    <Text className="text-white/30 text-[10px] font-bold mt-0.5">
                                        {userData.email || '@kaarya_user'}
                                    </Text>
                                </View>

                                {/* Score */}
                                <View className="items-center pl-4 border-l border-white/10">
                                    <Text className="text-[#FFE600] font-black text-3xl leading-none">{(userData.rating_avg ?? 0).toFixed(1)}</Text>
                                    <Text className="text-white/30 text-[9px] font-bold uppercase tracking-widest mt-1">Score</Text>
                                </View>
                            </View>

                            {/* Bottom strip */}
                            <View className="mx-6 mb-5 bg-white/5 rounded-xl px-4 py-2.5 flex-row justify-between items-center border border-white/10">
                                <View className="flex-row items-center gap-2">
                                    <Ionicons name="finger-print" size={13} color="#FFE600" />
                                    <Text className="text-[#FFE600] text-[10px] font-black tracking-widest uppercase">
                                        {userData.university || 'KaarYa Member'}
                                    </Text>
                                </View>
                                <View className="flex-row items-center gap-1">
                                    <Text className="text-white/30 text-[10px] font-bold">DETAILS</Text>
                                    <Ionicons name="chevron-forward" size={12} color="rgba(255,255,255,0.3)" />
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* ── Skill Set ── */}
                <View className="px-5 mt-10">
                    <Text className="text-black font-black text-lg mb-4 tracking-tight">Skill Set</Text>
                    <View className="flex-row flex-wrap gap-2">
                        {(userData.skills || []).length > 0 ? (
                            userData.skills.map((skill, index) => {
                                const color = SKILL_COLORS[index % SKILL_COLORS.length];
                                return (
                                    <View
                                        key={index}
                                        style={{ backgroundColor: color.bg }}
                                        className="rounded-2xl px-4 py-2.5"
                                    >
                                        <Text style={{ color: color.text }} className="font-black text-xs uppercase tracking-wide">
                                            {skill}
                                        </Text>
                                    </View>
                                );
                            })
                        ) : (
                            <Text className="text-black/30 font-bold text-sm">No skills added yet.</Text>
                        )}
                    </View>
                </View>

                {/* ── Activity ── */}
                <View className="px-5 mt-10">
                    <Text className="text-black font-black text-lg mb-4 tracking-tight">Activity</Text>
                    <TouchableOpacity
                        className="bg-white rounded-[24px] overflow-hidden"
                        style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: '#f0f0f0' }}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            router.push({ pathname: '/my-work', params: { tab: 'stash' } });
                        }}
                    >
                        <View className="flex-row items-center p-5">
                            {/* Color accent bar */}
                            <View className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FFE600] rounded-l-[24px]" />
                            <View className="w-12 h-12 bg-[#FFE600] rounded-2xl items-center justify-center ml-3">
                                <Feather name="folder" size={20} color="black" />
                            </View>
                            <View className="ml-4 flex-1">
                                <Text className="text-black font-bold text-base">Your Stash</Text>
                                <Text className="text-black/40 text-xs font-medium">View completed projects</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="black" opacity={0.2} />
                        </View>
                    </TouchableOpacity>
                </View>

            </Animated.ScrollView>

            {/* ── Settings Modal ── */}
            <Modal visible={showSettings} transparent animationType="fade" onRequestClose={() => setShowSettings(false)}>
                <View className="flex-1 bg-black/40 justify-end">
                    <Pressable className="absolute inset-0" onPress={() => setShowSettings(false)} />
                    <View className="bg-white rounded-t-[50px] p-8">
                        <View className="w-12 h-1 bg-gray-100 rounded-full self-center mb-8" />
                        <TouchableOpacity
                            onPress={async () => { setShowSettings(false); router.push('/onboarding/skills'); }}
                            className="bg-white border-2 border-black rounded-3xl py-5 items-center justify-center mb-3 flex-row gap-2"
                        >
                            <Feather name="user" size={18} color="black" />
                            <Text className="text-black font-black text-base">EDIT PROFILE</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { logout(); setShowSettings(false); }}
                            className="bg-[#FFE600] rounded-3xl py-5 items-center justify-center"
                        >
                            <Text className="text-black font-black text-lg">LOG OUT</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowSettings(false)} className="mt-4 py-4 items-center">
                            <Text className="text-black/30 font-bold">CANCEL</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* ── Identity Card Detail Modal ── */}
            <Modal visible={showPlayerCard} transparent animationType="fade" onRequestClose={() => setShowPlayerCard(false)}>
                <View className="flex-1 bg-black/95 justify-center px-5">
                    <View className="bg-black rounded-[40px] overflow-hidden border-2 border-[#FFE600]">
                        <View className="h-1.5 bg-[#FFE600]" />
                        <View className="p-8">
                            <View className="flex-row justify-between items-start">
                                <View>
                                    <Text className="text-[#FFE600] font-black text-3xl tracking-tighter">KAARYA</Text>
                                    <Text className="text-white/40 font-bold text-sm uppercase tracking-widest">{userData.name || 'USER'}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => setShowPlayerCard(false)}
                                    className="w-12 h-12 rounded-full bg-[#FFE600] items-center justify-center"
                                >
                                    <Ionicons name="close" size={24} color="black" />
                                </TouchableOpacity>
                            </View>

                            <View className="flex-row justify-between items-end mt-12">
                                <View className="bg-[#FFE600] px-4 py-2 rounded-2xl">
                                    <Text className="text-black font-black text-xs tracking-widest uppercase">Elite Pass</Text>
                                </View>
                                <View className="items-end">
                                    <Text className="text-white font-black text-6xl tracking-tighter">{(userData.rating_avg ?? 0).toFixed(1)}</Text>
                                    <Text className="text-[#FFE600]/40 font-bold text-xs uppercase tracking-widest">Score</Text>
                                </View>
                            </View>

                            <View className="mt-8 pt-8 border-t border-white/10">
                                <View className="flex-row flex-wrap gap-2">
                                    <View className="bg-white/5 rounded-2xl px-4 py-2 flex-row items-center border border-white/10">
                                        <Ionicons name="mail-outline" size={14} color="#FFE600" />
                                        <Text className="text-white/80 text-xs font-bold ml-2">{userData.email || 'No Email'}</Text>
                                    </View>
                                    <View className="bg-white/5 rounded-2xl px-4 py-2 flex-row items-center border border-white/10">
                                        <Ionicons name="school-outline" size={14} color="#FFE600" />
                                        <Text className="text-white/80 text-xs font-bold ml-2">{userData.university || 'No Univ'}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View className="px-8 pb-10">
                            <View className="bg-[#FFE600] rounded-[30px] p-6 flex-row justify-between">
                                <View className="items-center flex-1">
                                    <Text className="text-black font-black text-2xl">{userData.gigs_completed}</Text>
                                    <Text className="text-black/40 font-bold text-[10px] uppercase tracking-widest mt-1">Gigs</Text>
                                </View>
                                <View className="w-[1px] bg-black/10 h-10 self-center" />
                                <View className="items-center flex-1">
                                    <Text className="text-black font-black text-2xl">₹{userData.total_earnings}</Text>
                                    <Text className="text-black/40 font-bold text-[10px] uppercase tracking-widest mt-1">Earned</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
