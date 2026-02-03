import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    SafeAreaView,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    FadeInDown,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SUGGESTED_SKILLS: Record<string, string[]> = {
    design: ["Logo Design", "Branding", "Illustration", "UI/UX", "Poster"],
    video: ["Video Editing", "Motion Graphics", "Color Grading", "Thumbnail", "Reels"],
    code: ["Web Dev", "Mobile App", "Backend", "Frontend", "API"],
    marketing: ["Social Media", "SEO", "Content", "Ads", "Strategy"],
    writing: ["Copywriting", "Blog", "Script", "Technical", "Creative"],
    other: ["Virtual Assistant", "Data Entry", "Research", "Translation"],
};

export default function GigDetailsScreen() {
    const router = useRouter();
    const { category } = useLocalSearchParams<{ category: string }>();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

    const buttonScale = useSharedValue(1);

    const suggestedSkills = SUGGESTED_SKILLS[category || "other"] || SUGGESTED_SKILLS.other;

    const isFormValid = title.length >= 10 && description.length >= 30;

    const toggleSkill = (skill: string) => {
        setSelectedSkills((prev) =>
            prev.includes(skill)
                ? prev.filter((s) => s !== skill)
                : prev.length < 5
                    ? [...prev, skill]
                    : prev
        );
    };

    const handleNext = () => {
        if (isFormValid) {
            router.push({
                pathname: "/post-gig/budget",
                params: {
                    category,
                    title,
                    description,
                    skills: selectedSkills.join(","),
                },
            });
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

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Header */}
            <View className="flex-row items-center justify-between px-5 py-4 bg-white border-b border-gray-100">
                <Pressable
                    onPress={() => router.back()}
                    className="w-12 h-12 rounded-full border-2 border-black items-center justify-center"
                >
                    <Feather name="arrow-left" size={20} color="#000" />
                </Pressable>
                <Text className="text-lg font-black italic tracking-tight">STEP 2/5</Text>
                <View className="w-12" />
            </View>

            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                {/* Yellow Header Section */}
                <View className="bg-[#D4FF00] px-6 py-8">
                    <Animated.View entering={FadeInDown.delay(100).springify()}>
                        <Text className="text-3xl font-black text-black">
                            What's the Gig?
                        </Text>
                        <Text className="text-base text-gray-700 mt-2">
                            Tell us what you need done. Be specific!
                        </Text>
                    </Animated.View>
                </View>

                <ScrollView
                    className="flex-1 bg-white"
                    contentContainerStyle={{ paddingBottom: 120 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="p-6 space-y-6">
                        {/* Gig Title */}
                        <Animated.View
                            entering={FadeInDown.delay(150).springify()}
                            style={{ marginBottom: 24 }}
                        >
                            <Text className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                                GIG TITLE
                            </Text>
                            <View className="bg-white border-2 border-black rounded-2xl px-4 py-4">
                                <TextInput
                                    value={title}
                                    onChangeText={setTitle}
                                    placeholder="e.g., Design a logo for my startup"
                                    placeholderTextColor="#9CA3AF"
                                    className="text-lg text-black"
                                    maxLength={80}
                                />
                            </View>
                            <Text className="text-xs text-gray-400 mt-2 text-right">
                                {title.length}/80
                            </Text>
                        </Animated.View>

                        {/* Description */}
                        <Animated.View
                            entering={FadeInDown.delay(200).springify()}
                            style={{ marginBottom: 24 }}
                        >
                            <Text className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                                DESCRIPTION
                            </Text>
                            <View className="bg-white border-2 border-black rounded-2xl px-4 py-4">
                                <TextInput
                                    value={description}
                                    onChangeText={setDescription}
                                    placeholder="Describe the work in detail. What deliverables are you expecting?"
                                    placeholderTextColor="#9CA3AF"
                                    className="text-base text-black"
                                    multiline
                                    numberOfLines={5}
                                    textAlignVertical="top"
                                    style={{ minHeight: 120 }}
                                />
                            </View>
                            <Text className="text-xs text-gray-400 mt-2 text-right">
                                Min 30 characters ({description.length}/30)
                            </Text>
                        </Animated.View>

                        {/* Skills */}
                        <Animated.View
                            entering={FadeInDown.delay(250).springify()}
                        >
                            <Text className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                                SKILLS NEEDED (Select up to 5)
                            </Text>
                            <View className="flex-row flex-wrap">
                                {suggestedSkills.map((skill, index) => (
                                    <Pressable
                                        key={skill}
                                        onPress={() => toggleSkill(skill)}
                                        className={`
                      px-4 py-2 rounded-full mr-2 mb-3 border-2
                      ${selectedSkills.includes(skill)
                                                ? "bg-[#D4FF00] border-black"
                                                : "bg-white border-gray-300"
                                            }
                    `}
                                    >
                                        <Text
                                            className={`text-sm font-medium ${selectedSkills.includes(skill)
                                                    ? "text-black"
                                                    : "text-gray-600"
                                                }`}
                                        >
                                            #{skill}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </Animated.View>
                    </View>
                </ScrollView>

                {/* Bottom CTA */}
                <View className="absolute bottom-0 left-0 right-0 bg-white px-6 pb-8 pt-4 border-t border-gray-100">
                    <AnimatedPressable
                        onPress={handleNext}
                        onPressIn={handleButtonPressIn}
                        onPressOut={handleButtonPressOut}
                        disabled={!isFormValid}
                        style={[buttonAnimatedStyle]}
                        className={`
              py-5 rounded-full flex-row items-center justify-center
              ${isFormValid ? "bg-black" : "bg-gray-300"}
            `}
                    >
                        <Text className="text-white text-lg font-bold tracking-wide mr-2">
                            NEXT STEP
                        </Text>
                        <Feather name="arrow-right" size={20} color="#FFFFFF" />
                    </AnimatedPressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
