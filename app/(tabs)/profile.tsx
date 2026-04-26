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

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [userData, setUserData] = useState<UserRow | null>(() => {
        // Initialize with Clerk data to avoid empty state
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

    // Load user data from Firestore
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

    // Scroll animation
    const { scrollY } = useTabBarContext();

    useFocusEffect(
        useCallback(() => {
            scrollY.value = 0;
            return () => {};
        }, [scrollY])
    );

    const curveStyle = useAnimatedStyle(() => {
        const translateY = interpolate(
            scrollY.value,
            [-150, -50, 0, 50],
            [-60, -20, 0, 30],
            Extrapolate.CLAMP
        );
        const scaleX = interpolate(
            scrollY.value,
            [-100, 0],
            [1.3, 1],
            Extrapolate.CLAMP
        );
        return {
            transform: [
                { translateY },
                { scaleX }
            ]
        };
    });

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
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
                {/* Modern Minimal Header */}
                <View className="relative">
                    <LinearGradient
                        colors={['#FFE600', '#FFFDE7']}
                        className="w-full h-64 pt-14 px-5 items-end"
                    >
                        <TouchableOpacity
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                setShowSettings(true);
                            }}
                            className="w-10 h-10 bg-white/50 rounded-full items-center justify-center"
                        >
                            <Ionicons name="settings-outline" size={22} color="black" />
                        </TouchableOpacity>
                    </LinearGradient>

                    {/* Profile Section Overlap */}
                    <View className="px-5 -mt-24">
                        <View className="bg-white rounded-[40px] p-6 shadow-2xl shadow-black/5">
                            <View className="flex-row items-center">
                                <View className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
                                    {userData.avatar_url ? (
                                        <Image
                                            source={{ uri: userData.avatar_url }}
                                            className="w-full h-full"
                                            resizeMode="cover"
                                        />
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
                                        <Text className="text-black/40 font-bold text-xs uppercase tracking-widest">
                                            {userData.university || 'Student'}
                                        </Text>
                                        {userData.is_verified && (
                                            <MaterialIcons name="verified" size={14} color="#FFE600" style={{ marginLeft: 4 }} />
                                        )}
                                    </View>
                                </View>
                            </View>

                            <Text className="text-black/60 mt-5 font-medium leading-5">
                                {userData.bio || 'Building the future of student work at KaarYa.'}
                            </Text>

                            <View className="h-[1px] bg-black/5 my-6" />

                            <View className="flex-row justify-between">
                                <View>
                                    <Text className="text-black font-black text-xl">{userData.gigs_completed}</Text>
                                    <Text className="text-black/30 font-bold text-[10px] uppercase tracking-tighter">Gigs</Text>
                                </View>
                                <View className="items-center">
                                    <Text className="text-black font-black text-xl">{userData.rating_avg.toFixed(1)}</Text>
                                    <Text className="text-black/30 font-bold text-[10px] uppercase tracking-tighter">Rating</Text>
                                </View>
                                <View className="items-end">
                                    <Text className="text-black font-black text-xl">₹{userData.total_earnings}</Text>
                                    <Text className="text-black/30 font-bold text-[10px] uppercase tracking-tighter">Earned</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Identity Pass - Silver & Yellow Edition */}
                <View className="mt-8 px-5">
                    <TouchableOpacity
                        onPress={() => {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            setShowPlayerCard(true);
                        }}
                        activeOpacity={0.9}
                    >
                        {/* Ticket Container */}
                        <View 
                            className="w-full bg-[#F2F2F2] rounded-[30px] overflow-hidden relative border border-black/5"
                            style={{ 
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 10 },
                                shadowOpacity: 0.1,
                                shadowRadius: 15,
                                elevation: 5
                            }}
                        >
                            {/* Main Content */}
                            <View className="flex-row">

                                {/* Left Section - Identity */}
                                <View className="flex-1 p-6 border-r border-dashed border-black/10">
                                    <View className="bg-[#FFE600] self-start px-3 py-1 rounded-full mb-3">
                                        <Text className="text-black font-black text-[10px] tracking-widest uppercase">Identity Pass</Text>
                                    </View>
                                    <Text className="text-black font-black text-3xl tracking-tight leading-none mb-1">
                                        {userData.name ? userData.name.split(' ')[0].toUpperCase() : 'USER'}
                                    </Text>
                                    <Text className="text-black/40 text-xs font-bold">
                                        {userData.email || '@kaarya_user'}
                                    </Text>

                                    <View className="flex-row gap-2 mt-4">
                                        {userData.is_verified && (
                                            <View className="bg-white px-2 py-1 rounded-md border border-black/5">
                                                <Text className="text-black text-[9px] font-bold tracking-tighter uppercase">Verified</Text>
                                            </View>
                                        )}
                                        {userData.university && (
                                            <View className="bg-white px-2 py-1 rounded-md border border-black/5 max-w-[120px]">
                                                <Text numberOfLines={1} className="text-black text-[9px] font-bold tracking-tighter uppercase">{userData.university}</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>

                                {/* Right Section - Score */}
                                <View className="w-28 items-center justify-center py-6">
                                    <View className="items-center justify-center">
                                        <Text className="text-black font-black text-3xl">{userData.rating_avg.toFixed(1)}</Text>
                                    </View>
                                    <Text className="text-black/30 text-[9px] font-bold mt-1 tracking-widest uppercase">Score</Text>
                                </View>
                            </View>

                            {/* Bottom Strip */}
                            <View className="bg-black mx-6 mb-4 rounded-xl px-4 py-3 flex-row justify-between items-center">
                                <View className="flex-row items-center gap-2">
                                    <Ionicons name="finger-print" size={14} color="#FFE600" />
                                    <Text className="text-[#FFE600] text-[11px] font-black tracking-tight">IDENTITY VERIFIED</Text>
                                </View>
                                <View className="flex-row items-center gap-1">
                                    <Text className="text-white/40 text-[10px] font-bold">DETAILS</Text>
                                    <Ionicons name="chevron-forward" size={12} color="white" opacity={0.4} />
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Refined Content Sections */}
                <View className="px-5 mt-10">
                    <Text className="text-black font-black text-lg mb-4 tracking-tight">Skill Set</Text>
                    <View className="flex-row flex-wrap gap-2">
                        {(userData.skills || []).map((skill, index) => (
                            <View 
                                key={index}
                                className="bg-gray-100 rounded-2xl px-4 py-3 flex-row items-center"
                            >
                                <View className="w-1.5 h-1.5 rounded-full bg-[#FFE600] mr-2.5" />
                                <Text className="text-black font-bold text-sm">{skill}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Portfolio / Activity */}
                <View className="px-5 mt-10">
                    <Text className="text-black font-black text-lg mb-4 tracking-tight">Activity</Text>
                    <TouchableOpacity 
                        className="bg-white border border-gray-100 rounded-[30px] p-5 flex-row items-center justify-between"
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            router.push({
                                pathname: '/my-work',
                                params: { tab: 'stash' }
                            });
                        }}
                    >
                        <View className="flex-row items-center">
                            <View className="w-12 h-12 bg-[#FFE600] rounded-2xl items-center justify-center">
                                <Feather name="folder" size={20} color="black" />
                            </View>
                            <View className="ml-4">
                                <Text className="text-black font-bold text-base">Your Stash</Text>
                                <Text className="text-black/40 text-xs font-medium">View completed projects</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="black" opacity={0.2} />
                    </TouchableOpacity>
                </View>

            </Animated.ScrollView>

            {/* Settings Modal */}
            <Modal
                visible={showSettings}
                transparent
                animationType="fade"
                onRequestClose={() => setShowSettings(false)}
            >
                <View className="flex-1 bg-black/40 justify-end">
                    <Pressable className="absolute inset-0" onPress={() => setShowSettings(false)} />
                    <View className="bg-white rounded-t-[50px] p-8">
                        <View className="w-12 h-1 bg-gray-100 rounded-full self-center mb-8" />
                        
                        <TouchableOpacity 
                            onPress={() => {
                                logout();
                                setShowSettings(false);
                            }}
                            className="bg-[#FFE600] rounded-3xl py-5 items-center justify-center"
                        >
                            <Text className="text-black font-black text-lg">LOG OUT</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => setShowSettings(false)}
                            className="mt-4 py-4 items-center"
                        >
                            <Text className="text-black/30 font-bold">CANCEL</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Player Card Detail Modal - "Exclusive Reveal" Version */}
            <Modal
                visible={showPlayerCard}
                transparent
                animationType="fade"
                onRequestClose={() => setShowPlayerCard(false)}
            >
                <View className="flex-1 bg-black/95 justify-center px-5">
                    <View className="bg-black rounded-[40px] overflow-hidden border-2 border-[#FFE600] shadow-2xl">
                        
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
                                    <Text className="text-white font-black text-6xl tracking-tighter">{userData.rating_avg.toFixed(1)}</Text>
                                    <Text className="text-[#FFE600]/40 font-bold text-xs uppercase tracking-widest">Score</Text>
                                </View>
                            </View>

                            {/* User Details */}
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

                        {/* Breakdown */}
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
