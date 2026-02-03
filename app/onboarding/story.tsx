import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StatusBar as RNStatusBar, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutUp, ZoomIn, ZoomOut } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const SCENES = [
    {
        // 1. City Skyline
        source: require('../../assets/lottie/City Skyline Building.json'),
        title: "THE CHAOS",
        text: "In a world screaming for attention,\ntalent gets lost in the noise.\nEveryone hustling, no one connecting.",
        bg: "#FFFFFF",
        textColor: "#000000",
        accent: "#FFEE00"
    },
    {
        // 2. Waiting
        source: require('../../assets/lottie/Waiting.json'),
        title: "THE WAIT",
        text: "So we wait.\nBuilders waiting for blueprints.\nDreamers waiting for doers.\nTime ticking away.",
        bg: "#FFFFFF",
        textColor: "#000000",
        accent: "#FFD600"
    },
    {
        // 3. Login
        source: require('../../assets/lottie/Login Character Animation.json'),
        title: "ENTER KAARYA",
        text: "Stop waiting. Start doing.\nYour gateway to the new economy.\nInstant access to a world of work.",
        bg: "#FFD600",
        textColor: "#000000",
        accent: "#000000"
    },
    {
        // 4. Rating
        source: require('../../assets/lottie/Rating Character Animation.json'),
        title: "TRUST EARNED",
        text: "Merit is the only currency here.\nVerified skills. Real ratings.\nExcellence recognized instantly.",
        bg: "#000000",
        textColor: "#FFFFFF",
        accent: "#4ADE80" // Green for rating
    },
    {
        // 5. Developer
        source: require('../../assets/lottie/Developer 01 - Whoooa!.json'),
        title: "THE THRILL",
        text: "Work finds you.\nThe joy of the perfect gig.\nThe freedom to build what matters.",
        bg: "#FFFFFF",
        textColor: "#000000",
        accent: "#3B82F6" // Blue for tech/dev
    },
    {
        // 6. Man and Woman
        source: require('../../assets/lottie/Man and Woman say Hi !.json'),
        title: "YOUR TRIBE",
        text: "Collaborate. Connect. Create.\nSay hello to your future.\nThis is KaarYA.",
        bg: "#FFD600",
        textColor: "#000000",
        accent: "#000000"
    }
];

export default function OnboardingStory() {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const lottieRef = useRef<LottieView>(null);

    const activeScene = SCENES[currentIndex];

    // Auto-advance logic handled by onAnimationFinish
    const handleAnimationFinish = () => {
        if (currentIndex < SCENES.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // End of story
            router.replace('/(tabs)');
        }
    };

    // Manual skip
    const handleSkip = () => {
        router.replace('/(tabs)');
    };

    const handlePressIn = () => {
        lottieRef.current?.pause();
    };

    const handlePressOut = () => {
        lottieRef.current?.resume();
    };

    return (
        <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={{ flex: 1, backgroundColor: activeScene.bg }}
        >
            <StatusBar style={activeScene.textColor === '#FFFFFF' ? 'light' : 'dark'} />

            {/* Safe Area Padding for content */}
            <View className="flex-1 w-full relative justify-between py-12">

                {/* Header: Bars */}
                <View className="px-6 pt-8 flex-row justify-between items-center z-50">
                    <View className="flex-row gap-1">
                        {SCENES.map((_, idx) => (
                            <View
                                key={idx}
                                style={{
                                    width: width / SCENES.length - 12,
                                    height: 4,
                                    backgroundColor: idx <= currentIndex ? activeScene.accent : (activeScene.textColor === '#FFFFFF' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'),
                                    borderRadius: 2
                                }}
                            />
                        ))}
                    </View>
                </View>

                {/* Skip Button - Positioned Below Bars */}
                <TouchableOpacity
                    onPress={handleSkip}
                    className="absolute top-24 right-6 z-50 py-2 px-4"
                >
                    <Text style={{ color: activeScene.textColor, opacity: 0.5 }} className="font-display uppercase text-xs tracking-widest">
                        Skip
                    </Text>
                </TouchableOpacity>

                {/* Main Content Area - Pushed Up */}
                <View className="flex-1 justify-start items-center relative pt-32">
                    {/* Animated Lottie */}
                    <Animated.View
                        key={`anim-${currentIndex}`}
                        entering={FadeIn.duration(600)}
                        exiting={FadeOut.duration(400)}
                        style={{ width: width, height: width, alignItems: 'center', justifyContent: 'center', marginTop: currentIndex === 0 ? -height * 0.10 : 0 }}
                    >
                        <LottieView
                            ref={lottieRef}
                            source={activeScene.source}
                            autoPlay
                            loop={false}
                            resizeMode="contain"
                            style={{ width: width, height: width * 1.2 }} // Slightly larger to ensure full width fit
                            onAnimationFinish={handleAnimationFinish}
                            speed={(currentIndex === 1 || currentIndex === 2) ? 0.5 : 1}
                        />
                    </Animated.View>

                    {/* Text Overlay */}
                    <View className="absolute bottom-10 w-full px-8 pointer-events-none">
                        <Animated.View
                            key={`text-${currentIndex}`}
                            entering={SlideInDown.duration(600).springify()}
                        // exiting={SlideOutUp.duration(400)} // Sometimes simpler is better for transitions
                        >
                            <Text
                                style={{ color: activeScene.accent }}
                                className="font-display text-lg tracking-[4px] uppercase mb-2 font-bold"
                            >
                                {activeScene.title}
                            </Text>
                            <Text
                                style={{ color: activeScene.textColor }}
                                className="font-display text-4xl leading-[1.1] uppercase font-bold"
                            >
                                {activeScene.text}
                            </Text>
                        </Animated.View>
                    </View>
                </View>

            </View>
        </Pressable>
    );
}
