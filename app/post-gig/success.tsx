import React, { useEffect } from "react";
import {
    View,
    Text,
    Pressable,
    SafeAreaView,
    StatusBar,
    Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withDelay,
    withSequence,
    withTiming,
    FadeIn,
    FadeInDown,
    FadeInUp,
    ZoomIn,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const { width } = Dimensions.get("window");

export default function SuccessScreen() {
    const router = useRouter();
    const buttonScale = useSharedValue(1);

    // Floating animations for decorative elements
    const starRotation = useSharedValue(0);
    const floatY1 = useSharedValue(0);
    const floatY2 = useSharedValue(0);

    useEffect(() => {
        // Continuous floating animation
        floatY1.value = withSequence(
            withTiming(-10, { duration: 1500 }),
            withTiming(10, { duration: 1500 }),
        );
        floatY2.value = withSequence(
            withTiming(10, { duration: 1800 }),
            withTiming(-10, { duration: 1800 }),
        );
    }, []);

    const handleViewGig = () => {
        router.replace("/(tabs)");
    };

    const handleDone = () => {
        router.replace("/(tabs)");
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

    const float1Style = useAnimatedStyle(() => ({
        transform: [{ translateY: floatY1.value }],
    }));

    const float2Style = useAnimatedStyle(() => ({
        transform: [{ translateY: floatY2.value }],
    }));

    return (
        <SafeAreaView className="flex-1 bg-[#D4FF00]">
            <StatusBar barStyle="dark-content" backgroundColor="#D4FF00" />

            <View className="flex-1 items-center justify-center px-6">
                {/* Decorative Elements */}

                {/* Star - Top Left */}
                <Animated.View
                    entering={FadeIn.delay(500).springify()}
                    style={[float1Style]}
                    className="absolute top-20 left-6"
                >
                    <View className="w-12 h-12">
                        <MaterialCommunityIcons name="star-four-points" size={48} color="#000" />
                    </View>
                </Animated.View>

                {/* Lightning - Top Right */}
                <Animated.View
                    entering={FadeIn.delay(600).springify()}
                    style={[float2Style]}
                    className="absolute top-16 right-6"
                >
                    <View className="w-14 h-14 rounded-full border-2 border-black bg-white items-center justify-center">
                        <Feather name="zap" size={24} color="#000" />
                    </View>
                </Animated.View>

                {/* Thumbs Up - Left */}
                <Animated.View
                    entering={FadeIn.delay(700).springify()}
                    style={[float2Style]}
                    className="absolute top-1/3 left-4"
                >
                    <View className="w-10 h-10 border-2 border-black bg-white items-center justify-center">
                        <Feather name="thumbs-up" size={20} color="#000" />
                    </View>
                </Animated.View>

                {/* Diamond - Bottom Right */}
                <Animated.View
                    entering={FadeIn.delay(800).springify()}
                    style={[float1Style]}
                    className="absolute bottom-48 right-8"
                >
                    <View className="w-10 h-10 items-center justify-center opacity-40">
                        <MaterialCommunityIcons name="shape-outline" size={40} color="#000" />
                    </View>
                </Animated.View>

                {/* Gear - Right */}
                <Animated.View
                    entering={FadeIn.delay(900).springify()}
                    style={[float2Style]}
                    className="absolute bottom-64 left-10 opacity-30"
                >
                    <Feather name="settings" size={36} color="#000" />
                </Animated.View>

                {/* Center Circle Indicator */}
                <Animated.View
                    entering={FadeInDown.delay(100).springify()}
                    className="w-6 h-6 rounded-full bg-white border-2 border-black mb-6"
                />

                {/* Main Success Icon */}
                <Animated.View
                    entering={ZoomIn.delay(200).springify()}
                    className="w-44 h-44 rounded-3xl bg-[#1A1A1A] items-center justify-center mb-8"
                    style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 10 },
                        shadowOpacity: 0.3,
                        shadowRadius: 20,
                        elevation: 10,
                    }}
                >
                    {/* Fire Emoji with Checkmark */}
                    <Text className="text-7xl">🔥</Text>
                    <View className="absolute bottom-6 w-8 h-8 rounded-full bg-black items-center justify-center">
                        <Feather name="check" size={18} color="#D4FF00" />
                    </View>
                </Animated.View>

                {/* Success Text */}
                <Animated.View entering={FadeInUp.delay(400).springify()}>
                    <Text className="text-5xl font-black text-black text-center">
                        HUSTLE
                    </Text>
                    <Text className="text-5xl font-black text-black text-center">
                        IS LIVE!
                    </Text>
                </Animated.View>

                {/* Subtitle */}
                <Animated.View
                    entering={FadeInUp.delay(500).springify()}
                    className="flex-row items-center mt-4"
                >
                    <Text className="text-base text-gray-700 text-center">
                        Sit back, applications are
                    </Text>
                </Animated.View>
                <Animated.View
                    entering={FadeInUp.delay(550).springify()}
                    className="flex-row items-center mt-1"
                >
                    <View className="w-4 h-4 mr-2">
                        <MaterialCommunityIcons name="rhombus-outline" size={16} color="#666" />
                    </View>
                    <Text className="text-base text-gray-700 text-center">
                        incoming.
                    </Text>
                </Animated.View>
            </View>

            {/* Bottom Buttons */}
            <View className="px-6 pb-8">
                {/* View Gig Button */}
                <Animated.View entering={FadeInUp.delay(600).springify()}>
                    <AnimatedPressable
                        onPress={handleViewGig}
                        onPressIn={handleButtonPressIn}
                        onPressOut={handleButtonPressOut}
                        style={[buttonAnimatedStyle]}
                        className="py-5 rounded-full flex-row items-center justify-center bg-black mb-3"
                    >
                        <Text className="text-white text-lg font-bold tracking-wide mr-2">
                            VIEW GIG
                        </Text>
                        <Feather name="arrow-right" size={20} color="#FFFFFF" />
                    </AnimatedPressable>
                </Animated.View>

                {/* Done Button */}
                <Animated.View entering={FadeInUp.delay(700).springify()}>
                    <AnimatedPressable
                        onPress={handleDone}
                        className="py-5 rounded-full flex-row items-center justify-center bg-[#D4FF00] border-2 border-black"
                    >
                        <Text className="text-black text-lg font-bold tracking-wide">
                            DONE
                        </Text>
                    </AnimatedPressable>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
}
