import React, { useState, useMemo } from "react";
import {
    View,
    Text,
    Pressable,
    ScrollView,
    SafeAreaView,
    StatusBar,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    FadeInDown,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CATEGORY_NAMES: Record<string, { label: string; sub: string }> = {
    design: { label: "Graphic Design", sub: "Logo & Brand Identity" },
    video: { label: "Video Editing", sub: "Content & Motion" },
    code: { label: "Development", sub: "Web & Mobile Apps" },
    marketing: { label: "Marketing", sub: "Social & Digital" },
    writing: { label: "Writing", sub: "Content & Copy" },
    other: { label: "Other", sub: "Miscellaneous" },
};

export default function ReviewScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const buttonScale = useSharedValue(1);

    // Parse params
    const category = params.category as string;
    const title = params.title as string;
    const amount = params.amount as string;
    const deadline = params.deadline as string;
    const paymentType = params.paymentType as string;

    // Parse files
    const files = useMemo(() => {
        try {
            return JSON.parse((params.files as string) || "[]");
        } catch {
            return [];
        }
    }, [params.files]);

    // Generate manifest ID
    const manifestId = useMemo(() => {
        return `#KY-${Math.floor(1000 + Math.random() * 9000)}`;
    }, []);

    // Format deadline
    const formattedDeadline = useMemo(() => {
        if (!deadline) return "Not set";
        const date = new Date(deadline);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }, [deadline]);

    const categoryInfo = CATEGORY_NAMES[category] || CATEGORY_NAMES.other;

    const handleBlastLive = () => {
        if (agreedToTerms) {
            router.push("/post-gig/success");
        }
    };

    const buttonAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }],
    }));

    const handleButtonPressIn = () => {
        buttonScale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
    };

    const handleButtonPressOut = () => {
        buttonScale.value = withSpring(1, { damping: 15, stiffness: 400 });
    };

    const SectionHeader = ({
        title,
        onEdit,
    }: {
        title: string;
        onEdit?: () => void;
    }) => (
        <View className="flex-row items-center justify-between mb-2">
            <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {title}
            </Text>
            {onEdit && (
                <Pressable
                    onPress={onEdit}
                    className="bg-[#D4FF00] px-3 py-1 rounded"
                >
                    <Text className="text-xs font-bold text-black">EDIT</Text>
                </Pressable>
            )}
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#F4E500]">
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Header */}
            <View className="flex-row items-center justify-center px-5 py-4 bg-white">
                <Pressable
                    onPress={() => router.back()}
                    className="absolute left-5 p-2"
                >
                    <Feather name="arrow-left" size={24} color="#000" />
                </Pressable>
                <Text className="text-lg font-black tracking-tight">FINAL REVIEW</Text>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 160 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Summary Card */}
                <Animated.View
                    entering={FadeInDown.delay(100).springify()}
                    className="mx-4 mt-4 bg-white rounded-3xl overflow-hidden border-2 border-black"
                >
                    {/* Manifest ID */}
                    <View className="px-5 py-4 flex-row items-center justify-between">
                        <View>
                            <Text className="text-xs text-gray-500 uppercase font-medium">
                                MANIFEST ID
                            </Text>
                            <Text className="text-xl font-black text-black mt-1">
                                {manifestId}
                            </Text>
                        </View>
                        <View className="w-10 h-10 rounded-lg border-2 border-black items-center justify-center">
                            <Feather name="copy" size={18} color="#000" />
                        </View>
                    </View>

                    {/* Dotted Separator */}
                    <View className="mx-5 border-t border-dashed border-gray-300" />

                    {/* Category Section */}
                    <View className="px-5 py-4">
                        <SectionHeader
                            title="CATEGORY"
                            onEdit={() => router.push("/post-gig")}
                        />
                        <Text className="text-lg font-bold text-black">
                            {categoryInfo.label}
                        </Text>
                        <Text className="text-sm text-gray-500">{categoryInfo.sub}</Text>
                    </View>

                    {/* Dotted Separator */}
                    <View className="mx-5 border-t border-dashed border-gray-300" />

                    {/* Gig Details Section */}
                    <View className="px-5 py-4">
                        <SectionHeader
                            title="GIG DETAILS"
                            onEdit={() => router.push("/post-gig/details")}
                        />
                        <View className="flex-row mt-2">
                            <View className="flex-1">
                                <Text className="text-xs text-gray-500">Type</Text>
                                <Text className="text-sm font-bold text-black mt-1">
                                    One-time Project
                                </Text>
                            </View>
                            <View className="flex-1">
                                <Text className="text-xs text-gray-500">Deadline</Text>
                                <Text className="text-sm font-bold text-black mt-1">
                                    {formattedDeadline}
                                </Text>
                            </View>
                        </View>
                        <View className="flex-row mt-4">
                            <View className="flex-1">
                                <Text className="text-xs text-gray-500">Location</Text>
                                <Text className="text-sm font-bold text-black mt-1">Remote</Text>
                            </View>
                            <View className="flex-1">
                                <Text className="text-xs text-gray-500">Visibility</Text>
                                <View className="flex-row items-center mt-1">
                                    <Feather name="globe" size={14} color="#000" />
                                    <Text className="text-sm font-bold text-black ml-1">
                                        Public
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Dotted Separator */}
                    <View className="mx-5 border-t border-dashed border-gray-300" />

                    {/* Budget Section */}
                    <View className="px-5 py-4">
                        <SectionHeader
                            title="TOTAL BUDGET"
                            onEdit={() => router.push("/post-gig/budget")}
                        />
                        <Text className="text-3xl font-black text-black mt-1">
                            ₹{parseInt(amount || "0").toLocaleString()}{" "}
                            <Text className="text-sm font-normal text-gray-500">INR</Text>
                        </Text>
                        <View className="flex-row items-center mt-2">
                            <Feather name="credit-card" size={14} color="#666" />
                            <Text className="text-sm text-gray-500 ml-2">Via UPI / GPay</Text>
                        </View>
                    </View>

                    {/* Dotted Separator */}
                    <View className="mx-5 border-t border-dashed border-gray-300" />

                    {/* Attachments Section */}
                    <View className="px-5 py-4">
                        <SectionHeader
                            title="ATTACHMENTS"
                            onEdit={() => router.push("/post-gig/attachments")}
                        />
                        {files.length > 0 ? (
                            files.map((file: any, index: number) => (
                                <View
                                    key={index}
                                    className="flex-row items-center mt-3 bg-gray-50 rounded-xl p-3"
                                >
                                    <View className="w-10 h-10 rounded-lg bg-white border border-gray-200 items-center justify-center">
                                        <Feather name="file-text" size={18} color="#666" />
                                    </View>
                                    <View className="ml-3 flex-1">
                                        <Text className="text-sm font-medium text-black">
                                            {file.name}
                                        </Text>
                                        <Text className="text-xs text-gray-400">{file.size}</Text>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <Text className="text-sm text-gray-400 mt-2">
                                No attachments added
                            </Text>
                        )}
                    </View>

                    {/* Dotted Pattern at Bottom */}
                    <View className="flex-row justify-center py-2">
                        {[...Array(20)].map((_, i) => (
                            <View
                                key={i}
                                className="w-1.5 h-1.5 rounded-full bg-gray-300 mx-1"
                            />
                        ))}
                    </View>
                </Animated.View>
            </ScrollView>

            {/* Bottom Section with Terms & CTA */}
            <View className="absolute bottom-0 left-0 right-0 bg-white px-6 pb-8 pt-4 border-t border-gray-100">
                {/* Terms Checkbox */}
                <Pressable
                    onPress={() => setAgreedToTerms(!agreedToTerms)}
                    className="flex-row items-start mb-4"
                >
                    <View
                        className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${agreedToTerms ? "bg-black border-black" : "border-gray-400"
                            }`}
                    >
                        {agreedToTerms && (
                            <Feather name="check" size={12} color="#FFF" />
                        )}
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm font-bold text-black">
                            I agree to the Terms & Conditions
                        </Text>
                        <Text className="text-xs text-gray-500 mt-1">
                            By posting, you agree to Karya's community guidelines and payment
                            policy.
                        </Text>
                    </View>
                </Pressable>

                {/* Blast It Live Button */}
                <AnimatedPressable
                    onPress={handleBlastLive}
                    onPressIn={handleButtonPressIn}
                    onPressOut={handleButtonPressOut}
                    disabled={!agreedToTerms}
                    style={[buttonAnimatedStyle]}
                    className={`
            py-5 rounded-full flex-row items-center justify-center
            ${agreedToTerms ? "bg-black" : "bg-gray-300"}
          `}
                >
                    <Text
                        className={`text-lg font-bold tracking-wide mr-2 ${agreedToTerms ? "text-[#D4FF00]" : "text-gray-500"
                            }`}
                    >
                        BLAST IT LIVE
                    </Text>
                    <Text className="text-xl">🚀</Text>
                </AnimatedPressable>
            </View>
        </SafeAreaView>
    );
}
