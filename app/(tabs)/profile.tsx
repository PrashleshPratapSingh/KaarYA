import { useState, useRef, useCallback } from "react";
import { View, Text, TouchableOpacity, Image, Modal, Switch, Pressable, ScrollView } from "react-native";
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, interpolate, Extrapolate } from "react-native-reanimated";
import { useTabBarContext } from '../../app/context/TabBarContext';
import { useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather, MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
// Removed unused ReAnimated import since we are using 'Animated' from 'react-native-reanimated' above
// import ReAnimated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, withDelay, Easing } from "react-native-reanimated";

export default function ProfileScreen() {
    const [showSettings, setShowSettings] = useState(false);
    const [showPlayerCard, setShowPlayerCard] = useState(false);
    const [showShareCard, setShowShareCard] = useState(false);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [showRating, setShowRating] = useState(false);
    const [showEditStash, setShowEditStash] = useState(false);
    const [showSkills, setShowSkills] = useState(false);
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

    // Settings sub-screens
    const [showBank, setShowBank] = useState(false);
    const [showVerified, setShowVerified] = useState(false);
    const [showSafety, setShowSafety] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [showTerms, setShowTerms] = useState(false);

    // Scroll animation
    const { scrollY } = useTabBarContext();

    useFocusEffect(
        useCallback(() => {
            // Reset scrollY to 0 when screen is focused to ensure tab bar is visible
            scrollY.value = 0;
        }, [])
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

    // Removed screenAnimatedStyle logic for simplicity as it was creating duplicate ReAnimated imports/logic


    return (
        <View className="flex-1 bg-[#FFE600]">
            <Animated.ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
            >
                {/* Header - Black Top, Yellow Curve Bottom */}
                <View className="relative mb-4">

                    {/* Black Top Section */}
                    <View className="w-full bg-black pt-14 pb-32 relative">

                        {/* Settings Button */}
                        <TouchableOpacity
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                setShowSettings(true);
                            }}
                            className="absolute top-14 right-5 z-50 w-9 h-9 items-center justify-center"
                        >
                            <Ionicons name="ellipsis-horizontal" size={22} color="white" />
                        </TouchableOpacity>

                        {/* Yellow Curve Coming Up from Bottom */}
                        <Animated.View
                            className="absolute bottom-0 left-0 right-0 h-28 bg-[#FFE600] rounded-t-[100px]"
                            style={curveStyle}
                        />

                    </View>

                    {/* Profile Picture */}
                    <View className="items-center -mt-20 relative z-20">
                        <View className="w-32 h-32 rounded-full border-[5px] border-white bg-white shadow-2xl overflow-hidden">
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' }}
                                className="w-full h-full rounded-full"
                                resizeMode="cover"
                            />
                        </View>
                    </View>

                    {/* Name & Title - On Yellow Background */}
                    <View className="items-center mt-4 px-5 pb-6 bg-[#FFE600]">
                        <Text className="text-black font-bold text-2xl">Aria Singh</Text>
                        <Text className="text-black/60 text-sm mt-1">UX/UI designer, Web-designer</Text>
                    </View>

                </View>

                {/* Quick Stats - Minimal Icon-Based Design */}
                <View className="px-5 mt-10">

                    {/* Primary Stats Row - Clean Horizontal Layout */}
                    <View className="flex-row gap-3 mb-4">

                        {/* XP Progress Circle */}
                        <TouchableOpacity
                            className="flex-1 bg-black rounded-2xl p-4 items-center justify-center"
                            onPress={() => setShowLevelUp(true)}
                            style={{ shadowColor: "#000", shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 }}
                        >
                            <View className="w-14 h-14 rounded-full border-[3px] border-[#FFE600] items-center justify-center mb-2">
                                <Text className="text-[#FFE600] font-black text-lg">42</Text>
                            </View>
                            <Text className="text-white/60 text-[10px] font-bold tracking-widest">LEVEL</Text>
                        </TouchableOpacity>

                        {/* Wallet / Earnings */}
                        <TouchableOpacity
                            className="flex-1 bg-black rounded-2xl p-4 items-center justify-center"
                            onPress={() => setShowStats(true)}
                            style={{ shadowColor: "#000", shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 }}
                        >
                            <View className="w-14 h-14 rounded-full bg-[#FFE600] items-center justify-center mb-2">
                                <MaterialCommunityIcons name="wallet" size={24} color="black" />
                            </View>
                            <Text className="text-white/60 text-[10px] font-bold tracking-widest">WALLET</Text>
                        </TouchableOpacity>

                        {/* Rating Star */}
                        <TouchableOpacity
                            className="flex-1 bg-black rounded-2xl p-4 items-center justify-center"
                            onPress={() => setShowRating(true)}
                            style={{ shadowColor: "#000", shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 }}
                        >
                            <View className="w-14 h-14 rounded-full border-[3px] border-white/30 items-center justify-center mb-2">
                                <Text className="text-white font-black text-lg">4.9</Text>
                            </View>
                            <Text className="text-white/60 text-[10px] font-bold tracking-widest">RATING</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Secondary Stats - Compact Pill Style */}
                    <View className="flex-row gap-2">
                        <View className="flex-1 bg-white/90 rounded-xl py-3 px-4 flex-row items-center justify-center gap-2 border border-black/10">
                            <Ionicons name="briefcase" size={16} color="black" />
                            <Text className="text-black font-bold text-sm">47 Gigs</Text>
                        </View>
                        <View className="flex-1 bg-white/90 rounded-xl py-3 px-4 flex-row items-center justify-center gap-2 border border-black/10">
                            <Ionicons name="repeat" size={16} color="black" />
                            <Text className="text-black font-bold text-sm">96% Repeat</Text>
                        </View>
                    </View>

                </View>

                {/* Collapsible Skill Arsenal */}
                <View className="mt-10 px-5">
                    <TouchableOpacity
                        className="bg-black rounded-2xl p-5 items-center justify-center"
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setShowSkills(!showSkills);
                        }}
                    >
                        <Text className="text-white font-black text-lg tracking-wider">SKILL ARSENAL</Text>
                    </TouchableOpacity>

                    {/* Expanded Skills */}
                    {showSkills && (
                        <View className="mt-3 flex-row flex-wrap gap-2">
                            {activeSkills.map((skill, index) => (
                                <View
                                    key={skill.id}
                                    className="px-4 py-3 rounded-xl bg-white border-2 border-black flex-row items-center gap-2"
                                >
                                    {index === 0 && <Ionicons name="trophy" size={14} color="black" />}
                                    <Text className="font-bold text-sm text-black">{skill.name}</Text>
                                    {skill.vouches > 0 && (
                                        <View className="bg-black px-1.5 py-0.5 rounded-md ml-1">
                                            <Text className="text-[#FFE600] text-[10px] font-bold">+{skill.vouches}</Text>
                                        </View>
                                    )}
                                </View>
                            ))}
                            <TouchableOpacity
                                className="px-4 py-3 rounded-xl bg-transparent border-2 border-black border-dashed flex-row items-center gap-2"
                                onPress={() => setShowEditStash(true)}
                            >
                                <Ionicons name="add" size={16} color="black" />
                                <Text className="font-bold text-sm text-black">Edit Skills</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Identity Pass - Premium Ticket Style */}
                <View className="mt-10 px-5">
                    <TouchableOpacity
                        onPress={() => {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            setShowPlayerCard(true);
                        }}
                        activeOpacity={0.95}
                    >
                        {/* Ticket Container */}
                        <View className="w-full bg-[#0A0A0A] rounded-2xl overflow-hidden relative">

                            {/* Main Content */}
                            <View className="flex-row">

                                {/* Left Section - Identity */}
                                <View className="flex-1 p-4 border-r border-dashed border-white/10">
                                    <View className="bg-[#FFE600] self-start px-3 py-1 rounded-lg mb-2">
                                        <Text className="text-black font-black text-xs tracking-widest">IDENTITY PASS</Text>
                                    </View>
                                    <Text className="text-white font-black text-2xl tracking-tight">ARIA SINGH</Text>
                                    <Text className="text-[#FFE600] text-xs font-bold mt-0.5">@ariadesigns</Text>

                                    <View className="flex-row gap-2 mt-3">
                                        <View className="bg-white/10 px-2 py-0.5 rounded">
                                            <Text className="text-white text-[8px] font-bold">VERIFIED</Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Right Section - Score */}
                                <View className="w-24 items-center justify-center py-4">
                                    <View className="w-16 h-16 rounded-full border-[3px] border-[#FFE600] items-center justify-center">
                                        <Text className="text-[#FFE600] font-black text-2xl">94</Text>
                                    </View>
                                    <Text className="text-white/30 text-[8px] font-bold mt-2 tracking-widest">SCORE</Text>
                                </View>

                            </View>

                            {/* Bottom Strip */}
                            <View className="bg-[#FFE600] mx-4 mb-3 rounded-lg px-3 py-2 flex-row justify-between items-center">
                                <View className="flex-row items-center gap-2">
                                    <View className="w-5 h-5 rounded bg-black items-center justify-center">
                                        <Ionicons name="finger-print" size={12} color="#FFE600" />
                                    </View>
                                    <Text className="text-black text-[10px] font-bold">KY-2024-8842</Text>
                                </View>
                                <View className="flex-row items-center gap-1">
                                    <Text className="text-black/60 text-[10px] font-bold">TAP TO VIEW</Text>
                                    <Ionicons name="chevron-forward" size={12} color="black" />
                                </View>
                            </View>

                        </View>
                    </TouchableOpacity>
                </View>

                {/* Share Card - Creative Design */}
                <View className="px-5 mt-10 mb-6">
                    <TouchableOpacity
                        className="bg-black rounded-2xl p-4 flex-row items-center justify-between overflow-hidden relative"
                        onPress={() => {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            setShowShareCard(true);
                            setIsGenerating(true);
                            setTimeout(() => setIsGenerating(false), 500);
                        }}
                    >
                        {/* Decorative circles */}
                        <View className="absolute -right-6 -top-6 w-24 h-24 rounded-full border-2 border-white/5" />
                        <View className="absolute -right-3 -bottom-8 w-20 h-20 rounded-full border-2 border-[#FFE600]/20" />

                        {/* Content */}
                        <View className="flex-row items-center gap-3">
                            <View className="w-10 h-10 rounded-xl bg-[#FFE600] items-center justify-center">
                                <Feather name="share-2" size={18} color="black" />
                            </View>
                            <View>
                                <Text className="text-white font-bold text-sm">Share Profile</Text>
                                <Text className="text-white/40 text-[10px]">Let others discover you</Text>
                            </View>
                        </View>

                        <View className="flex-row items-center gap-2">
                            <View className="w-8 h-8 rounded-full bg-white/10 items-center justify-center">
                                <Ionicons name="qr-code" size={16} color="white" />
                            </View>
                            <View className="w-8 h-8 rounded-full bg-white/10 items-center justify-center">
                                <Ionicons name="link" size={16} color="white" />
                            </View>
                        </View>
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
                <View className="flex-1 bg-black/50 justify-end">
                    <Pressable
                        className="absolute inset-0"
                        onPress={() => setShowSettings(false)}
                    />

                    {/* Settings Sheet */}
                    <View className="bg-[#FFE600] rounded-t-[32px] px-5 pt-4 pb-10 max-h-[90%]">
                        {/* Handle */}
                        <View className="w-12 h-1.5 bg-black/20 rounded-full self-center mb-6" />

                        {/* Header */}
                        <View className="flex-row justify-between items-center mb-6">
                            <View>
                                <Text className="text-black font-black text-2xl">Settings</Text>
                                <Text className="text-black/50 text-sm">Manage your identity</Text>
                            </View>
                            <TouchableOpacity
                                className="w-10 h-10 rounded-full bg-black items-center justify-center"
                                onPress={() => setShowSettings(false)}
                            >
                                <Ionicons name="close" size={22} color="white" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Quick Actions */}
                            <View className="flex-row gap-3 mb-6">
                                <TouchableOpacity
                                    className="flex-1 bg-white rounded-2xl p-4 items-center border-2 border-black"
                                    onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                        setShowBank(true);
                                    }}
                                >
                                    <View className="w-12 h-12 rounded-2xl bg-black items-center justify-center mb-2">
                                        <MaterialCommunityIcons name="bank" size={24} color="white" />
                                    </View>
                                    <Text className="text-black font-bold text-sm">Bank</Text>
                                    <Text className="text-black/50 text-[10px]">₹85K Balance</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="flex-1 bg-white rounded-2xl p-4 items-center border-2 border-black"
                                    onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                        setShowVerified(true);
                                    }}
                                >
                                    <View className="w-12 h-12 rounded-2xl bg-black items-center justify-center mb-2">
                                        <MaterialIcons name="verified-user" size={24} color="white" />
                                    </View>
                                    <Text className="text-black font-bold text-sm">Verified</Text>
                                    <Text className="text-black/50 text-[10px]">Student ID</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="flex-1 bg-white rounded-2xl p-4 items-center border-2 border-black"
                                    onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                        setShowSafety(true);
                                    }}
                                >
                                    <View className="w-12 h-12 rounded-2xl bg-black items-center justify-center mb-2">
                                        <MaterialIcons name="security" size={24} color="white" />
                                    </View>
                                    <Text className="text-black font-bold text-sm">Safety</Text>
                                    <Text className="text-black/50 text-[10px]">Protected</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Ghost Mode Toggle */}
                            <View className="bg-white rounded-2xl p-5 mb-6 border-2 border-black">
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-row items-center gap-4">
                                        <View className="w-14 h-14 rounded-2xl bg-black items-center justify-center">
                                            <MaterialCommunityIcons name="ghost" size={28} color={ghostMode ? "#FFE600" : "white"} />
                                        </View>
                                        <View>
                                            <Text className="text-black font-bold text-base">Ghost Mode</Text>
                                            <Text className="text-black/50 text-sm">Hide from location map</Text>
                                        </View>
                                    </View>
                                    <Switch
                                        value={ghostMode}
                                        onValueChange={(val) => {
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                            setGhostMode(val);
                                        }}
                                        trackColor={{ false: '#ccc', true: 'black' }}
                                        thumbColor={ghostMode ? '#FFE600' : 'white'}
                                    />
                                </View>
                            </View>

                            {/* Menu Items */}
                            <View className="bg-white rounded-2xl overflow-hidden mb-6 border-2 border-black">
                                <TouchableOpacity
                                    className="flex-row items-center p-4 border-b border-black/10"
                                    onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        setShowNotifications(true);
                                    }}
                                >
                                    <View className="w-10 h-10 rounded-xl bg-black items-center justify-center">
                                        <Ionicons name="notifications" size={20} color="white" />
                                    </View>
                                    <Text className="text-black font-medium text-base ml-4 flex-1">Notifications</Text>
                                    <View className="bg-[#FF6B6B] px-2 py-0.5 rounded-full mr-2">
                                        <Text className="text-white text-xs font-bold">3</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color="black" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="flex-row items-center p-4 border-b border-black/10"
                                    onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        setShowPrivacy(true);
                                    }}
                                >
                                    <View className="w-10 h-10 rounded-xl bg-black items-center justify-center">
                                        <Ionicons name="shield-checkmark" size={20} color="white" />
                                    </View>
                                    <Text className="text-black font-medium text-base ml-4 flex-1">Privacy & Data</Text>
                                    <Ionicons name="chevron-forward" size={18} color="black" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="flex-row items-center p-4 border-b border-black/10"
                                    onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        setShowHelp(true);
                                    }}
                                >
                                    <View className="w-10 h-10 rounded-xl bg-black items-center justify-center">
                                        <Ionicons name="help-buoy" size={20} color="white" />
                                    </View>
                                    <Text className="text-black font-medium text-base ml-4 flex-1">Help & Support</Text>
                                    <Ionicons name="chevron-forward" size={18} color="black" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="flex-row items-center p-4"
                                    onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        setShowTerms(true);
                                    }}
                                >
                                    <View className="w-10 h-10 rounded-xl bg-black items-center justify-center">
                                        <Ionicons name="document-text" size={20} color="white" />
                                    </View>
                                    <Text className="text-black font-medium text-base ml-4 flex-1">Terms & Conditions</Text>
                                    <Ionicons name="chevron-forward" size={18} color="black" />
                                </TouchableOpacity>
                            </View>

                            {/* Log Out */}
                            <TouchableOpacity className="bg-black rounded-2xl py-4 flex-row items-center justify-center gap-2">
                                <Ionicons name="log-out" size={20} color="white" />
                                <Text className="text-white font-bold text-base">Log Out</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Bank Modal */}
            <Modal
                visible={showBank}
                animationType="slide"
                onRequestClose={() => setShowBank(false)}
            >
                <View className="flex-1 bg-[#FFE600]">
                    {/* Header */}
                    <View className="flex-row items-center justify-between px-5 pt-12 pb-4 bg-[#FFE600]">
                        <TouchableOpacity
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setShowBank(false);
                            }}
                            className="w-10 h-10 rounded-full bg-black items-center justify-center"
                        >
                            <Ionicons name="arrow-back" size={22} color="white" />
                        </TouchableOpacity>
                        <Text className="text-black font-black text-lg">Kaarya Bank</Text>
                        <View className="w-10" />
                    </View>

                    <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
                        {/* Balance Card */}
                        <View className="bg-white rounded-3xl p-6 mb-6 border-2 border-black">
                            <Text className="text-black/60 text-sm mb-1">Available Balance</Text>
                            <Text className="text-black font-black text-4xl mb-4">₹85,420</Text>
                            <View className="flex-row gap-3">
                                <TouchableOpacity className="flex-1 bg-black rounded-2xl py-3 items-center">
                                    <Text className="text-white font-bold">Withdraw</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="flex-1 bg-white border-2 border-black rounded-2xl py-3 items-center">
                                    <Text className="text-black font-bold">History</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Connected Banks */}
                        <Text className="text-black font-bold text-lg mb-4">Connected Banks</Text>

                        <View className="bg-white rounded-2xl p-4 mb-4 border-2 border-black">
                            <View className="flex-row items-center">
                                <View className="w-14 h-14 rounded-2xl bg-[#0033A0] items-center justify-center border-2 border-black">
                                    <Text className="text-white font-black text-lg">HDFC</Text>
                                </View>
                                <View className="flex-1 ml-4">
                                    <Text className="text-black font-bold">HDFC Bank</Text>
                                    <Text className="text-black/50 text-sm">•••• 4521</Text>
                                </View>
                                <View className="bg-black px-3 py-1 rounded-full">
                                    <Text className="text-white text-xs font-bold">Primary</Text>
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity className="bg-white rounded-2xl p-4 mb-6 flex-row items-center justify-center border-2 border-dashed border-black">
                            <Ionicons name="add" size={24} color="black" />
                            <Text className="text-black/60 font-medium ml-2">Add Bank Account</Text>
                        </TouchableOpacity>

                        {/* Recent Transactions */}
                        <Text className="text-black font-bold text-lg mb-4">Recent Transactions</Text>

                        <View className="bg-white rounded-2xl overflow-hidden mb-6 border-2 border-black">
                            <View className="flex-row items-center p-4 border-b border-black/10">
                                <View className="w-12 h-12 rounded-xl bg-black items-center justify-center">
                                    <Ionicons name="arrow-down" size={22} color="white" />
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="text-black font-medium">Poster Design Gig</Text>
                                    <Text className="text-black/50 text-xs">Today, 2:30 PM</Text>
                                </View>
                                <Text className="text-[#00C853] font-bold">+₹1,500</Text>
                            </View>

                            <View className="flex-row items-center p-4 border-b border-black/10">
                                <View className="w-12 h-12 rounded-xl bg-black items-center justify-center">
                                    <Ionicons name="arrow-up" size={22} color="white" />
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="text-black font-medium">Withdrawal to HDFC</Text>
                                    <Text className="text-black/50 text-xs">Yesterday, 5:00 PM</Text>
                                </View>
                                <Text className="text-[#FF4444] font-bold">-₹5,000</Text>
                            </View>

                            <View className="flex-row items-center p-4">
                                <View className="w-12 h-12 rounded-xl bg-black items-center justify-center">
                                    <Ionicons name="arrow-down" size={22} color="white" />
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="text-black font-medium">Video Editing Project</Text>
                                    <Text className="text-black/50 text-xs">Jan 30, 11:20 AM</Text>
                                </View>
                                <Text className="text-[#00C853] font-bold">+₹3,200</Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </Modal>

            {/* Verified Modal */}
            <Modal
                visible={showVerified}
                animationType="slide"
                onRequestClose={() => setShowVerified(false)}
            >
                <View className="flex-1 bg-[#FFE600]">
                    {/* Header */}
                    <View className="flex-row items-center justify-between px-5 pt-12 pb-4 bg-[#FFE600]">
                        <TouchableOpacity
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setShowVerified(false);
                            }}
                            className="w-10 h-10 rounded-full bg-black items-center justify-center"
                        >
                            <Ionicons name="arrow-back" size={22} color="white" />
                        </TouchableOpacity>
                        <Text className="text-black font-black text-lg">Verification</Text>
                        <View className="w-10" />
                    </View>

                    <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
                        {/* Verification Status */}
                        <View className="bg-white border-2 border-black rounded-3xl p-6 mb-6 items-center">
                            <View className="w-20 h-20 rounded-full bg-black items-center justify-center mb-4">
                                <MaterialIcons name="verified-user" size={40} color="white" />
                            </View>
                            <Text className="text-black font-black text-xl mb-1">Fully Verified</Text>
                            <Text className="text-black/50 text-sm text-center">Your identity has been verified</Text>
                        </View>

                        {/* Verification Items */}
                        <Text className="text-black font-bold text-lg mb-4">Verification Status</Text>

                        <View className="bg-white rounded-2xl overflow-hidden mb-6 border-2 border-black">
                            {/* Student ID */}
                            <View className="flex-row items-center p-4 border-b border-black/10">
                                <View className="w-12 h-12 rounded-xl bg-black items-center justify-center">
                                    <Ionicons name="school" size={22} color="white" />
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="text-black font-medium">Student ID</Text>
                                    <Text className="text-black/50 text-xs">Delhi University • 2023</Text>
                                </View>
                                <View className="bg-black w-6 h-6 rounded-full items-center justify-center">
                                    <Ionicons name="checkmark" size={16} color="white" />
                                </View>
                            </View>

                            {/* Aadhaar */}
                            <View className="flex-row items-center p-4 border-b border-black/10">
                                <View className="w-12 h-12 rounded-xl bg-black items-center justify-center">
                                    <Ionicons name="id-card" size={22} color="white" />
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="text-black font-medium">Aadhaar KYC</Text>
                                    <Text className="text-black/50 text-xs">•••• •••• 5678</Text>
                                </View>
                                <View className="bg-black w-6 h-6 rounded-full items-center justify-center">
                                    <Ionicons name="checkmark" size={16} color="white" />
                                </View>
                            </View>

                            {/* PAN */}
                            <View className="flex-row items-center p-4 border-b border-black/10">
                                <View className="w-12 h-12 rounded-xl bg-black items-center justify-center">
                                    <Ionicons name="document" size={22} color="white" />
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="text-black font-medium">PAN Card</Text>
                                    <Text className="text-black/50 text-xs">ABCDE1234F</Text>
                                </View>
                                <View className="bg-black w-6 h-6 rounded-full items-center justify-center">
                                    <Ionicons name="checkmark" size={16} color="white" />
                                </View>
                            </View>

                            {/* Phone */}
                            <View className="flex-row items-center p-4">
                                <View className="w-12 h-12 rounded-xl bg-black items-center justify-center">
                                    <Ionicons name="call" size={22} color="white" />
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="text-black font-medium">Phone Number</Text>
                                    <Text className="text-black/50 text-xs">+91 98765 •••••</Text>
                                </View>
                                <View className="bg-black w-6 h-6 rounded-full items-center justify-center">
                                    <Ionicons name="checkmark" size={16} color="white" />
                                </View>
                            </View>
                        </View>

                        {/* Verification Timeline */}
                        <Text className="text-black font-bold text-lg mb-4">Verification Timeline</Text>
                        <View className="bg-white rounded-2xl p-4 mb-6 border-2 border-black">
                            <View className="flex-row items-start mb-4">
                                <View className="w-3 h-3 rounded-full bg-black mt-1.5" />
                                <View className="flex-1 ml-4">
                                    <Text className="text-black font-medium">Fully Verified</Text>
                                    <Text className="text-black/50 text-xs">Jan 15, 2024</Text>
                                </View>
                            </View>
                            <View className="flex-row items-start mb-4">
                                <View className="w-3 h-3 rounded-full bg-black/50 mt-1.5" />
                                <View className="flex-1 ml-4">
                                    <Text className="text-black font-medium">Documents Submitted</Text>
                                    <Text className="text-black/50 text-xs">Jan 14, 2024</Text>
                                </View>
                            </View>
                            <View className="flex-row items-start">
                                <View className="w-3 h-3 rounded-full bg-black/20 mt-1.5" />
                                <View className="flex-1 ml-4">
                                    <Text className="text-black font-medium">Account Created</Text>
                                    <Text className="text-black/50 text-xs">Jan 10, 2024</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </Modal>

            {/* Safety Modal */}
            <Modal
                visible={showSafety}
                animationType="slide"
                onRequestClose={() => setShowSafety(false)}
            >
                <View className="flex-1 bg-[#FFE600]">
                    {/* Header */}
                    <View className="flex-row items-center justify-between px-5 pt-12 pb-4 bg-[#FFE600]">
                        <TouchableOpacity
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setShowSafety(false);
                            }}
                            className="w-10 h-10 rounded-full bg-black items-center justify-center"
                        >
                            <Ionicons name="arrow-back" size={22} color="white" />
                        </TouchableOpacity>
                        <Text className="text-black font-black text-lg">Security Hub</Text>
                        <View className="w-10" />
                    </View>

                    <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
                        {/* Security Score */}
                        <View className="bg-white border-2 border-black rounded-3xl p-6 mb-6 items-center">
                            <View className="w-20 h-20 rounded-full bg-black items-center justify-center mb-4">
                                <Text className="text-white font-black text-3xl">95</Text>
                            </View>
                            <Text className="text-black font-black text-xl mb-1">Security Score</Text>
                            <Text className="text-black/50 text-sm text-center">Your account is well protected</Text>
                        </View>

                        {/* Security Options */}
                        <Text className="text-black font-bold text-lg mb-4">Security Settings</Text>

                        <View className="bg-white rounded-2xl overflow-hidden mb-6 border-2 border-black">
                            {/* PIN */}
                            <View className="flex-row items-center p-4 border-b border-black/10">
                                <View className="w-12 h-12 rounded-xl bg-black items-center justify-center">
                                    <MaterialCommunityIcons name="lock-outline" size={24} color="white" />
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="text-black font-medium">Transaction PIN</Text>
                                    <Text className="text-black/50 text-xs">4-digit PIN enabled</Text>
                                </View>
                                <TouchableOpacity className="bg-black px-4 py-2 rounded-full">
                                    <Text className="text-white text-xs font-bold">Change</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Biometrics */}
                            <View className="flex-row items-center p-4 border-b border-black/10">
                                <View className="w-12 h-12 rounded-xl bg-black items-center justify-center">
                                    <MaterialCommunityIcons name="fingerprint" size={24} color="white" />
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="text-black font-medium">Biometric Login</Text>
                                    <Text className="text-black/50 text-xs">Face ID / Fingerprint</Text>
                                </View>
                                <Switch
                                    value={true}
                                    trackColor={{ false: '#ccc', true: 'black' }}
                                    thumbColor={'white'}
                                />
                            </View>

                            {/* 2FA */}
                            <View className="flex-row items-center p-4 border-b border-black/10">
                                <View className="w-12 h-12 rounded-xl bg-black items-center justify-center">
                                    <MaterialIcons name="security" size={24} color="white" />
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="text-black font-medium">Two-Factor Auth</Text>
                                    <Text className="text-black/50 text-xs">SMS verification enabled</Text>
                                </View>
                                <Switch
                                    value={true}
                                    trackColor={{ false: '#ccc', true: 'black' }}
                                    thumbColor={'white'}
                                />
                            </View>

                            {/* Session Timeout */}
                            <View className="flex-row items-center p-4">
                                <View className="w-12 h-12 rounded-xl bg-black items-center justify-center">
                                    <Ionicons name="time" size={24} color="white" />
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="text-black font-medium">Session Timeout</Text>
                                    <Text className="text-black/50 text-xs">Auto-logout after 30 mins</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="black" />
                            </View>
                        </View>

                        {/* Trusted Devices */}
                        <Text className="text-black font-bold text-lg mb-4">Trusted Devices</Text>
                        <View className="bg-white rounded-2xl p-4 mb-6 border-2 border-black">
                            <View className="flex-row items-center mb-4">
                                <View className="w-10 h-10 rounded-xl bg-black items-center justify-center">
                                    <Ionicons name="phone-portrait" size={20} color="white" />
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="text-black font-medium">iPhone 14 Pro</Text>
                                    <Text className="text-[#00C853] text-xs">Current Device</Text>
                                </View>
                            </View>
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 rounded-xl bg-black/10 items-center justify-center">
                                    <Ionicons name="laptop" size={20} color="black" />
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="text-black font-medium">MacBook Air</Text>
                                    <Text className="text-black/50 text-xs">Last active: 2 days ago</Text>
                                </View>
                            </View>
                        </View>

                        {/* Emergency */}
                        <TouchableOpacity className="bg-[#FF4444] rounded-2xl py-4 flex-row items-center justify-center gap-2 mb-6 border-2 border-black">
                            <Ionicons name="warning" size={20} color="white" />
                            <Text className="text-white font-bold">Emergency Account Lock</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </Modal>

            {/* Notifications Modal */}
            <Modal
                visible={showNotifications}
                animationType="slide"
                onRequestClose={() => setShowNotifications(false)}
            >
                <View className="flex-1 bg-[#FFE600]">
                    {/* Header */}
                    <View className="flex-row items-center justify-between px-5 pt-12 pb-4 bg-[#FFE600]">
                        <TouchableOpacity
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setShowNotifications(false);
                            }}
                            className="w-10 h-10 rounded-full bg-black items-center justify-center"
                        >
                            <Ionicons name="arrow-back" size={22} color="white" />
                        </TouchableOpacity>
                        <Text className="text-black font-black text-lg">Notifications</Text>
                        <View className="w-10" />
                    </View>

                    <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
                        {/* Push Notifications */}
                        <Text className="text-black font-bold text-lg mb-4">Push Notifications</Text>

                        <View className="bg-white rounded-2xl overflow-hidden mb-6 border-2 border-black">
                            <View className="flex-row items-center p-4 border-b border-black/10">
                                <View className="w-12 h-12 rounded-xl bg-black items-center justify-center">
                                    <Ionicons name="notifications" size={22} color="white" />
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="text-black font-medium">All Notifications</Text>
                                    <Text className="text-black/50 text-xs">Master toggle for all alerts</Text>
                                </View>
                                <Switch
                                    value={true}
                                    trackColor={{ false: '#ccc', true: 'black' }}
                                    thumbColor={'white'}
                                />
                            </View>

                            <View className="flex-row items-center p-4 border-b border-black/10">
                                <View className="w-12 h-12 rounded-xl bg-black items-center justify-center">
                                    <Ionicons name="briefcase" size={22} color="white" />
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="text-black font-medium">New Gig Alerts</Text>
                                    <Text className="text-black/50 text-xs">When new gigs match your skills</Text>
                                </View>
                                <Switch
                                    value={true}
                                    trackColor={{ false: '#ccc', true: 'black' }}
                                    thumbColor={'white'}
                                />
                            </View>

                            <View className="flex-row items-center p-4 border-b border-black/10">
                                <View className="w-12 h-12 rounded-xl bg-black items-center justify-center">
                                    <Ionicons name="cash" size={22} color="white" />
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="text-black font-medium">Payment Alerts</Text>
                                    <Text className="text-black/50 text-xs">When you receive payments</Text>
                                </View>
                                <Switch
                                    value={true}
                                    trackColor={{ false: '#ccc', true: 'black' }}
                                    thumbColor={'white'}
                                />
                            </View>

                            <View className="flex-row items-center p-4 border-b border-black/10">
                                <View className="w-12 h-12 rounded-xl bg-black items-center justify-center">
                                    <Ionicons name="chatbubbles" size={22} color="white" />
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="text-black font-medium">Messages</Text>
                                    <Text className="text-black/50 text-xs">Direct messages and inquiries</Text>
                                </View>
                                <Switch
                                    value={true}
                                    trackColor={{ false: '#ccc', true: 'black' }}
                                    thumbColor={'white'}
                                />
                            </View>

                            <View className="flex-row items-center p-4">
                                <View className="w-12 h-12 rounded-xl bg-black items-center justify-center">
                                    <Ionicons name="star" size={22} color="white" />
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="text-black font-medium">Reviews & Vouches</Text>
                                    <Text className="text-black/50 text-xs">When someone vouches for you</Text>
                                </View>
                                <Switch
                                    value={true}
                                    trackColor={{ false: '#ccc', true: 'black' }}
                                    thumbColor={'white'}
                                />
                            </View>
                        </View>

                        {/* Email Preferences */}
                        <Text className="text-black font-bold text-lg mb-4">Email Preferences</Text>

                        <View className="bg-white rounded-2xl overflow-hidden mb-6 border-2 border-black">
                            <View className="flex-row items-center p-4 border-b border-black/10">
                                <View className="flex-1">
                                    <Text className="text-black font-medium">Weekly Summary</Text>
                                    <Text className="text-black/50 text-xs">Your gig stats and earnings</Text>
                                </View>
                                <Switch
                                    value={true}
                                    trackColor={{ false: '#ccc', true: 'black' }}
                                    thumbColor={'white'}
                                />
                            </View>

                            <View className="flex-row items-center p-4">
                                <View className="flex-1">
                                    <Text className="text-black font-medium">Marketing</Text>
                                    <Text className="text-black/50 text-xs">Tips, offers, and updates</Text>
                                </View>
                                <Switch
                                    value={false}
                                    trackColor={{ false: '#ccc', true: 'black' }}
                                    thumbColor={'white'}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </Modal>

            {/* Privacy Modal */}
            <Modal
                visible={showPrivacy}
                animationType="slide"
                onRequestClose={() => setShowPrivacy(false)}
            >
                <View className="flex-1 bg-[#FFE600]">
                    {/* Header */}
                    <View className="flex-row items-center justify-between px-5 pt-12 pb-4 bg-[#FFE600]">
                        <TouchableOpacity
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setShowPrivacy(false);
                            }}
                            className="w-10 h-10 rounded-full bg-black items-center justify-center"
                        >
                            <Ionicons name="arrow-back" size={22} color="white" />
                        </TouchableOpacity>
                        <Text className="text-black font-black text-lg">Privacy & Data</Text>
                        <View className="w-10" />
                    </View>

                    <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
                        {/* Profile Visibility */}
                        <Text className="text-black font-bold text-lg mb-4">Profile Visibility</Text>

                        <View className="bg-white rounded-2xl overflow-hidden mb-6 border-2 border-black">
                            <View className="flex-row items-center p-4 border-b border-black/10">
                                <View className="w-12 h-12 rounded-xl bg-black items-center justify-center">
                                    <Ionicons name="globe" size={22} color="white" />
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="text-black font-medium">Public Profile</Text>
                                    <Text className="text-black/50 text-xs">Anyone can view your profile</Text>
                                </View>
                                <Switch
                                    value={true}
                                    trackColor={{ false: '#ccc', true: 'black' }}
                                    thumbColor={'white'}
                                />
                            </View>

                            <View className="flex-row items-center p-4 border-b border-black/10">
                                <View className="w-12 h-12 rounded-xl bg-black items-center justify-center">
                                    <Ionicons name="cash" size={22} color="white" />
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="text-black font-medium">Show Earnings</Text>
                                    <Text className="text-black/50 text-xs">Display your total earnings</Text>
                                </View>
                                <Switch
                                    value={false}
                                    trackColor={{ false: '#ccc', true: 'black' }}
                                    thumbColor={'white'}
                                />
                            </View>

                            <View className="flex-row items-center p-4">
                                <View className="w-12 h-12 rounded-xl bg-black items-center justify-center">
                                    <Ionicons name="location" size={22} color="white" />
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="text-black font-medium">Location Sharing</Text>
                                    <Text className="text-black/50 text-xs">College location on map</Text>
                                </View>
                                <Switch
                                    value={true}
                                    trackColor={{ false: '#ccc', true: 'black' }}
                                    thumbColor={'white'}
                                />
                            </View>
                        </View>

                        {/* Data Management */}
                        <Text className="text-black font-bold text-lg mb-4">Data Management</Text>

                        <View className="bg-white rounded-2xl overflow-hidden mb-6 border-2 border-black">
                            <TouchableOpacity className="flex-row items-center p-4 border-b border-black/10">
                                <View className="w-12 h-12 rounded-xl bg-black items-center justify-center">
                                    <Ionicons name="download" size={22} color="white" />
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="text-black font-medium">Download My Data</Text>
                                    <Text className="text-black/50 text-xs">Get a copy of your data</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="black" />
                            </TouchableOpacity>

                            <TouchableOpacity className="flex-row items-center p-4">
                                <View className="w-12 h-12 rounded-xl bg-[#FF4444] items-center justify-center">
                                    <Ionicons name="trash" size={22} color="white" />
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="text-black font-medium">Delete Account</Text>
                                    <Text className="text-black/50 text-xs">Permanently remove your data</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="black" />
                            </TouchableOpacity>
                        </View>

                        {/* Blocked Users */}
                        <Text className="text-black font-bold text-lg mb-4">Blocked Users</Text>
                        <View className="bg-white rounded-2xl p-4 mb-6 items-center border-2 border-black">
                            <Text className="text-black/50 text-sm">No blocked users</Text>
                        </View>
                    </ScrollView>
                </View>
            </Modal>

            {/* Help Modal */}
            <Modal
                visible={showHelp}
                animationType="slide"
                onRequestClose={() => setShowHelp(false)}
            >
                <View className="flex-1 bg-[#FFE600]">
                    {/* Header */}
                    <View className="flex-row items-center justify-between px-5 pt-12 pb-4 bg-[#FFE600]">
                        <TouchableOpacity
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setShowHelp(false);
                            }}
                            className="w-10 h-10 rounded-full bg-black items-center justify-center"
                        >
                            <Ionicons name="arrow-back" size={22} color="white" />
                        </TouchableOpacity>
                        <Text className="text-black font-black text-lg">Help & Support</Text>
                        <View className="w-10" />
                    </View>

                    <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
                        {/* Quick Help */}
                        <View className="bg-white border-2 border-black rounded-2xl p-5 mb-6">
                            <View className="flex-row items-center mb-3">
                                <View className="w-12 h-12 rounded-xl bg-black items-center justify-center">
                                    <Ionicons name="chatbubbles" size={24} color="white" />
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="text-black font-bold">Chat with Support</Text>
                                    <Text className="text-black/50 text-xs">Usually responds in 5 mins</Text>
                                </View>
                            </View>
                            <TouchableOpacity className="bg-black rounded-xl py-3 items-center">
                                <Text className="text-white font-bold">Start Chat</Text>
                            </TouchableOpacity>
                        </View>

                        {/* FAQ Section */}
                        <Text className="text-black font-bold text-lg mb-4">Frequently Asked</Text>

                        <View className="bg-white rounded-2xl overflow-hidden mb-6 border-2 border-black">
                            <TouchableOpacity className="flex-row items-center p-4 border-b border-black/10">
                                <View className="flex-1">
                                    <Text className="text-black font-medium">How do I get paid?</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="black" />
                            </TouchableOpacity>

                            <TouchableOpacity className="flex-row items-center p-4 border-b border-black/10">
                                <View className="flex-1">
                                    <Text className="text-black font-medium">How do vouches work?</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="black" />
                            </TouchableOpacity>

                            <TouchableOpacity className="flex-row items-center p-4 border-b border-black/10">
                                <View className="flex-1">
                                    <Text className="text-black font-medium">How to increase my rating?</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="black" />
                            </TouchableOpacity>

                            <TouchableOpacity className="flex-row items-center p-4">
                                <View className="flex-1">
                                    <Text className="text-black font-medium">How to verify my skills?</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="black" />
                            </TouchableOpacity>
                        </View>

                        {/* Contact Options */}
                        <Text className="text-black font-bold text-lg mb-4">Contact Us</Text>

                        <View className="flex-row gap-3 mb-6">
                            <TouchableOpacity className="flex-1 bg-white border-2 border-black rounded-2xl p-4 items-center">
                                <View className="w-12 h-12 rounded-xl bg-[#25D366] items-center justify-center mb-2">
                                    <Ionicons name="logo-whatsapp" size={24} color="white" />
                                </View>
                                <Text className="text-black font-medium text-sm">WhatsApp</Text>
                            </TouchableOpacity>

                            <TouchableOpacity className="flex-1 bg-white border-2 border-black rounded-2xl p-4 items-center">
                                <View className="w-12 h-12 rounded-xl bg-[#FF6B6B] items-center justify-center mb-2">
                                    <Ionicons name="mail" size={24} color="white" />
                                </View>
                                <Text className="text-black font-medium text-sm">Email</Text>
                            </TouchableOpacity>

                            <TouchableOpacity className="flex-1 bg-white border-2 border-black rounded-2xl p-4 items-center">
                                <View className="w-12 h-12 rounded-xl bg-[#1DA1F2] items-center justify-center mb-2">
                                    <Ionicons name="logo-twitter" size={24} color="white" />
                                </View>
                                <Text className="text-black font-medium text-sm">Twitter</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Report Issue */}
                        <TouchableOpacity className="bg-[#FF6B6B] border-2 border-black rounded-2xl py-4 flex-row items-center justify-center gap-2 mb-6">
                            <Ionicons name="bug" size={20} color="white" />
                            <Text className="text-white font-bold">Report a Bug</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </Modal>

            {/* Terms Modal */}
            <Modal
                visible={showTerms}
                animationType="slide"
                onRequestClose={() => setShowTerms(false)}
            >
                <View className="flex-1 bg-[#FFE600]">
                    {/* Header */}
                    <View className="flex-row items-center justify-between px-5 pt-12 pb-4 bg-[#FFE600]">
                        <TouchableOpacity
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setShowTerms(false);
                            }}
                            className="w-10 h-10 rounded-full bg-black items-center justify-center"
                        >
                            <Ionicons name="arrow-back" size={22} color="white" />
                        </TouchableOpacity>
                        <Text className="text-black font-black text-lg">Legal</Text>
                        <View className="w-10" />
                    </View>

                    <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
                        {/* Legal Documents */}
                        <View className="bg-white rounded-2xl overflow-hidden mb-6 border-2 border-black">
                            <TouchableOpacity className="flex-row items-center p-4 border-b border-black/10">
                                <View className="w-12 h-12 rounded-xl bg-black items-center justify-center">
                                    <Ionicons name="document-text" size={22} color="white" />
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="text-black font-medium">Terms of Service</Text>
                                    <Text className="text-black/50 text-xs">Last updated: Jan 2024</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="black" />
                            </TouchableOpacity>

                            <TouchableOpacity className="flex-row items-center p-4 border-b border-black/10">
                                <View className="w-12 h-12 rounded-xl bg-black items-center justify-center">
                                    <Ionicons name="shield" size={22} color="white" />
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="text-black font-medium">Privacy Policy</Text>
                                    <Text className="text-black/50 text-xs">How we handle your data</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="black" />
                            </TouchableOpacity>

                            <TouchableOpacity className="flex-row items-center p-4 border-b border-black/10">
                                <View className="w-12 h-12 rounded-xl bg-black items-center justify-center">
                                    <Ionicons name="people" size={22} color="white" />
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="text-black font-medium">Community Guidelines</Text>
                                    <Text className="text-black/50 text-xs">Rules for the community</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="black" />
                            </TouchableOpacity>

                            <TouchableOpacity className="flex-row items-center p-4">
                                <View className="w-12 h-12 rounded-xl bg-black items-center justify-center">
                                    <Ionicons name="warning" size={22} color="white" />
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="text-black font-medium">Safety Guidelines</Text>
                                    <Text className="text-black/50 text-xs">Stay safe while hustling</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="black" />
                            </TouchableOpacity>
                        </View>

                        {/* App Info */}
                        <View className="bg-white border-2 border-black rounded-2xl p-5 mb-6 items-center">
                            <Text className="text-black font-black text-2xl mb-1">KAARYA</Text>
                            <Text className="text-black/50 text-sm mb-3">Version 1.0.0</Text>
                            <Text className="text-black/40 text-xs text-center">
                                © 2024 Kaarya Technologies Pvt. Ltd.{'\n'}
                                All rights reserved.
                            </Text>
                        </View>
                    </ScrollView>
                </View>
            </Modal>

            {/* Player Card Detail Modal */}
            <Modal
                visible={showPlayerCard}
                transparent
                animationType="fade"
                onRequestClose={() => setShowPlayerCard(false)}
            >
                <View className="flex-1 bg-black/90 justify-center px-5">
                    <View className="bg-white rounded-3xl overflow-hidden border-2 border-black">
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
                                    <Text className="text-black font-black text-2xl tracking-wider">KAARYA</Text>
                                    <Text className="text-black/50 text-sm mt-1">ARIA SINGH</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => setShowPlayerCard(false)}
                                    className="w-10 h-10 rounded-full bg-black items-center justify-center"
                                >
                                    <Ionicons name="close" size={22} color="white" />
                                </TouchableOpacity>
                            </View>

                            <View className="flex-row justify-between items-end mt-4">
                                <View className="bg-black rounded-lg px-3 py-1.5">
                                    <Text className="text-[#FFD700] font-black text-xs">GEN-Z ELITE</Text>
                                </View>
                                <View className="items-end">
                                    <Text className="text-black font-black text-5xl">94</Text>
                                    <Text className="text-black/50 text-xs">WIZARD SCORE</Text>
                                </View>
                            </View>
                        </View>

                        {/* Wizard Score Breakdown */}
                        <View className="px-5 pb-5">
                            <Text className="text-black font-bold text-base mb-4">⚡ Score Breakdown</Text>

                            <View className="gap-4">
                                {/* Punctuality */}
                                <View className="flex-row items-center">
                                    <View className="w-12 h-12 rounded-2xl bg-black items-center justify-center">
                                        <Ionicons name="time" size={22} color="white" />
                                    </View>
                                    <View className="flex-1 ml-4">
                                        <View className="flex-row justify-between items-center">
                                            <Text className="text-black font-semibold text-sm">Punctuality</Text>
                                            <Text className="text-[#4ECDC4] font-bold text-sm">98%</Text>
                                        </View>
                                        <View className="h-2 bg-black/10 rounded-full overflow-hidden mt-2">
                                            <View className="w-[98%] h-full bg-[#4ECDC4] rounded-full" />
                                        </View>
                                    </View>
                                </View>

                                {/* Quality */}
                                <View className="flex-row items-center">
                                    <View className="w-12 h-12 rounded-2xl bg-black items-center justify-center">
                                        <Ionicons name="diamond" size={22} color="white" />
                                    </View>
                                    <View className="flex-1 ml-4">
                                        <View className="flex-row justify-between items-center">
                                            <Text className="text-black font-semibold text-sm">Quality</Text>
                                            <Text className="text-[#A78BFA] font-bold text-sm">96%</Text>
                                        </View>
                                        <View className="h-2 bg-black/10 rounded-full overflow-hidden mt-2">
                                            <View className="w-[96%] h-full bg-[#A78BFA] rounded-full" />
                                        </View>
                                    </View>
                                </View>

                                {/* Communication */}
                                <View className="flex-row items-center">
                                    <View className="w-12 h-12 rounded-2xl bg-black items-center justify-center">
                                        <Ionicons name="chatbubbles" size={22} color="white" />
                                    </View>
                                    <View className="flex-1 ml-4">
                                        <View className="flex-row justify-between items-center">
                                            <Text className="text-black font-semibold text-sm">Communication</Text>
                                            <Text className="text-[#FF6B6B] font-bold text-sm">92%</Text>
                                        </View>
                                        <View className="h-2 bg-black/10 rounded-full overflow-hidden mt-2">
                                            <View className="w-[92%] h-full bg-[#FF6B6B] rounded-full" />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Divider */}
                        <View className="h-0.5 bg-black/5 mx-5" />

                        {/* Vouch Gallery */}
                        <View className="p-5">
                            <Text className="text-black font-bold text-base mb-4">🤝 Top Vouches</Text>

                            <View className="gap-2">
                                <View className="flex-row items-center bg-white border border-black rounded-2xl p-3">
                                    <View className="w-10 h-10 rounded-xl bg-black items-center justify-center">
                                        <Text className="text-[#FFD700] font-bold text-sm">AJ</Text>
                                    </View>
                                    <View className="ml-3 flex-1">
                                        <Text className="text-black font-semibold text-sm">Arjun</Text>
                                        <Text className="text-black/50 text-xs">Vouched for UI Design</Text>
                                    </View>
                                    <View className="bg-[#BFFF00]/20 px-2 py-1 rounded-lg">
                                        <Text className="text-[#00C853] text-xs font-bold">+3</Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center bg-white border border-black rounded-2xl p-3">
                                    <View className="w-10 h-10 rounded-xl bg-black items-center justify-center">
                                        <Text className="text-[#FF6B6B] font-bold text-sm">PS</Text>
                                    </View>
                                    <View className="ml-3 flex-1">
                                        <Text className="text-black font-semibold text-sm">Priya</Text>
                                        <Text className="text-black/50 text-xs">Vouched for Typography</Text>
                                    </View>
                                    <View className="bg-[#BFFF00]/20 px-2 py-1 rounded-lg">
                                        <Text className="text-[#00C853] text-xs font-bold">+2</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Stats Row */}
                        <View className="flex-row gap-3 px-5 pb-5">
                            <View className="flex-1 bg-white border border-black rounded-2xl p-4 items-center">
                                <Text className="text-black font-black text-2xl">47</Text>
                                <Text className="text-black/50 text-[10px]">GIGS DONE</Text>
                            </View>
                            <View className="flex-1 bg-white border border-black rounded-2xl p-4 items-center">
                                <Text className="text-[#4ECDC4] font-black text-2xl">98%</Text>
                                <Text className="text-black/50 text-[10px]">SUCCESS</Text>
                            </View>
                            <View className="flex-1 bg-white border border-black rounded-2xl p-4 items-center">
                                <Text className="text-[#A78BFA] font-black text-2xl">12</Text>
                                <Text className="text-black/50 text-[10px]">REPEAT</Text>
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
                <View className="flex-1 bg-black/90 justify-end">
                    <Pressable
                        className="absolute inset-0"
                        onPress={() => setShowShareCard(false)}
                    />

                    <View className="bg-white rounded-t-[32px] px-5 pt-4 pb-10 border-t-2 border-black">
                        {/* Handle */}
                        <View className="w-12 h-1.5 bg-black/20 rounded-full self-center mb-6" />

                        {/* Header */}
                        <View className="flex-row justify-between items-start mb-6">
                            <View>
                                <Text className="text-black font-black text-2xl">Share Your Flex</Text>
                                <Text className="text-black/50 text-sm">Create a shareable card</Text>
                            </View>
                            <TouchableOpacity
                                className="w-10 h-10 rounded-full bg-black items-center justify-center"
                                onPress={() => setShowShareCard(false)}
                            >
                                <Ionicons name="close" size={22} color="white" />
                            </TouchableOpacity>
                        </View>

                        {isGenerating ? (
                            /* Loading State */
                            <View className="items-center py-10">
                                <View className="w-48 h-2 bg-black/10 rounded-full overflow-hidden">
                                    <View className="w-full h-full bg-[#FFD700] animate-pulse rounded-full" />
                                </View>
                                <Text className="text-black/40 text-sm mt-3">Generating Your Flex...</Text>
                            </View>
                        ) : (
                            <>
                                {/* Theme Selection */}
                                <Text className="text-black font-bold text-sm mb-3">Choose Your Vibe</Text>
                                <View className="flex-row gap-3 mb-6">
                                    {/* Neon Hustle */}
                                    <TouchableOpacity
                                        className={`flex-1 rounded-2xl p-3 items-center border-2 ${selectedTheme === 'neon' ? 'border-black bg-black' : 'border-black/10 bg-white'}`}
                                        onPress={() => setSelectedTheme('neon')}
                                    >
                                        <LinearGradient
                                            colors={['#FF00FF', '#00FFFF']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            className="w-10 h-10 rounded-xl mb-2"
                                        />
                                        <Text className={`text-xs font-bold ${selectedTheme === 'neon' ? 'text-white' : 'text-black'}`}>Neon</Text>
                                    </TouchableOpacity>

                                    {/* Gold */}
                                    <TouchableOpacity
                                        className={`flex-1 rounded-2xl p-3 items-center border-2 ${selectedTheme === 'brutalist' ? 'border-black bg-black' : 'border-black/10 bg-white'}`}
                                        onPress={() => setSelectedTheme('brutalist')}
                                    >
                                        <View className="w-10 h-10 rounded-xl mb-2 bg-[#FFD700]" />
                                        <Text className={`text-xs font-bold ${selectedTheme === 'brutalist' ? 'text-white' : 'text-black'}`}>Gold</Text>
                                    </TouchableOpacity>

                                    {/* Minimal */}
                                    <TouchableOpacity
                                        className={`flex-1 rounded-2xl p-3 items-center border-2 ${selectedTheme === 'minimal' ? 'border-black bg-black' : 'border-black/10 bg-white'}`}
                                        onPress={() => setSelectedTheme('minimal')}
                                    >
                                        <View className="w-10 h-10 rounded-xl mb-2 bg-white border border-black/20" />
                                        <Text className={`text-xs font-bold ${selectedTheme === 'minimal' ? 'text-white' : 'text-black'}`}>Minimal</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Card Preview */}
                                <View
                                    className="rounded-2xl p-5 mb-6 border shadow-sm"
                                    style={{
                                        backgroundColor: selectedTheme === 'neon' ? '#0a0a0a' : selectedTheme === 'brutalist' ? '#FFE600' : '#ffffff',
                                        borderColor: selectedTheme === 'neon' ? '#333' : selectedTheme === 'brutalist' ? '#000' : '#000',
                                        borderWidth: 2,
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
                                            <Text className="text-xs" style={{ color: selectedTheme === 'neon' ? '#00FFFF' : '#000', opacity: 0.6 }}>@ARIADESIGNS • Lvl 42</Text>
                                        </View>
                                    </View>

                                    <View className="flex-row justify-between items-center">
                                        <View>
                                            <Text className="font-black text-3xl" style={{ color: selectedTheme === 'neon' ? '#FF00FF' : '#000' }}>94</Text>
                                            <Text className="text-xs" style={{ color: selectedTheme === 'neon' ? '#fff' : '#000', opacity: 0.6 }}>Wizard Score</Text>
                                        </View>
                                        <View className="items-center">
                                            <Text className="font-bold text-lg" style={{ color: selectedTheme === 'neon' ? '#fff' : '#000' }}>₹85k</Text>
                                            <Text className="text-xs" style={{ color: selectedTheme === 'neon' ? '#fff' : '#000', opacity: 0.6 }}>Earned</Text>
                                        </View>
                                        {/* QR Placeholder */}
                                        <View className="w-16 h-16 bg-white rounded-xl items-center justify-center border-2 border-black">
                                            <MaterialCommunityIcons name="qrcode" size={40} color="black" />
                                        </View>
                                    </View>

                                    <Text className="text-center text-[10px] mt-4" style={{ color: selectedTheme === 'neon' ? '#666' : '#000', opacity: 0.5 }}>
                                        Scan to view profile on KAARYA
                                    </Text>
                                </View>

                                {/* Share Button */}
                                <TouchableOpacity className="bg-black rounded-2xl py-4 flex-row items-center justify-center gap-2">
                                    <Feather name="share" size={18} color="white" />
                                    <Text className="text-white font-black text-base">Share to Stories</Text>
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
                <View className="flex-1 bg-black/90 justify-end">
                    <Pressable
                        className="absolute inset-0"
                        onPress={() => setShowLevelUp(false)}
                    />

                    <View className="bg-white rounded-t-[32px] px-5 pt-4 pb-10 max-h-[90%] border-t-2 border-black">
                        {/* Handle */}
                        <View className="w-12 h-1.5 bg-black/20 rounded-full self-center mb-6" />

                        {/* Header */}
                        <View className="flex-row justify-between items-start mb-6">
                            <View>
                                <Text className="text-black font-black text-2xl">Career Roadmap</Text>
                                <View className="flex-row items-center gap-2 mt-1">
                                    <View className="bg-[#FFD700] px-2 py-0.5 rounded-md border border-black">
                                        <Text className="text-black font-bold text-xs">PRO-HUSTLER</Text>
                                    </View>
                                    <Text className="text-black/50 text-sm">47 Gigs Completed</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                className="w-10 h-10 rounded-full bg-black items-center justify-center"
                                onPress={() => setShowLevelUp(false)}
                            >
                                <Ionicons name="close" size={22} color="white" />
                            </TouchableOpacity>
                        </View>

                        {/* XP Progress */}
                        <View className="bg-white border-2 border-black rounded-2xl p-4 mb-6">
                            <View className="flex-row justify-between items-center mb-3">
                                <View className="flex-row items-center gap-2">
                                    <View className="w-8 h-8 rounded-lg bg-black items-center justify-center">
                                        <FontAwesome5 name="fire" size={14} color="#FFD700" />
                                    </View>
                                    <Text className="text-black font-bold">Level 42</Text>
                                </View>
                                <Text className="text-black font-bold">47 / 50 Gigs</Text>
                            </View>
                            <View className="h-3 bg-black/10 rounded-full overflow-hidden">
                                <View className="w-[94%] h-full bg-[#FFD700] rounded-full border border-black/10" />
                            </View>
                            <Text className="text-black/40 text-xs mt-2">3 more gigs to G.O.A.T Status</Text>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Skill Tree */}
                            <View className="items-center py-4">
                                {/* Node 1 - Rookie - Completed */}
                                <View className="items-center">
                                    <View className="w-16 h-16 rounded-full bg-[#4ECDC4] border-2 border-black items-center justify-center">
                                        <Ionicons name="checkmark" size={28} color="black" />
                                    </View>
                                    <Text className="text-black font-bold text-sm mt-2">Rookie</Text>
                                    <Text className="text-black/40 text-xs">0-5 Gigs</Text>
                                </View>

                                <View className="w-1 h-8 bg-black/20" />

                                {/* Node 2 - Pro-Hustler - Current */}
                                <View className="items-center">
                                    <View className="w-20 h-20 rounded-full bg-[#FFD700] items-center justify-center border-4 border-black">
                                        <FontAwesome5 name="briefcase" size={28} color="black" />
                                    </View>
                                    <Text className="text-black font-bold text-sm mt-2">Pro-Hustler</Text>
                                    <Text className="text-black/40 text-xs">20+ Gigs</Text>
                                    <Text className="text-[#FFD700] bg-black px-2 py-0.5 rounded text-[10px] font-bold mt-1">YOU ARE HERE</Text>
                                </View>

                                <View className="w-1 h-8 bg-black/20" />

                                {/* Node 3 - G.O.A.T - Locked */}
                                <View className="items-center opacity-60">
                                    <View className="w-16 h-16 rounded-full bg-white border-2 border-black/20 items-center justify-center">
                                        <FontAwesome5 name="crown" size={22} color="black" />
                                    </View>
                                    <Text className="text-black/40 font-bold text-sm mt-2">G.O.A.T</Text>
                                    <Text className="text-black/20 text-xs">50+ Gigs</Text>
                                    <View className="bg-black/5 px-2 py-0.5 rounded mt-1">
                                        <Text className="text-black/40 text-[10px] font-bold">Instant Withdraw</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Next Unlock */}
                            <View className="bg-white border-2 border-dashed border-black rounded-2xl p-4 mt-6">
                                <View className="flex-row items-center gap-2 mb-2">
                                    <View className="w-8 h-8 rounded-full bg-black items-center justify-center">
                                        <Ionicons name="flash" size={16} color="#FFD700" />
                                    </View>
                                    <Text className="text-black font-bold text-base">Unlock: Instant Withdraw</Text>
                                </View>
                                <Text className="text-black/60 text-sm mb-3">
                                    Reach <Text className="font-bold text-black">G.O.A.T Status</Text> to unlock instant UPI withdrawals directly to your bank account.
                                </Text>
                                <View className="flex-row items-center gap-2">
                                    <View className="flex-1 h-3 bg-black/10 rounded-full overflow-hidden">
                                        <View className="w-[94%] h-full bg-[#FFD700] rounded-full" />
                                    </View>
                                    <Text className="text-black font-bold text-sm">47/50</Text>
                                </View>
                            </View>

                            {/* Upcoming Rewards */}
                            <View className="mt-6 mb-6">
                                <Text className="text-black font-bold text-base mb-4">🎁 Upcoming Rewards</Text>

                                <View className="flex-row gap-3">
                                    <View className="flex-1 bg-white border border-black rounded-2xl p-4 items-center">
                                        <View className="w-12 h-12 rounded-2xl bg-[#FFD700] items-center justify-center mb-2 border border-black">
                                            <Ionicons name="ribbon" size={22} color="black" />
                                        </View>
                                        <Text className="text-black font-semibold text-xs text-center">Elite Badge</Text>
                                        <Text className="text-black/40 text-[10px]">Lvl 45</Text>
                                    </View>

                                    <View className="flex-1 bg-white border border-black rounded-2xl p-4 items-center">
                                        <View className="w-12 h-12 rounded-2xl bg-[#BFFF00] items-center justify-center mb-2 border border-black">
                                            <MaterialCommunityIcons name="cash" size={22} color="black" />
                                        </View>
                                        <Text className="text-black font-semibold text-xs text-center">₹500 Bonus</Text>
                                        <Text className="text-black/40 text-[10px]">Lvl 50</Text>
                                    </View>

                                    <View className="flex-1 bg-white border border-black rounded-2xl p-4 items-center">
                                        <View className="w-12 h-12 rounded-2xl bg-[#FF6B6B] items-center justify-center mb-2 border border-black">
                                            <Ionicons name="star" size={22} color="black" />
                                        </View>
                                        <Text className="text-black font-semibold text-xs text-center">Priority</Text>
                                        <Text className="text-black/40 text-[10px]">Lvl 51</Text>
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
                <View className="flex-1 bg-black/90 justify-end">
                    <Pressable
                        className="absolute inset-0"
                        onPress={() => setShowStats(false)}
                    />

                    <View className="bg-white rounded-t-[32px] px-5 pt-4 pb-10 max-h-[90%] border-t-2 border-black">
                        {/* Handle */}
                        <View className="w-12 h-1.5 bg-black/20 rounded-full self-center mb-6" />

                        {/* Header */}
                        <View className="flex-row justify-between items-start mb-6">
                            <View>
                                <Text className="text-black font-black text-2xl">Hustle Stats</Text>
                                <Text className="text-black/50 text-sm">Performance Report</Text>
                            </View>
                            <TouchableOpacity
                                className="w-10 h-10 rounded-full bg-black items-center justify-center"
                                onPress={() => setShowStats(false)}
                            >
                                <Ionicons name="close" size={22} color="white" />
                            </TouchableOpacity>
                        </View>

                        {/* Motivation Banner */}
                        <View className="bg-[#FF6B6B]/10 border border-[#FF6B6B] rounded-2xl p-4 mb-6">
                            <View className="flex-row items-center gap-3">
                                <Text className="text-3xl">🔥</Text>
                                <View className="flex-1">
                                    <Text className="text-[#FF6B6B] font-bold text-sm">You're on Fire!</Text>
                                    <Text className="text-black/60 text-sm">Top 5% of Hustlers this week!</Text>
                                </View>
                            </View>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Earnings Overview */}
                            <View className="mb-6">
                                <Text className="text-black font-bold text-base mb-4">💰 Earnings Overview</Text>

                                <View className="flex-row gap-3 mb-4">
                                    <View className="flex-1 bg-[#BFFF00] rounded-2xl p-4 border border-black">
                                        <Text className="text-black/60 text-xs">This Month</Text>
                                        <Text className="text-black font-black text-2xl">₹12,500</Text>
                                        <Text className="text-black/40 text-xs mt-1">+27% ↑</Text>
                                    </View>
                                    <View className="flex-1 bg-white border border-black rounded-2xl p-4">
                                        <Text className="text-black/40 text-xs">Last Month</Text>
                                        <Text className="text-black font-bold text-2xl">₹9,800</Text>
                                    </View>
                                </View>

                                {/* Bar Chart */}
                                <View className="bg-white border-2 border-black rounded-2xl p-4">
                                    <Text className="text-black/40 text-xs mb-4">Last 6 Months</Text>
                                    <View className="flex-row items-end justify-between h-24 gap-2">
                                        <View className="flex-1 items-center">
                                            <View className="w-full bg-[#4ECDC4] rounded-t-md" style={{ height: 40 }} />
                                            <Text className="text-[10px] text-black/30 mt-1">Sep</Text>
                                        </View>
                                        <View className="flex-1 items-center">
                                            <View className="w-full bg-[#A78BFA] rounded-t-md" style={{ height: 55 }} />
                                            <Text className="text-[10px] text-black/30 mt-1">Oct</Text>
                                        </View>
                                        <View className="flex-1 items-center">
                                            <View className="w-full bg-[#4ECDC4] rounded-t-md" style={{ height: 45 }} />
                                            <Text className="text-[10px] text-black/30 mt-1">Nov</Text>
                                        </View>
                                        <View className="flex-1 items-center">
                                            <View className="w-full bg-[#FFD700] rounded-t-md border border-black/10" style={{ height: 70 }} />
                                            <Text className="text-[10px] text-black/30 mt-1">Dec</Text>
                                        </View>
                                        <View className="flex-1 items-center">
                                            <View className="w-full bg-[#A78BFA] rounded-t-md" style={{ height: 60 }} />
                                            <Text className="text-[10px] text-black/30 mt-1">Jan</Text>
                                        </View>
                                        <View className="flex-1 items-center">
                                            <View className="w-full bg-[#BFFF00] rounded-t-md border border-black/10" style={{ height: 80 }} />
                                            <Text className="text-[10px] text-black font-bold mt-1">Feb</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Activity Heat Map */}
                            <View className="mb-6">
                                <Text className="text-black font-bold text-base mb-2">📅 Activity Heat Map</Text>
                                <Text className="text-black/30 text-xs mb-4">Most active times this week</Text>

                                <View className="bg-white border-2 border-black rounded-2xl p-4">
                                    <View className="flex-row justify-between mb-2">
                                        <Text className="text-[10px] text-black/30 w-8">Mon</Text>
                                        <View className="flex-1 flex-row gap-1">
                                            <View className="flex-1 h-4 rounded-sm bg-black/5" />
                                            <View className="flex-1 h-4 rounded-sm bg-black/5" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#4ECDC4]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#BFFF00]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#FFD700]" />
                                            <View className="flex-1 h-4 rounded-sm bg-black/5" />
                                        </View>
                                    </View>
                                    <View className="flex-row justify-between mb-2">
                                        <Text className="text-[10px] text-black/30 w-8">Tue</Text>
                                        <View className="flex-1 flex-row gap-1">
                                            <View className="flex-1 h-4 rounded-sm bg-black/5" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#4ECDC4]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#BFFF00]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#BFFF00]" />
                                            <View className="flex-1 h-4 rounded-sm bg-black/5" />
                                            <View className="flex-1 h-4 rounded-sm bg-black/5" />
                                        </View>
                                    </View>
                                    <View className="flex-row justify-between mb-2">
                                        <Text className="text-[10px] text-black/30 w-8">Wed</Text>
                                        <View className="flex-1 flex-row gap-1">
                                            <View className="flex-1 h-4 rounded-sm bg-black/5" />
                                            <View className="flex-1 h-4 rounded-sm bg-black/5" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#FFD700]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#FFD700]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#A78BFA]" />
                                            <View className="flex-1 h-4 rounded-sm bg-black/5" />
                                        </View>
                                    </View>
                                    <View className="flex-row justify-between mb-2">
                                        <Text className="text-[10px] text-black/30 w-8">Thu</Text>
                                        <View className="flex-1 flex-row gap-1">
                                            <View className="flex-1 h-4 rounded-sm bg-black/5" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#BFFF00]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#BFFF00]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#4ECDC4]" />
                                            <View className="flex-1 h-4 rounded-sm bg-black/5" />
                                            <View className="flex-1 h-4 rounded-sm bg-black/5" />
                                        </View>
                                    </View>
                                    <View className="flex-row justify-between mb-2">
                                        <Text className="text-[10px] text-black/30 w-8">Fri</Text>
                                        <View className="flex-1 flex-row gap-1">
                                            <View className="flex-1 h-4 rounded-sm bg-black/5" />
                                            <View className="flex-1 h-4 rounded-sm bg-black/5" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#A78BFA]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#FF6B6B]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#BFFF00]" />
                                            <View className="flex-1 h-4 rounded-sm bg-[#BFFF00]" />
                                        </View>
                                    </View>
                                    <View className="flex-row justify-between">
                                        <Text className="text-[10px] text-black/30 w-8"></Text>
                                        <View className="flex-1 flex-row gap-1">
                                            <Text className="flex-1 text-[8px] text-black/20 text-center">9am</Text>
                                            <Text className="flex-1 text-[8px] text-black/20 text-center">12pm</Text>
                                            <Text className="flex-1 text-[8px] text-black/20 text-center">3pm</Text>
                                            <Text className="flex-1 text-[8px] text-black/20 text-center">6pm</Text>
                                            <Text className="flex-1 text-[8px] text-black/20 text-center">9pm</Text>
                                            <Text className="flex-1 text-[8px] text-black/20 text-center">12am</Text>
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

            {/* Rating & Reviews Modal */}
            <Modal
                visible={showRating}
                transparent
                animationType="fade"
                onRequestClose={() => setShowRating(false)}
            >
                <View className="flex-1 bg-black/90 justify-end">
                    <Pressable
                        className="absolute inset-0"
                        onPress={() => setShowRating(false)}
                    />

                    <View className="bg-white rounded-t-[32px] px-5 pt-4 pb-10 max-h-[90%] border-t-2 border-black">
                        {/* Handle */}
                        <View className="w-12 h-1.5 bg-black/20 rounded-full self-center mb-6" />

                        {/* Header */}
                        <View className="flex-row justify-between items-start mb-6">
                            <View>
                                <Text className="text-black font-black text-2xl">Reviews & Rating</Text>
                                <Text className="text-black/50 text-sm">What clients say about you</Text>
                            </View>
                            <TouchableOpacity
                                className="w-10 h-10 rounded-full bg-black items-center justify-center"
                                onPress={() => setShowRating(false)}
                            >
                                <Ionicons name="close" size={22} color="white" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Overall Rating Card */}
                            <View className="bg-[#FFE600] border-2 border-black rounded-2xl p-5 mb-6 items-center">
                                <View className="flex-row items-center gap-2 mb-2">
                                    <Text className="text-black font-black text-5xl">4.9</Text>
                                    <Ionicons name="star" size={36} color="black" />
                                </View>
                                <Text className="text-black/70 text-sm mb-2">Based on 47 reviews</Text>
                                <View className="flex-row items-center gap-1">
                                    <View className="bg-black px-2 py-1 rounded-md">
                                        <Text className="text-white font-bold text-xs">TOP RATED</Text>
                                    </View>
                                    <Text className="text-black/50 text-xs">Top 5% in Design</Text>
                                </View>
                            </View>

                            {/* Rating Breakdown */}
                            <Text className="text-black font-bold text-base mb-4">⭐ Rating Breakdown</Text>
                            <View className="bg-white border-2 border-black rounded-2xl p-4 mb-6">
                                {[
                                    { stars: 5, count: 38, percentage: 81 },
                                    { stars: 4, count: 7, percentage: 15 },
                                    { stars: 3, count: 2, percentage: 4 },
                                    { stars: 2, count: 0, percentage: 0 },
                                    { stars: 1, count: 0, percentage: 0 },
                                ].map((item) => (
                                    <View key={item.stars} className="flex-row items-center mb-2">
                                        <Text className="text-black font-medium text-sm w-8">{item.stars}★</Text>
                                        <View className="flex-1 h-3 bg-black/10 rounded-full overflow-hidden mx-3">
                                            <View
                                                className="h-full bg-[#FFD700] rounded-full"
                                                style={{ width: `${item.percentage}%` }}
                                            />
                                        </View>
                                        <Text className="text-black/50 text-xs w-8">{item.count}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Performance Badges */}
                            <Text className="text-black font-bold text-base mb-4">🏆 Performance Badges</Text>
                            <View className="flex-row gap-3 mb-6">
                                <View className="flex-1 bg-[#4ECDC4]/20 border border-[#4ECDC4] rounded-2xl p-4 items-center">
                                    <View className="w-12 h-12 rounded-full bg-[#4ECDC4] items-center justify-center mb-2">
                                        <Ionicons name="flash" size={24} color="white" />
                                    </View>
                                    <Text className="text-black font-semibold text-xs text-center">Quick Deliverer</Text>
                                    <Text className="text-black/40 text-[10px]">98% on-time</Text>
                                </View>
                                <View className="flex-1 bg-[#A78BFA]/20 border border-[#A78BFA] rounded-2xl p-4 items-center">
                                    <View className="w-12 h-12 rounded-full bg-[#A78BFA] items-center justify-center mb-2">
                                        <Ionicons name="chatbubbles" size={24} color="white" />
                                    </View>
                                    <Text className="text-black font-semibold text-xs text-center">Great Communicator</Text>
                                    <Text className="text-black/40 text-[10px]">4.9 avg</Text>
                                </View>
                                <View className="flex-1 bg-[#FF6B6B]/20 border border-[#FF6B6B] rounded-2xl p-4 items-center">
                                    <View className="w-12 h-12 rounded-full bg-[#FF6B6B] items-center justify-center mb-2">
                                        <Ionicons name="heart" size={24} color="white" />
                                    </View>
                                    <Text className="text-black font-semibold text-xs text-center">Client Favorite</Text>
                                    <Text className="text-black/40 text-[10px]">96% repeat</Text>
                                </View>
                            </View>

                            {/* Recent Reviews */}
                            <Text className="text-black font-bold text-base mb-4">💬 Recent Reviews</Text>
                            <View className="gap-4 mb-4">
                                {/* Review 1 */}
                                <View className="bg-white border-2 border-black rounded-2xl p-4">
                                    <View className="flex-row items-center justify-between mb-3">
                                        <View className="flex-row items-center gap-3">
                                            <View className="w-10 h-10 rounded-full bg-[#FF6B6B] items-center justify-center">
                                                <Text className="text-white font-bold">RK</Text>
                                            </View>
                                            <View>
                                                <Text className="text-black font-bold text-sm">Rahul K.</Text>
                                                <Text className="text-black/40 text-xs">2 days ago</Text>
                                            </View>
                                        </View>
                                        <View className="flex-row items-center gap-1">
                                            <Text className="text-black font-bold">5</Text>
                                            <Ionicons name="star" size={14} color="#FFD700" />
                                        </View>
                                    </View>
                                    <Text className="text-black/70 text-sm leading-5">
                                        "Absolutely incredible work! Aria understood exactly what I wanted and delivered beyond expectations. Will definitely hire again!"
                                    </Text>
                                    <View className="flex-row items-center gap-2 mt-3">
                                        <View className="bg-[#BFFF00]/30 px-2 py-1 rounded-md">
                                            <Text className="text-black text-xs">Logo Design</Text>
                                        </View>
                                        <View className="bg-black/5 px-2 py-1 rounded-md">
                                            <Text className="text-black/60 text-xs">₹2,500</Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Review 2 */}
                                <View className="bg-white border-2 border-black rounded-2xl p-4">
                                    <View className="flex-row items-center justify-between mb-3">
                                        <View className="flex-row items-center gap-3">
                                            <View className="w-10 h-10 rounded-full bg-[#4ECDC4] items-center justify-center">
                                                <Text className="text-white font-bold">PS</Text>
                                            </View>
                                            <View>
                                                <Text className="text-black font-bold text-sm">Priya S.</Text>
                                                <Text className="text-black/40 text-xs">1 week ago</Text>
                                            </View>
                                        </View>
                                        <View className="flex-row items-center gap-1">
                                            <Text className="text-black font-bold">5</Text>
                                            <Ionicons name="star" size={14} color="#FFD700" />
                                        </View>
                                    </View>
                                    <Text className="text-black/70 text-sm leading-5">
                                        "Super fast delivery and great communication throughout the project. The poster design was exactly what we needed for our event."
                                    </Text>
                                    <View className="flex-row items-center gap-2 mt-3">
                                        <View className="bg-[#A78BFA]/30 px-2 py-1 rounded-md">
                                            <Text className="text-black text-xs">Event Poster</Text>
                                        </View>
                                        <View className="bg-black/5 px-2 py-1 rounded-md">
                                            <Text className="text-black/60 text-xs">₹1,800</Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Review 3 */}
                                <View className="bg-white border-2 border-black rounded-2xl p-4">
                                    <View className="flex-row items-center justify-between mb-3">
                                        <View className="flex-row items-center gap-3">
                                            <View className="w-10 h-10 rounded-full bg-[#FFD700] items-center justify-center">
                                                <Text className="text-black font-bold">AM</Text>
                                            </View>
                                            <View>
                                                <Text className="text-black font-bold text-sm">Amit M.</Text>
                                                <Text className="text-black/40 text-xs">2 weeks ago</Text>
                                            </View>
                                        </View>
                                        <View className="flex-row items-center gap-1">
                                            <Text className="text-black font-bold">4</Text>
                                            <Ionicons name="star" size={14} color="#FFD700" />
                                        </View>
                                    </View>
                                    <Text className="text-black/70 text-sm leading-5">
                                        "Good work overall. Took a couple of revisions but the final result was great. Professional and patient."
                                    </Text>
                                    <View className="flex-row items-center gap-2 mt-3">
                                        <View className="bg-[#FF6B6B]/30 px-2 py-1 rounded-md">
                                            <Text className="text-black text-xs">Social Media</Text>
                                        </View>
                                        <View className="bg-black/5 px-2 py-1 rounded-md">
                                            <Text className="text-black/60 text-xs">₹3,200</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* View All Reviews Button */}
                            <TouchableOpacity className="bg-black rounded-2xl py-4 flex-row items-center justify-center gap-2 mb-4">
                                <Text className="text-white font-bold text-sm">View All 47 Reviews</Text>
                                <Ionicons name="arrow-forward" size={18} color="white" />
                            </TouchableOpacity>
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
