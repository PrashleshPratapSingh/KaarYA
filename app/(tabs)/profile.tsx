import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, Modal, Switch, Pressable, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather, MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

export default function ProfileScreen() {
    const [showSettings, setShowSettings] = useState(false);
    const [showPlayerCard, setShowPlayerCard] = useState(false);
    const [showShareCard, setShowShareCard] = useState(false);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [showEditStash, setShowEditStash] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState<'neon' | 'brutalist' | 'minimal'>('brutalist');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [ghostMode, setGhostMode] = useState(false);

    // Skill management state
    const [activeSkills, setActiveSkills] = useState([
        { id: '1', name: 'Poster Design', color: '#FF69B4', vouches: 12, verified: true, highDemand: true },
        { id: '2', name: 'Typography', color: '#BFFF00', vouches: 8, verified: true, highDemand: false },
        { id: '3', name: 'Figma', color: '#87CEEB', vouches: 0, verified: true, highDemand: true },
        { id: '4', name: 'Motion', color: '#FFFFFF', vouches: 5, verified: true, highDemand: false },
    ]);
    const [inactiveSkills, setInactiveSkills] = useState([
        { id: '5', name: 'Video Editing', color: '#DDA0DD', vouches: 0, verified: false, highDemand: true },
        { id: '6', name: 'Photography', color: '#FFB6C1', vouches: 0, verified: false, highDemand: false },
        { id: '7', name: 'Illustration', color: '#98FB98', vouches: 3, verified: true, highDemand: false },
    ]);
    const [vibeTags, setVibeTags] = useState([
        { id: '1', name: 'Quick Responder', active: true },
        { id: '2', name: 'Creative', active: true },
        { id: '3', name: 'Detail-Oriented', active: false },
        { id: '4', name: 'Team Player', active: false },
    ]);
    const [showVouchRequest, setShowVouchRequest] = useState(false);
    const [showChallenge, setShowChallenge] = useState(false);
    const [processingAI, setProcessingAI] = useState(false);

    return (
        <View className="flex-1 bg-[#0D0D0D]">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {/* Premium Header */}
                <LinearGradient
                    colors={['#FFD700', '#FFC000', '#FFB000']}
                    className="pt-12 pb-8 px-5"
                >
                    <View className="flex-row items-center justify-between">
                        <TouchableOpacity className="w-11 h-11 rounded-full bg-black/20 items-center justify-center">
                            <Ionicons name="arrow-back" size={22} color="black" />
                        </TouchableOpacity>

                        <Text className="text-black font-black text-lg tracking-wider">IDENTITY</Text>

                        <TouchableOpacity
                            className="w-11 h-11 rounded-full bg-black items-center justify-center"
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                setShowSettings(true);
                            }}
                        >
                            <Ionicons name="settings-sharp" size={20} color="#FFD700" />
                        </TouchableOpacity>
                    </View>

                    {/* Avatar & Name */}
                    <View className="items-center mt-6">
                        <View className="relative">
                            {/* Glow Ring */}
                            <View className="absolute -inset-1 rounded-full bg-black/30" />
                            <View className="w-32 h-32 rounded-full border-4 border-black overflow-hidden">
                                <Image
                                    source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            </View>
                            {/* Verified Badge */}
                            <View className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-black items-center justify-center border-4 border-[#FFD700]">
                                <Ionicons name="checkmark" size={18} color="#FFD700" />
                            </View>
                        </View>

                        <Text className="text-black font-black text-3xl mt-4 tracking-tight">ARIA SINGH</Text>
                        <Text className="text-black/60 font-semibold text-sm mt-1">@ariadesigns</Text>
                    </View>
                </LinearGradient>

                {/* Stats Cards */}
                <View className="px-5 -mt-6">
                    <View className="flex-row gap-3">
                        {/* Level Card */}
                        <TouchableOpacity
                            className="flex-1 bg-[#1A1A1A] rounded-3xl p-5 border border-[#333]"
                            onPress={() => {
                                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                setShowLevelUp(true);
                            }}
                            activeOpacity={0.8}
                        >
                            <View className="flex-row items-center justify-between">
                                <View className="w-12 h-12 rounded-2xl bg-[#FFD700]/20 items-center justify-center">
                                    <FontAwesome5 name="crown" size={22} color="#FFD700" />
                                </View>
                                <View className="bg-[#FFD700] px-2.5 py-1 rounded-lg">
                                    <Text className="text-black font-black text-[10px]">MASTER</Text>
                                </View>
                            </View>
                            <Text className="text-white font-black text-4xl mt-4">42</Text>
                            <Text className="text-white/40 font-semibold text-xs mt-1">LEVEL</Text>

                            {/* XP Progress */}
                            <View className="mt-3">
                                <View className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <View className="w-[85%] h-full bg-[#FFD700] rounded-full" />
                                </View>
                                <Text className="text-white/30 text-[10px] mt-1">850/1000 XP</Text>
                            </View>
                        </TouchableOpacity>

                        {/* Earnings Card */}
                        <TouchableOpacity
                            className="flex-1 bg-[#BFFF00] rounded-3xl p-5"
                            onPress={() => {
                                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                setShowStats(true);
                            }}
                            activeOpacity={0.8}
                        >
                            <View className="flex-row items-center justify-between">
                                <View className="w-12 h-12 rounded-2xl bg-black/10 items-center justify-center">
                                    <MaterialCommunityIcons name="wallet" size={24} color="black" />
                                </View>
                                <View className="bg-black px-2.5 py-1 rounded-lg">
                                    <Text className="text-[#BFFF00] font-black text-[10px]">+27%</Text>
                                </View>
                            </View>
                            <Text className="text-black font-black text-4xl mt-4">₹85K</Text>
                            <Text className="text-black/40 font-semibold text-xs mt-1">TOTAL EARNED</Text>

                            {/* Recent Activity */}
                            <View className="flex-row items-center gap-1 mt-3">
                                <Ionicons name="trending-up" size={14} color="black" />
                                <Text className="text-black/60 text-[10px] font-medium">₹12.5K this month</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Achievement Badges Row */}
                <View className="px-5 mt-6">
                    <View className="flex-row gap-2">
                        <View className="flex-1 bg-[#1A1A1A] rounded-2xl p-4 flex-row items-center gap-3">
                            <View className="w-10 h-10 rounded-xl bg-[#FF6B6B]/20 items-center justify-center">
                                <Ionicons name="flame" size={20} color="#FF6B6B" />
                            </View>
                            <View>
                                <Text className="text-white font-bold text-lg">47</Text>
                                <Text className="text-white/40 text-[10px]">GIGS DONE</Text>
                            </View>
                        </View>
                        <View className="flex-1 bg-[#1A1A1A] rounded-2xl p-4 flex-row items-center gap-3">
                            <View className="w-10 h-10 rounded-xl bg-[#4ECDC4]/20 items-center justify-center">
                                <Ionicons name="star" size={20} color="#4ECDC4" />
                            </View>
                            <View>
                                <Text className="text-white font-bold text-lg">4.9</Text>
                                <Text className="text-white/40 text-[10px]">RATING</Text>
                            </View>
                        </View>
                        <View className="flex-1 bg-[#1A1A1A] rounded-2xl p-4 flex-row items-center gap-3">
                            <View className="w-10 h-10 rounded-xl bg-[#A78BFA]/20 items-center justify-center">
                                <Ionicons name="heart" size={20} color="#A78BFA" />
                            </View>
                            <View>
                                <Text className="text-white font-bold text-lg">96%</Text>
                                <Text className="text-white/40 text-[10px]">REPEAT</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Skill Arsenal */}
                <View className="mt-8 px-5">
                    <View className="flex-row justify-between items-center mb-4">
                        <View className="flex-row items-center gap-2">
                            <Ionicons name="flash" size={18} color="#FFD700" />
                            <Text className="text-white font-bold text-base">SKILL ARSENAL</Text>
                        </View>
                        <TouchableOpacity
                            className="bg-[#1A1A1A] px-3 py-1.5 rounded-lg flex-row items-center gap-1"
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                setShowEditStash(true);
                            }}
                        >
                            <Ionicons name="settings-outline" size={14} color="#FFD700" />
                            <Text className="text-[#FFD700] text-xs font-semibold">Edit</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Skills Grid */}
                    <View className="flex-row flex-wrap gap-2">
                        {activeSkills.slice(0, 4).map((skill, index) => (
                            <View
                                key={skill.id}
                                className="relative"
                            >
                                <View
                                    className="px-4 py-2.5 rounded-2xl border border-white/20 flex-row items-center gap-2"
                                    style={{ backgroundColor: skill.color + '30' }}
                                >
                                    {index === 0 && <Ionicons name="trophy" size={14} color={skill.color} />}
                                    <Text className="font-semibold text-sm" style={{ color: skill.color }}>{skill.name}</Text>
                                </View>
                                {skill.vouches > 0 && (
                                    <View className="absolute -top-2 -right-2 bg-[#BFFF00] px-1.5 py-0.5 rounded-md">
                                        <Text className="text-black text-[10px] font-bold">+{skill.vouches}</Text>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                </View>

                {/* Premium Player Card */}
                <View className="mt-8 px-5">
                    <View className="flex-row items-center gap-2 mb-4">
                        <MaterialCommunityIcons name="card-account-details" size={18} color="#FFD700" />
                        <Text className="text-white font-bold text-base">PLAYER CARD</Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            setShowPlayerCard(true);
                        }}
                        activeOpacity={0.9}
                    >
                        <LinearGradient
                            colors={['#1A1A1A', '#0D0D0D', '#1A1A1A']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="rounded-3xl border border-[#333] overflow-hidden"
                        >
                            {/* Holographic Strip */}
                            <LinearGradient
                                colors={['#FFD700', '#FF6B6B', '#4ECDC4', '#A78BFA', '#FFD700']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                className="h-1.5"
                            />

                            <View className="p-5">
                                {/* Card Header */}
                                <View className="flex-row justify-between items-start">
                                    <View>
                                        <Text className="text-[#FFD700] font-black text-2xl tracking-wider">KAARYA</Text>
                                        <Text className="text-white/30 text-xs mt-0.5">ELITE HUSTLER CARD</Text>
                                    </View>
                                    <View className="bg-[#FFD700] px-3 py-1.5 rounded-lg">
                                        <Text className="text-black font-black text-xs">GEN-Z</Text>
                                    </View>
                                </View>

                                {/* Card Body */}
                                <View className="flex-row items-end justify-between mt-8">
                                    <View>
                                        <Text className="text-white/40 text-xs">HOLDER</Text>
                                        <Text className="text-white font-bold text-lg">Aria Singh</Text>
                                        <View className="flex-row items-center gap-1 mt-2">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <Ionicons
                                                    key={i}
                                                    name={i <= 4 ? "star" : "star-half"}
                                                    size={14}
                                                    color="#FFD700"
                                                />
                                            ))}
                                        </View>
                                    </View>
                                    <View className="items-end">
                                        <Text className="text-white/40 text-xs">WIZARD SCORE</Text>
                                        <Text className="text-[#FFD700] font-black text-5xl">94</Text>
                                    </View>
                                </View>

                                {/* Mini Stats */}
                                <View className="flex-row gap-4 mt-6 pt-4 border-t border-white/10">
                                    <View className="flex-1">
                                        <Text className="text-white/30 text-[10px]">ON-TIME</Text>
                                        <Text className="text-white font-bold">98%</Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-white/30 text-[10px]">QUALITY</Text>
                                        <Text className="text-white font-bold">96%</Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-white/30 text-[10px]">RESPONSE</Text>
                                        <Text className="text-white font-bold">&lt;2h</Text>
                                    </View>
                                </View>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>

                    <Text className="text-center text-white/30 text-xs mt-2">Tap to view full profile</Text>
                </View>

                {/* Action Buttons */}
                <View className="px-5 mt-8 gap-3">
                    <TouchableOpacity
                        className="bg-[#FFD700] rounded-2xl py-4 flex-row items-center justify-center gap-2"
                        onPress={() => {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            setShowShareCard(true);
                            setIsGenerating(true);
                            setTimeout(() => setIsGenerating(false), 500);
                        }}
                    >
                        <Feather name="share-2" size={20} color="black" />
                        <Text className="text-black font-black text-base">SHARE MY CARD</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Settings Modal */}
            <Modal
                visible={showSettings}
                transparent
                animationType="fade"
                onRequestClose={() => setShowSettings(false)}
            >
                <View className="flex-1 bg-black/90 justify-end">
                    <Pressable
                        className="absolute inset-0"
                        onPress={() => setShowSettings(false)}
                    />

                    {/* Settings Sheet */}
                    <View className="bg-[#1A1A1A] rounded-t-[32px] px-5 pt-4 pb-10 max-h-[90%]">
                        {/* Handle */}
                        <View className="w-12 h-1.5 bg-[#333] rounded-full self-center mb-6" />

                        {/* Header */}
                        <View className="flex-row justify-between items-center mb-6">
                            <View>
                                <Text className="text-white font-black text-2xl">Settings</Text>
                                <Text className="text-white/40 text-sm">Manage your identity</Text>
                            </View>
                            <TouchableOpacity
                                className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
                                onPress={() => setShowSettings(false)}
                            >
                                <Ionicons name="close" size={22} color="white" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Quick Actions */}
                            <View className="flex-row gap-3 mb-6">
                                <TouchableOpacity className="flex-1 bg-[#FFD700] rounded-2xl p-4 items-center">
                                    <View className="w-12 h-12 rounded-2xl bg-black/20 items-center justify-center mb-2">
                                        <MaterialCommunityIcons name="bank" size={24} color="black" />
                                    </View>
                                    <Text className="text-black font-bold text-sm">Bank</Text>
                                    <Text className="text-black/60 text-[10px]">₹85K Balance</Text>
                                </TouchableOpacity>

                                <TouchableOpacity className="flex-1 bg-[#4ECDC4] rounded-2xl p-4 items-center">
                                    <View className="w-12 h-12 rounded-2xl bg-black/20 items-center justify-center mb-2">
                                        <MaterialIcons name="verified-user" size={24} color="black" />
                                    </View>
                                    <Text className="text-black font-bold text-sm">Verified</Text>
                                    <Text className="text-black/60 text-[10px]">Student ID</Text>
                                </TouchableOpacity>

                                <TouchableOpacity className="flex-1 bg-[#A78BFA] rounded-2xl p-4 items-center">
                                    <View className="w-12 h-12 rounded-2xl bg-black/20 items-center justify-center mb-2">
                                        <MaterialIcons name="security" size={24} color="black" />
                                    </View>
                                    <Text className="text-black font-bold text-sm">Safety</Text>
                                    <Text className="text-black/60 text-[10px]">Protected</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Ghost Mode Toggle */}
                            <View className="bg-[#0D0D0D] rounded-2xl p-5 mb-6">
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-row items-center gap-4">
                                        <View className="w-14 h-14 rounded-2xl bg-[#333] items-center justify-center">
                                            <MaterialCommunityIcons name="ghost" size={28} color={ghostMode ? "#FFD700" : "#666"} />
                                        </View>
                                        <View>
                                            <Text className="text-white font-bold text-base">Ghost Mode</Text>
                                            <Text className="text-white/40 text-sm">Hide from location map</Text>
                                        </View>
                                    </View>
                                    <Switch
                                        value={ghostMode}
                                        onValueChange={(val) => {
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                            setGhostMode(val);
                                        }}
                                        trackColor={{ false: '#333', true: '#FFD700' }}
                                        thumbColor={ghostMode ? 'black' : '#666'}
                                    />
                                </View>
                            </View>

                            {/* Menu Items */}
                            <View className="bg-[#0D0D0D] rounded-2xl overflow-hidden mb-6">
                                <TouchableOpacity className="flex-row items-center p-4 border-b border-[#1A1A1A]">
                                    <View className="w-10 h-10 rounded-xl bg-[#FF6B6B]/20 items-center justify-center">
                                        <Ionicons name="notifications" size={20} color="#FF6B6B" />
                                    </View>
                                    <Text className="text-white font-medium text-base ml-4 flex-1">Notifications</Text>
                                    <View className="bg-[#FF6B6B] px-2 py-0.5 rounded-full mr-2">
                                        <Text className="text-white text-xs font-bold">3</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color="#666" />
                                </TouchableOpacity>

                                <TouchableOpacity className="flex-row items-center p-4 border-b border-[#1A1A1A]">
                                    <View className="w-10 h-10 rounded-xl bg-[#4ECDC4]/20 items-center justify-center">
                                        <Ionicons name="shield-checkmark" size={20} color="#4ECDC4" />
                                    </View>
                                    <Text className="text-white font-medium text-base ml-4 flex-1">Privacy & Data</Text>
                                    <Ionicons name="chevron-forward" size={18} color="#666" />
                                </TouchableOpacity>

                                <TouchableOpacity className="flex-row items-center p-4 border-b border-[#1A1A1A]">
                                    <View className="w-10 h-10 rounded-xl bg-[#FFD700]/20 items-center justify-center">
                                        <Ionicons name="help-buoy" size={20} color="#FFD700" />
                                    </View>
                                    <Text className="text-white font-medium text-base ml-4 flex-1">Help & Support</Text>
                                    <Ionicons name="chevron-forward" size={18} color="#666" />
                                </TouchableOpacity>

                                <TouchableOpacity className="flex-row items-center p-4">
                                    <View className="w-10 h-10 rounded-xl bg-[#A78BFA]/20 items-center justify-center">
                                        <Ionicons name="document-text" size={20} color="#A78BFA" />
                                    </View>
                                    <Text className="text-white font-medium text-base ml-4 flex-1">Terms & Conditions</Text>
                                    <Ionicons name="chevron-forward" size={18} color="#666" />
                                </TouchableOpacity>
                            </View>

                            {/* Log Out */}
                            <TouchableOpacity className="bg-[#FF4444]/10 rounded-2xl py-4 flex-row items-center justify-center gap-2">
                                <Ionicons name="log-out" size={20} color="#FF4444" />
                                <Text className="text-[#FF4444] font-bold text-base">Log Out</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Player Card Detail Modal */}
            <Modal
                visible={showPlayerCard}
                transparent
                animationType="fade"
                onRequestClose={() => setShowPlayerCard(false)}
            >
                <View className="flex-1 bg-black/95 justify-center px-5">
                    <View className="bg-[#1A1A1A] rounded-3xl overflow-hidden border border-[#333]">
                        {/* Card Header with Holographic Strip */}
                        <LinearGradient
                            colors={['#FFD700', '#FF6B6B', '#4ECDC4', '#A78BFA', '#FFD700']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className="h-2"
                        />

                        <View className="p-5">
                            <View className="flex-row justify-between items-start">
                                <View>
                                    <Text className="text-[#FFD700] font-black text-2xl tracking-wider">KAARYA</Text>
                                    <Text className="text-white/40 text-sm mt-1">ARIA SINGH</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => setShowPlayerCard(false)}
                                    className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
                                >
                                    <Ionicons name="close" size={22} color="white" />
                                </TouchableOpacity>
                            </View>

                            <View className="flex-row justify-between items-end mt-4">
                                <View className="bg-[#FFD700] rounded-lg px-3 py-1.5">
                                    <Text className="text-black font-black text-xs">GEN-Z ELITE</Text>
                                </View>
                                <View className="items-end">
                                    <Text className="text-[#FFD700] font-black text-5xl">94</Text>
                                    <Text className="text-white/40 text-xs">WIZARD SCORE</Text>
                                </View>
                            </View>
                        </View>

                        {/* Wizard Score Breakdown */}
                        <View className="px-5 pb-5">
                            <Text className="text-white font-bold text-base mb-4">⚡ Score Breakdown</Text>

                            <View className="gap-4">
                                {/* Punctuality */}
                                <View className="flex-row items-center">
                                    <View className="w-12 h-12 rounded-2xl bg-[#4ECDC4]/20 items-center justify-center">
                                        <Ionicons name="time" size={22} color="#4ECDC4" />
                                    </View>
                                    <View className="flex-1 ml-4">
                                        <View className="flex-row justify-between items-center">
                                            <Text className="text-white font-semibold text-sm">Punctuality</Text>
                                            <Text className="text-[#4ECDC4] font-bold text-sm">98%</Text>
                                        </View>
                                        <View className="h-2 bg-white/10 rounded-full overflow-hidden mt-2">
                                            <View className="w-[98%] h-full bg-[#4ECDC4] rounded-full" />
                                        </View>
                                    </View>
                                </View>

                                {/* Quality */}
                                <View className="flex-row items-center">
                                    <View className="w-12 h-12 rounded-2xl bg-[#A78BFA]/20 items-center justify-center">
                                        <Ionicons name="diamond" size={22} color="#A78BFA" />
                                    </View>
                                    <View className="flex-1 ml-4">
                                        <View className="flex-row justify-between items-center">
                                            <Text className="text-white font-semibold text-sm">Quality</Text>
                                            <Text className="text-[#A78BFA] font-bold text-sm">96%</Text>
                                        </View>
                                        <View className="h-2 bg-white/10 rounded-full overflow-hidden mt-2">
                                            <View className="w-[96%] h-full bg-[#A78BFA] rounded-full" />
                                        </View>
                                    </View>
                                </View>

                                {/* Communication */}
                                <View className="flex-row items-center">
                                    <View className="w-12 h-12 rounded-2xl bg-[#FF6B6B]/20 items-center justify-center">
                                        <Ionicons name="chatbubbles" size={22} color="#FF6B6B" />
                                    </View>
                                    <View className="flex-1 ml-4">
                                        <View className="flex-row justify-between items-center">
                                            <Text className="text-white font-semibold text-sm">Communication</Text>
                                            <Text className="text-[#FF6B6B] font-bold text-sm">92%</Text>
                                        </View>
                                        <View className="h-2 bg-white/10 rounded-full overflow-hidden mt-2">
                                            <View className="w-[92%] h-full bg-[#FF6B6B] rounded-full" />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Divider */}
                        <View className="h-px bg-white/10 mx-5" />

                        {/* Vouch Gallery */}
                        <View className="p-5">
                            <Text className="text-white font-bold text-base mb-4">🤝 Top Vouches</Text>

                            <View className="gap-2">
                                <View className="flex-row items-center bg-[#0D0D0D] rounded-2xl p-3">
                                    <View className="w-10 h-10 rounded-xl bg-[#FFD700]/20 items-center justify-center">
                                        <Text className="text-[#FFD700] font-bold text-sm">AJ</Text>
                                    </View>
                                    <View className="ml-3 flex-1">
                                        <Text className="text-white font-semibold text-sm">Arjun</Text>
                                        <Text className="text-white/40 text-xs">Vouched for UI Design</Text>
                                    </View>
                                    <View className="bg-[#BFFF00]/20 px-2 py-1 rounded-lg">
                                        <Text className="text-[#BFFF00] text-xs font-bold">+3</Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center bg-[#0D0D0D] rounded-2xl p-3">
                                    <View className="w-10 h-10 rounded-xl bg-[#FF6B6B]/20 items-center justify-center">
                                        <Text className="text-[#FF6B6B] font-bold text-sm">PS</Text>
                                    </View>
                                    <View className="ml-3 flex-1">
                                        <Text className="text-white font-semibold text-sm">Priya</Text>
                                        <Text className="text-white/40 text-xs">Vouched for Typography</Text>
                                    </View>
                                    <View className="bg-[#BFFF00]/20 px-2 py-1 rounded-lg">
                                        <Text className="text-[#BFFF00] text-xs font-bold">+2</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Stats Row */}
                        <View className="flex-row gap-3 px-5 pb-5">
                            <View className="flex-1 bg-[#0D0D0D] rounded-2xl p-4 items-center">
                                <Text className="text-[#FFD700] font-black text-2xl">47</Text>
                                <Text className="text-white/40 text-[10px]">GIGS DONE</Text>
                            </View>
                            <View className="flex-1 bg-[#0D0D0D] rounded-2xl p-4 items-center">
                                <Text className="text-[#4ECDC4] font-black text-2xl">98%</Text>
                                <Text className="text-white/40 text-[10px]">SUCCESS</Text>
                            </View>
                            <View className="flex-1 bg-[#0D0D0D] rounded-2xl p-4 items-center">
                                <Text className="text-[#A78BFA] font-black text-2xl">12</Text>
                                <Text className="text-white/40 text-[10px]">REPEAT</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Share Card Modal */}
            <Modal
                visible={showShareCard}
                transparent
                animationType="fade"
                onRequestClose={() => setShowShareCard(false)}
            >
                <View className="flex-1 bg-black/95 justify-end">
                    <Pressable
                        className="absolute inset-0"
                        onPress={() => setShowShareCard(false)}
                    />

                    <View className="bg-[#1A1A1A] rounded-t-[32px] px-5 pt-4 pb-10">
                        {/* Handle */}
                        <View className="w-12 h-1.5 bg-[#333] rounded-full self-center mb-6" />

                        {/* Header */}
                        <View className="flex-row justify-between items-start mb-6">
                            <View>
                                <Text className="text-white font-black text-2xl">Share Your Flex</Text>
                                <Text className="text-white/40 text-sm">Create a shareable card</Text>
                            </View>
                            <TouchableOpacity
                                className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
                                onPress={() => setShowShareCard(false)}
                            >
                                <Ionicons name="close" size={22} color="white" />
                            </TouchableOpacity>
                        </View>

                        {isGenerating ? (
                            /* Loading State */
                            <View className="items-center py-10">
                                <View className="w-48 h-2 bg-[#333] rounded-full overflow-hidden">
                                    <View className="w-full h-full bg-[#FFD700] animate-pulse rounded-full" />
                                </View>
                                <Text className="text-white/40 text-sm mt-3">Generating Your Flex...</Text>
                            </View>
                        ) : (
                            <>
                                {/* Theme Selection */}
                                <Text className="text-white font-bold text-sm mb-3">Choose Your Vibe</Text>
                                <View className="flex-row gap-3 mb-6">
                                    {/* Neon Hustle */}
                                    <TouchableOpacity
                                        className={`flex-1 rounded-2xl p-3 items-center border-2 ${selectedTheme === 'neon' ? 'border-[#FFD700]' : 'border-transparent'}`}
                                        style={{ backgroundColor: '#0D0D0D' }}
                                        onPress={() => setSelectedTheme('neon')}
                                    >
                                        <LinearGradient
                                            colors={['#FF00FF', '#00FFFF']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            className="w-10 h-10 rounded-xl mb-2"
                                        />
                                        <Text className="text-white text-xs font-bold">Neon</Text>
                                    </TouchableOpacity>

                                    {/* Gold */}
                                    <TouchableOpacity
                                        className={`flex-1 rounded-2xl p-3 items-center border-2 ${selectedTheme === 'brutalist' ? 'border-[#FFD700]' : 'border-transparent'}`}
                                        style={{ backgroundColor: '#0D0D0D' }}
                                        onPress={() => setSelectedTheme('brutalist')}
                                    >
                                        <View className="w-10 h-10 rounded-xl mb-2 bg-[#FFD700]" />
                                        <Text className="text-white text-xs font-bold">Gold</Text>
                                    </TouchableOpacity>

                                    {/* Minimal */}
                                    <TouchableOpacity
                                        className={`flex-1 rounded-2xl p-3 items-center border-2 ${selectedTheme === 'minimal' ? 'border-[#FFD700]' : 'border-transparent'}`}
                                        style={{ backgroundColor: '#0D0D0D' }}
                                        onPress={() => setSelectedTheme('minimal')}
                                    >
                                        <View className="w-10 h-10 rounded-xl mb-2 bg-white" />
                                        <Text className="text-white text-xs font-bold">Minimal</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Card Preview */}
                                <View
                                    className="rounded-2xl p-5 mb-6 border"
                                    style={{
                                        backgroundColor: selectedTheme === 'neon' ? '#0a0a0a' : selectedTheme === 'brutalist' ? '#FFD700' : '#ffffff',
                                        borderColor: selectedTheme === 'neon' ? '#333' : selectedTheme === 'brutalist' ? '#FFC000' : '#ddd',
                                    }}
                                >
                                    <View className="flex-row items-center mb-4">
                                        <View className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden border-2" style={{ borderColor: selectedTheme === 'neon' ? '#00FFFF' : '#000' }}>
                                            <Image
                                                source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' }}
                                                className="w-full h-full"
                                                resizeMode="cover"
                                            />
                                        </View>
                                        <View className="ml-3">
                                            <Text className="font-bold text-lg" style={{ color: selectedTheme === 'neon' ? '#fff' : '#000' }}>ARIA SINGH</Text>
                                            <Text className="text-xs" style={{ color: selectedTheme === 'neon' ? '#00FFFF' : '#666' }}>@ARIADESIGNS • Lvl 42</Text>
                                        </View>
                                    </View>

                                    <View className="flex-row justify-between items-center">
                                        <View>
                                            <Text className="font-black text-3xl" style={{ color: selectedTheme === 'neon' ? '#FF00FF' : '#000' }}>94</Text>
                                            <Text className="text-xs" style={{ color: selectedTheme === 'neon' ? '#fff' : '#666' }}>Wizard Score</Text>
                                        </View>
                                        <View className="items-center">
                                            <Text className="font-bold text-lg" style={{ color: selectedTheme === 'neon' ? '#fff' : '#000' }}>₹85k</Text>
                                            <Text className="text-xs" style={{ color: selectedTheme === 'neon' ? '#fff' : '#666' }}>Earned</Text>
                                        </View>
                                        {/* QR Placeholder */}
                                        <View className="w-16 h-16 bg-white rounded-xl items-center justify-center">
                                            <MaterialCommunityIcons name="qrcode" size={40} color="black" />
                                        </View>
                                    </View>

                                    <Text className="text-center text-[10px] mt-4" style={{ color: selectedTheme === 'neon' ? '#666' : '#999' }}>
                                        Scan to view profile on KAARYA
                                    </Text>
                                </View>

                                {/* Share Button */}
                                <TouchableOpacity className="bg-[#FFD700] rounded-2xl py-4 flex-row items-center justify-center gap-2">
                                    <Feather name="share" size={18} color="black" />
                                    <Text className="text-black font-black text-base">Share to Stories</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>

            {/* Level Up Modal */}
            <Modal
                visible={showLevelUp}
                transparent
                animationType="fade"
                onRequestClose={() => setShowLevelUp(false)}
            >
                <View className="flex-1 bg-black/95 justify-end">
                    <Pressable
                        className="absolute inset-0"
                        onPress={() => setShowLevelUp(false)}
                    />

                    <View className="bg-[#1A1A1A] rounded-t-[32px] px-5 pt-4 pb-10 max-h-[90%]">
                        {/* Handle */}
                        <View className="w-12 h-1.5 bg-[#333] rounded-full self-center mb-6" />

                        {/* Header */}
                        <View className="flex-row justify-between items-start mb-6">
                            <View>
                                <Text className="text-white font-black text-2xl">Career Roadmap</Text>
                                <View className="flex-row items-center gap-2 mt-1">
                                    <View className="bg-[#FFD700] px-2 py-0.5 rounded-md">
                                        <Text className="text-black font-bold text-xs">MASTER</Text>
                                    </View>
                                    <Text className="text-white/40 text-sm">Level 42</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
                                onPress={() => setShowLevelUp(false)}
                            >
                                <Ionicons name="close" size={22} color="white" />
                            </TouchableOpacity>
                        </View>

                        {/* XP Progress */}
                        <View className="bg-[#0D0D0D] rounded-2xl p-4 mb-6">
                            <View className="flex-row justify-between items-center mb-3">
                                <View className="flex-row items-center gap-2">
                                    <View className="w-8 h-8 rounded-lg bg-[#FFD700]/20 items-center justify-center">
                                        <FontAwesome5 name="crown" size={14} color="#FFD700" />
                                    </View>
                                    <Text className="text-white font-bold">Level 42</Text>
                                </View>
                                <Text className="text-[#FFD700] font-bold">850 / 1000 XP</Text>
                            </View>
                            <View className="h-3 bg-white/10 rounded-full overflow-hidden">
                                <View className="w-[85%] h-full bg-[#FFD700] rounded-full" />
                            </View>
                            <Text className="text-white/30 text-xs mt-2">150 XP to Level 43</Text>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Skill Tree */}
                            <View className="items-center py-4">
                                {/* Node 1 - Completed */}
                                <View className="items-center">
                                    <View className="w-16 h-16 rounded-full bg-[#4ECDC4] items-center justify-center">
                                        <Ionicons name="checkmark" size={28} color="black" />
                                    </View>
                                    <Text className="text-white font-bold text-sm mt-2">Starter</Text>
                                    <Text className="text-white/30 text-xs">Lvl 1-10</Text>
                                </View>

                                <View className="w-1 h-8 bg-[#4ECDC4]" />

                                {/* Node 2 - Completed */}
                                <View className="items-center">
                                    <View className="w-16 h-16 rounded-full bg-[#A78BFA] items-center justify-center">
                                        <Ionicons name="checkmark" size={28} color="black" />
                                    </View>
                                    <Text className="text-white font-bold text-sm mt-2">Apprentice</Text>
                                    <Text className="text-white/30 text-xs">Lvl 11-25</Text>
                                </View>

                                <View className="w-1 h-8 bg-[#A78BFA]" />

                                {/* Node 3 - Current */}
                                <View className="items-center">
                                    <View className="w-20 h-20 rounded-full bg-[#FFD700] items-center justify-center border-4 border-[#FFD700]/50">
                                        <FontAwesome5 name="crown" size={28} color="black" />
                                    </View>
                                    <Text className="text-white font-bold text-sm mt-2">Master</Text>
                                    <Text className="text-[#FFD700] font-bold text-xs">YOU ARE HERE</Text>
                                </View>

                                <View className="w-1 h-8 bg-[#333]" />

                                {/* Node 4 - Locked */}
                                <View className="items-center opacity-60">
                                    <View className="w-16 h-16 rounded-full bg-[#333] items-center justify-center">
                                        <Ionicons name="lock-closed" size={22} color="#666" />
                                    </View>
                                    <Text className="text-white/40 font-bold text-sm mt-2">Elite</Text>
                                    <Text className="text-white/20 text-xs">Lvl 51-75</Text>
                                </View>

                                <View className="w-1 h-8 bg-[#333]" />

                                {/* Node 5 - Locked */}
                                <View className="items-center opacity-40">
                                    <View className="w-16 h-16 rounded-full bg-[#333] items-center justify-center">
                                        <Ionicons name="lock-closed" size={22} color="#555" />
                                    </View>
                                    <Text className="text-white/30 font-bold text-sm mt-2">Legend</Text>
                                    <Text className="text-white/15 text-xs">Lvl 76-100</Text>
                                </View>
                            </View>

                            {/* Next Unlock */}
                            <View className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-2xl p-4 mt-4">
                                <View className="flex-row items-center gap-2 mb-2">
                                    <Ionicons name="trophy" size={18} color="#FFD700" />
                                    <Text className="text-[#FFD700] font-bold text-sm">Next: Elite Designer</Text>
                                </View>
                                <Text className="text-white/60 text-sm">Complete 3 more Design Bounties</Text>
                                <View className="flex-row items-center mt-3 gap-2">
                                    <View className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                        <View className="w-[66%] h-full bg-[#FFD700] rounded-full" />
                                    </View>
                                    <Text className="text-[#FFD700] font-bold text-sm">6/9</Text>
                                </View>
                            </View>

                            {/* Upcoming Rewards */}
                            <View className="mt-6">
                                <Text className="text-white font-bold text-base mb-4">🎁 Upcoming Rewards</Text>

                                <View className="flex-row gap-3">
                                    <View className="flex-1 bg-[#0D0D0D] rounded-2xl p-4 items-center">
                                        <View className="w-12 h-12 rounded-2xl bg-[#FFD700]/20 items-center justify-center mb-2">
                                            <Ionicons name="ribbon" size={22} color="#FFD700" />
                                        </View>
                                        <Text className="text-white font-semibold text-xs text-center">Elite Badge</Text>
                                        <Text className="text-white/30 text-[10px]">Lvl 45</Text>
                                    </View>

                                    <View className="flex-1 bg-[#0D0D0D] rounded-2xl p-4 items-center">
                                        <View className="w-12 h-12 rounded-2xl bg-[#BFFF00]/20 items-center justify-center mb-2">
                                            <MaterialCommunityIcons name="cash" size={22} color="#BFFF00" />
                                        </View>
                                        <Text className="text-white font-semibold text-xs text-center">₹500 Bonus</Text>
                                        <Text className="text-white/30 text-[10px]">Lvl 50</Text>
                                    </View>

                                    <View className="flex-1 bg-[#0D0D0D] rounded-2xl p-4 items-center">
                                        <View className="w-12 h-12 rounded-2xl bg-[#FF6B6B]/20 items-center justify-center mb-2">
                                            <Ionicons name="star" size={22} color="#FF6B6B" />
                                        </View>
                                        <Text className="text-white font-semibold text-xs text-center">Priority</Text>
                                        <Text className="text-white/30 text-[10px]">Lvl 51</Text>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Stats Analytics Modal */}
            <Modal
                visible={showStats}
                transparent
                animationType="fade"
                onRequestClose={() => setShowStats(false)}
            >
                <View className="flex-1 bg-black/95 justify-end">
                    <Pressable
                        className="absolute inset-0"
                        onPress={() => setShowStats(false)}
                    />

                    <View className="bg-[#1A1A1A] rounded-t-[32px] px-5 pt-4 pb-10 max-h-[90%]">
                        {/* Handle */}
                        <View className="w-12 h-1.5 bg-[#333] rounded-full self-center mb-6" />

                        {/* Header */}
                        <View className="flex-row justify-between items-start mb-6">
                            <View>
                                <Text className="text-white font-black text-2xl">Hustle Stats</Text>
                                <Text className="text-white/40 text-sm">Performance Report</Text>
                            </View>
                            <TouchableOpacity
                                className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
                                onPress={() => setShowStats(false)}
                            >
                                <Ionicons name="close" size={22} color="white" />
                            </TouchableOpacity>
                        </View>

                        {/* Motivation Banner */}
                        <View className="bg-[#FF6B6B]/15 border border-[#FF6B6B]/30 rounded-2xl p-4 mb-6">
                            <View className="flex-row items-center gap-3">
                                <Text className="text-3xl">🔥</Text>
                                <View className="flex-1">
                                    <Text className="text-[#FF6B6B] font-bold text-sm">You're on Fire!</Text>
                                    <Text className="text-white/60 text-sm">Top 5% of Hustlers this week!</Text>
                                </View>
                            </View>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Earnings Overview */}
                            <View className="mb-6">
                                <Text className="text-white font-bold text-base mb-4">💰 Earnings Overview</Text>

                                <View className="flex-row gap-3 mb-4">
                                    <View className="flex-1 bg-[#BFFF00] rounded-2xl p-4">
                                        <Text className="text-black/60 text-xs">This Month</Text>
                                        <Text className="text-black font-black text-2xl">₹12,500</Text>
                                        <Text className="text-black/40 text-xs mt-1">+27% ↑</Text>
                                    </View>
                                    <View className="flex-1 bg-[#0D0D0D] rounded-2xl p-4">
                                        <Text className="text-white/40 text-xs">Last Month</Text>
                                        <Text className="text-white font-bold text-2xl">₹9,800</Text>
                                    </View>
                                </View>

                                {/* Bar Chart */}
                                <View className="bg-[#0D0D0D] rounded-2xl p-4">
                                    <Text className="text-white/40 text-xs mb-4">Last 6 Months</Text>
                                    <View className="flex-row items-end justify-between h-24 gap-2">
                                        <View className="flex-1 items-center">
                                            <View className="w-full bg-[#4ECDC4] rounded-t-md" style={{ height: 40 }} />
                                            <Text className="text-[10px] text-white/30 mt-1">Sep</Text>
                                        </View>
                                        <View className="flex-1 items-center">
                                            <View className="w-full bg-[#A78BFA] rounded-t-md" style={{ height: 55 }} />
                                            <Text className="text-[10px] text-white/30 mt-1">Oct</Text>
                                        </View>
                                        <View className="flex-1 items-center">
                                            <View className="w-full bg-[#4ECDC4] rounded-t-md" style={{ height: 45 }} />
                                            <Text className="text-[10px] text-white/30 mt-1">Nov</Text>
                                        </View>
                                        <View className="flex-1 items-center">
                                            <View className="w-full bg-[#FFD700] rounded-t-md" style={{ height: 70 }} />
                                            <Text className="text-[10px] text-white/30 mt-1">Dec</Text>
                                        </View>
                                        <View className="flex-1 items-center">
                                            <View className="w-full bg-[#A78BFA] rounded-t-md" style={{ height: 60 }} />
                                            <Text className="text-[10px] text-white/30 mt-1">Jan</Text>
                                        </View>
                                        <View className="flex-1 items-center">
                                            <View className="w-full bg-[#BFFF00] rounded-t-md" style={{ height: 80 }} />
                                            <Text className="text-[10px] text-[#BFFF00] font-bold mt-1">Feb</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Activity Heat Map */}
                            <View className="mb-6">
                                <Text className="text-white font-bold text-base mb-2">📅 Activity Heat Map</Text>
                                <Text className="text-white/30 text-xs mb-4">Most active times this week</Text>

                                <View className="bg-[#0D0D0D] rounded-2xl p-4">
                                    <View className="flex-row justify-between mb-2">
                                        <Text className="text-[10px] text-white/30 w-8">Mon</Text>
                                        <View className="flex-1 flex-row gap-1">
                                            <View className="flex-1 h-4 rounded-sm bg-[#333]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#333]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#4ECDC4]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#BFFF00]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#FFD700]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#333]" />
                                        </View>
                                    </View>
                                    <View className="flex-row justify-between mb-2">
                                        <Text className="text-[10px] text-white/30 w-8">Tue</Text>
                                        <View className="flex-1 flex-row gap-1">
                                            <View className="flex-1 h-4 rounded-sm bg-[#333]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#4ECDC4]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#BFFF00]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#BFFF00]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#333]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#333]" />
                                        </View>
                                    </View>
                                    <View className="flex-row justify-between mb-2">
                                        <Text className="text-[10px] text-white/30 w-8">Wed</Text>
                                        <View className="flex-1 flex-row gap-1">
                                            <View className="flex-1 h-4 rounded-sm bg-[#333]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#333]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#FFD700]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#FFD700]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#A78BFA]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#333]" />
                                        </View>
                                    </View>
                                    <View className="flex-row justify-between mb-2">
                                        <Text className="text-[10px] text-white/30 w-8">Thu</Text>
                                        <View className="flex-1 flex-row gap-1">
                                            <View className="flex-1 h-4 rounded-sm bg-[#333]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#BFFF00]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#BFFF00]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#4ECDC4]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#333]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#333]" />
                                        </View>
                                    </View>
                                    <View className="flex-row justify-between mb-2">
                                        <Text className="text-[10px] text-white/30 w-8">Fri</Text>
                                        <View className="flex-1 flex-row gap-1">
                                            <View className="flex-1 h-4 rounded-sm bg-[#333]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#333]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#A78BFA]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#FF6B6B]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#BFFF00]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#BFFF00]" />
                                        </View>
                                    </View>
                                    <View className="flex-row justify-between">
                                        <Text className="text-[10px] text-white/30 w-8"></Text>
                                        <View className="flex-1 flex-row gap-1">
                                            <Text className="flex-1 text-[8px] text-white/20 text-center">9am</Text>
                                            <Text className="flex-1 text-[8px] text-white/20 text-center">12pm</Text>
                                            <Text className="flex-1 text-[8px] text-white/20 text-center">3pm</Text>
                                            <Text className="flex-1 text-[8px] text-white/20 text-center">6pm</Text>
                                            <Text className="flex-1 text-[8px] text-white/20 text-center">9pm</Text>
                                            <Text className="flex-1 text-[8px] text-white/20 text-center">12am</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Quick Stats */}
                            <View className="flex-row gap-3">
                                <View className="flex-1 bg-[#0D0D0D] rounded-2xl p-4 items-center">
                                    <View className="w-12 h-12 rounded-2xl bg-[#FFD700]/20 items-center justify-center mb-2">
                                        <Ionicons name="flash" size={24} color="#FFD700" />
                                    </View>
                                    <Text className="text-white font-bold text-xl">23</Text>
                                    <Text className="text-white/30 text-xs">Gigs This Month</Text>
                                </View>
                                <View className="flex-1 bg-[#0D0D0D] rounded-2xl p-4 items-center">
                                    <View className="w-12 h-12 rounded-2xl bg-[#4ECDC4]/20 items-center justify-center mb-2">
                                        <Ionicons name="time" size={24} color="#4ECDC4" />
                                    </View>
                                    <Text className="text-white font-bold text-xl">2h</Text>
                                    <Text className="text-white/30 text-xs">Avg Response</Text>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Edit Stash Modal */}
            <Modal
                visible={showEditStash}
                animationType="slide"
                onRequestClose={() => setShowEditStash(false)}
            >
                <View className="flex-1 bg-[#FFD700]">
                    {/* Header */}
                    <View className="flex-row items-center justify-between px-5 pt-12 pb-4 bg-black">
                        <TouchableOpacity
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setShowEditStash(false);
                            }}
                            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
                        >
                            <Ionicons name="arrow-back" size={22} color="white" />
                        </TouchableOpacity>
                        <Text className="text-[#FFD700] font-bold text-lg">SKILL ARMORY</Text>
                        <View className="w-10" />
                    </View>

                    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                        {/* Active Skills Section */}
                        <View className="px-5 pt-6">
                            <View className="flex-row items-center gap-2 mb-4">
                                <Ionicons name="flash" size={20} color="black" />
                                <Text className="text-black font-bold text-base">ACTIVE TOKENS</Text>
                                <View className="bg-black px-2 py-0.5 rounded-full ml-auto">
                                    <Text className="text-[#FFD700] text-xs font-bold">{activeSkills.length} Active</Text>
                                </View>
                            </View>

                            <View className="gap-3">
                                {activeSkills.map((skill, index) => (
                                    <TouchableOpacity
                                        key={skill.id}
                                        className="flex-row items-center bg-white border border-black rounded-2xl p-4"
                                        onLongPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
                                        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                                    >
                                        {/* Primary Badge */}
                                        {index < 3 && (
                                            <View className="absolute -top-2 -left-2 bg-black px-2 py-0.5 rounded-full">
                                                <Text className="text-[#FFD700] text-[10px] font-bold">#{index + 1}</Text>
                                            </View>
                                        )}

                                        {/* Drag Handle */}
                                        <View className="mr-3">
                                            <MaterialCommunityIcons name="drag" size={24} color="gray" />
                                        </View>

                                        {/* Skill Token */}
                                        <View
                                            className="rounded-full px-4 py-2 border border-black"
                                            style={{ backgroundColor: skill.color }}
                                        >
                                            {skill.highDemand && (
                                                <View className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#00FF00]" />
                                            )}
                                            <Text className="text-black font-semibold text-sm">{skill.name}</Text>
                                        </View>

                                        {/* Vouch Count */}
                                        {skill.vouches > 0 && (
                                            <View className="bg-[#90EE90] border border-black rounded-full px-2 py-0.5 ml-2">
                                                <Text className="text-black text-xs font-bold">+{skill.vouches}</Text>
                                            </View>
                                        )}

                                        {/* Toggle Switch */}
                                        <View className="ml-auto">
                                            <Switch
                                                value={true}
                                                onValueChange={() => {
                                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                                                    const skill = activeSkills[index];
                                                    setActiveSkills(prev => prev.filter((_, i) => i !== index));
                                                    setInactiveSkills(prev => [...prev, skill]);
                                                }}
                                                trackColor={{ false: '#d1d5db', true: '#000' }}
                                                thumbColor={'#FFD700'}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Inactive / Stashed Skills */}
                        <View className="px-5 pt-6">
                            <View className="flex-row items-center gap-2 mb-4">
                                <Ionicons name="archive" size={20} color="black" />
                                <Text className="text-black font-bold text-base">STASHED TOKENS</Text>
                            </View>

                            <View className="gap-3">
                                {inactiveSkills.map((skill, index) => (
                                    <TouchableOpacity
                                        key={skill.id}
                                        className={`flex-row items-center bg-white/60 border border-black/30 rounded-2xl p-4 ${!skill.verified ? 'opacity-60' : ''}`}
                                        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                                    >
                                        {/* Skill Token */}
                                        <View
                                            className={`rounded-full px-4 py-2 border ${skill.verified ? 'border-black' : 'border-dashed border-gray-400'}`}
                                            style={{ backgroundColor: skill.verified ? skill.color : '#e5e5e5' }}
                                        >
                                            {!skill.verified && (
                                                <Ionicons name="lock-closed" size={12} color="gray" style={{ position: 'absolute', top: -4, right: -4 }} />
                                            )}
                                            {skill.highDemand && skill.verified && (
                                                <View className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#00FF00]" />
                                            )}
                                            <Text className={`font-semibold text-sm ${skill.verified ? 'text-black' : 'text-gray-400'}`}>{skill.name}</Text>
                                        </View>

                                        {/* Verification Status */}
                                        {!skill.verified ? (
                                            <TouchableOpacity
                                                className="bg-black px-3 py-1.5 rounded-lg ml-auto"
                                                onPress={() => {
                                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                                    setShowChallenge(true);
                                                }}
                                            >
                                                <Text className="text-[#FFD700] text-xs font-bold">VERIFY</Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <Switch
                                                value={false}
                                                onValueChange={() => {
                                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                                                    const skill = inactiveSkills[index];
                                                    setInactiveSkills(prev => prev.filter((_, i) => i !== index));
                                                    setActiveSkills(prev => [...prev, skill]);
                                                }}
                                                trackColor={{ false: '#d1d5db', true: '#000' }}
                                                thumbColor={'#fff'}
                                                style={{ marginLeft: 'auto' }}
                                            />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Vibe Tags Section */}
                        <View className="px-5 pt-6">
                            <View className="flex-row items-center gap-2 mb-4">
                                <Ionicons name="sparkles" size={20} color="black" />
                                <Text className="text-black font-bold text-base">VIBE TAGS</Text>
                            </View>

                            <View className="flex-row flex-wrap gap-2">
                                {vibeTags.map((tag, index) => (
                                    <TouchableOpacity
                                        key={tag.id}
                                        className={`px-4 py-2 rounded-full border-2 ${tag.active ? 'bg-black border-black' : 'bg-white border-black'}`}
                                        onPress={() => {
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                            setVibeTags(prev => prev.map((t, i) =>
                                                i === index ? { ...t, active: !t.active } : t
                                            ));
                                        }}
                                    >
                                        <Text className={`font-semibold text-sm ${tag.active ? 'text-[#FFD700]' : 'text-black'}`}>
                                            {tag.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Vouch Manager */}
                        <View className="px-5 pt-6 pb-4">
                            <View className="flex-row items-center gap-2 mb-4">
                                <Ionicons name="people" size={20} color="black" />
                                <Text className="text-black font-bold text-base">VOUCH MANAGER</Text>
                            </View>

                            <TouchableOpacity
                                className="bg-white border-2 border-black rounded-2xl p-4 flex-row items-center"
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                    setShowVouchRequest(true);
                                }}
                            >
                                <View className="w-12 h-12 rounded-xl bg-[#FFD700] items-center justify-center">
                                    <MaterialCommunityIcons name="qrcode" size={28} color="black" />
                                </View>
                                <View className="flex-1 ml-4">
                                    <Text className="text-black font-bold text-base">Request a Vouch</Text>
                                    <Text className="text-black/50 text-sm">Generate link or QR for endorsement</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="black" />
                            </TouchableOpacity>
                        </View>

                        {/* High Demand Legend */}
                        <View className="px-5 pb-6">
                            <View className="flex-row items-center gap-2 bg-black/10 rounded-xl p-3">
                                <View className="w-3 h-3 rounded-full bg-[#00FF00]" />
                                <Text className="text-black/70 text-xs">= High Demand skill on the map right now</Text>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Save & Sync Button */}
                    <View className="px-5 pb-8 pt-4 bg-[#FFD700]">
                        <TouchableOpacity
                            className="bg-black rounded-2xl py-5 flex-row items-center justify-center gap-3"
                            onPress={() => {
                                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                setIsSyncing(true);
                                setTimeout(() => {
                                    setIsSyncing(false);
                                    setShowEditStash(false);
                                }, 2000);
                            }}
                            disabled={isSyncing}
                        >
                            {isSyncing ? (
                                <>
                                    <MaterialCommunityIcons name="cloud-sync" size={24} color="#FFD700" />
                                    <Text className="text-[#FFD700] font-bold text-base">SYNCING TO BLOCKCHAIN...</Text>
                                </>
                            ) : (
                                <>
                                    <MaterialCommunityIcons name="content-save" size={24} color="#FFD700" />
                                    <Text className="text-[#FFD700] font-bold text-base">SAVE & SYNC</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Challenge Modal */}
                <Modal
                    visible={showChallenge}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowChallenge(false)}
                >
                    <View className="flex-1 bg-black/80 justify-center px-5">
                        <View className="bg-white rounded-3xl p-6">
                            {processingAI ? (
                                <View className="items-center py-10">
                                    <View className="w-20 h-20 rounded-full bg-[#FFD700] items-center justify-center mb-4">
                                        <MaterialCommunityIcons name="robot" size={40} color="black" />
                                    </View>
                                    <Text className="text-black font-bold text-lg mb-2">AI Assessment</Text>
                                    <Text className="text-black/50 text-center mb-4">Gemini is analyzing your video...</Text>
                                    <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <View className="w-3/4 h-full bg-[#FFD700] rounded-full" />
                                    </View>
                                </View>
                            ) : (
                                <>
                                    <View className="flex-row justify-between items-start mb-4">
                                        <View className="w-14 h-14 rounded-2xl bg-[#87CEEB] items-center justify-center">
                                            <MaterialCommunityIcons name="video" size={28} color="black" />
                                        </View>
                                        <TouchableOpacity onPress={() => setShowChallenge(false)}>
                                            <Ionicons name="close" size={28} color="black" />
                                        </TouchableOpacity>
                                    </View>

                                    <Text className="text-black font-bold text-xl mb-2">SkillSnap Challenge</Text>
                                    <Text className="text-black/70 text-base mb-6">
                                        Record a 10-second clip of you using <Text className="font-bold">Figma auto-layout</Text> to unlock this token.
                                    </Text>

                                    <View className="bg-[#F5F5F5] rounded-xl p-4 mb-6">
                                        <Text className="text-black font-semibold text-sm mb-2">Requirements:</Text>
                                        <View className="flex-row items-center gap-2 mb-1">
                                            <Ionicons name="checkmark-circle" size={16} color="green" />
                                            <Text className="text-black/70 text-sm">Show your screen with Figma open</Text>
                                        </View>
                                        <View className="flex-row items-center gap-2 mb-1">
                                            <Ionicons name="checkmark-circle" size={16} color="green" />
                                            <Text className="text-black/70 text-sm">Demonstrate auto-layout usage</Text>
                                        </View>
                                        <View className="flex-row items-center gap-2">
                                            <Ionicons name="checkmark-circle" size={16} color="green" />
                                            <Text className="text-black/70 text-sm">Maximum 10 seconds</Text>
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        className="bg-black rounded-2xl py-4 flex-row items-center justify-center gap-2"
                                        onPress={() => {
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                            setProcessingAI(true);
                                            setTimeout(() => {
                                                setProcessingAI(false);
                                                setShowChallenge(false);
                                                // Mark skill as verified
                                                setInactiveSkills(prev => prev.map(s =>
                                                    s.name === 'Video Editing' ? { ...s, verified: true } : s
                                                ));
                                                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                            }, 3000);
                                        }}
                                    >
                                        <Ionicons name="videocam" size={20} color="white" />
                                        <Text className="text-white font-bold text-base">START RECORDING</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>
                </Modal>

                {/* Vouch Request Modal */}
                <Modal
                    visible={showVouchRequest}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowVouchRequest(false)}
                >
                    <View className="flex-1 justify-end">
                        <Pressable
                            className="absolute inset-0 bg-black/60"
                            onPress={() => setShowVouchRequest(false)}
                        />
                        <View className="bg-white rounded-t-3xl px-5 pt-4 pb-10">
                            <View className="w-10 h-1 bg-gray-300 rounded-full self-center mb-4" />

                            <View className="flex-row justify-between items-center mb-6">
                                <Text className="text-2xl font-bold text-black">Request a Vouch</Text>
                                <TouchableOpacity onPress={() => setShowVouchRequest(false)}>
                                    <Ionicons name="close" size={28} color="black" />
                                </TouchableOpacity>
                            </View>

                            {/* QR Code */}
                            <View className="items-center mb-6">
                                <View className="w-48 h-48 bg-white border-2 border-black rounded-2xl items-center justify-center">
                                    <MaterialCommunityIcons name="qrcode" size={120} color="black" />
                                </View>
                                <Text className="text-black/50 text-sm mt-3">Scan to vouch for ARIA SINGH</Text>
                            </View>

                            {/* Share Link */}
                            <View className="flex-row gap-3 mb-6">
                                <View className="flex-1 bg-[#F5F5F5] rounded-xl p-4">
                                    <Text className="text-black/50 text-xs">Share Link</Text>
                                    <Text className="text-black font-medium text-sm" numberOfLines={1}>karya.app/vouch/aria-singh</Text>
                                </View>
                                <TouchableOpacity
                                    className="bg-black rounded-xl px-5 items-center justify-center"
                                    onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                                >
                                    <Feather name="copy" size={20} color="#FFD700" />
                                </TouchableOpacity>
                            </View>

                            {/* Share Buttons */}
                            <View className="flex-row gap-3">
                                <TouchableOpacity className="flex-1 bg-[#25D366] rounded-xl py-3 flex-row items-center justify-center gap-2">
                                    <Ionicons name="logo-whatsapp" size={20} color="white" />
                                    <Text className="text-white font-bold text-sm">WhatsApp</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl py-3 flex-row items-center justify-center gap-2" style={{ backgroundColor: '#E1306C' }}>
                                    <Ionicons name="logo-instagram" size={20} color="white" />
                                    <Text className="text-white font-bold text-sm">Instagram</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </Modal>
        </View>
    );
}
