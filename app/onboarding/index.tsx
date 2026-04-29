import React, { useState, useRef } from 'react';
import { View, Text, Dimensions, TouchableOpacity, FlatList, ViewToken } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useOAuth, useAuth as useClerkAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export const useWarmUpBrowser = () => {
    useEffect(() => {
        void WebBrowser.warmUpAsync();
        return () => { void WebBrowser.coolDownAsync(); };
    }, []);
};

WebBrowser.maybeCompleteAuthSession();

const { width, height } = Dimensions.get('window');

const SLIDES = [
    {
        id: '1',
        lottie: require('../../assets/lottie/City Skyline Building.json'),
        tag: 'THE PROBLEM',
        title: 'Talent Lost\nIn The Noise',
        subtitle: 'Students have skills. Clients need work done.\nBut they can\'t find each other.',
        bg: '#FFFFFF',
        textColor: '#000000',
        accent: '#FFD600',
    },
    {
        id: '2',
        lottie: require('../../assets/lottie/Developer 01 - Whoooa!.json'),
        tag: 'THE SOLUTION',
        title: 'KaarYA\nConnects You',
        subtitle: 'Post a gig. Find skilled students.\nGet work done. Get paid. Simple.',
        bg: '#FFD600',
        textColor: '#000000',
        accent: '#000000',
    },
    {
        id: '3',
        lottie: require('../../assets/lottie/Man and Woman say Hi !.json'),
        tag: 'YOUR MOVE',
        title: 'Join The\nHustle',
        subtitle: 'Verified students. Real ratings.\nSecure payments. Zero noise.',
        bg: '#000000',
        textColor: '#FFFFFF',
        accent: '#FFD600',
    },
];

export default function OnboardingIndex() {
    const router = useRouter();
    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
    const { user } = useAuth();
    const { isSignedIn } = useClerkAuth();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    useWarmUpBrowser();

    // If already signed in, don't show onboarding — layout will redirect,
    // but also add an immediate push so there's zero flicker/loop.
    useEffect(() => {
        if (isSignedIn || user) {
            router.replace('/onboarding/skills');
        }
    }, [isSignedIn, user]);

    const handleGoogleSignIn = React.useCallback(async () => {
        // Guard: if already signed in, just navigate forward — never re-trigger OAuth
        if (isSignedIn || user) {
            router.replace('/onboarding/skills');
            return;
        }

        try {
            setIsAuthenticating(true);
            const { createdSessionId, setActive } = await startOAuthFlow({
                redirectUrl: Linking.createURL('/onboarding/skills', { scheme: 'com.kaarya.studentmarketplace' }),
            });

            if (createdSessionId && setActive) {
                await setActive({ session: createdSessionId });
                router.replace('/onboarding/skills');
            }
        } catch (err: any) {
            // Silently handle "already signed in" — Clerk throws this if session exists
            if (err?.errors?.[0]?.code === 'session_exists' || isSignedIn) {
                router.replace('/onboarding/skills');
            } else {
                console.error('OAuth error', err);
            }
        } finally {
            setIsAuthenticating(false);
        }
    }, [startOAuthFlow, router, isSignedIn, user]);

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0 && viewableItems[0].index !== null) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const isLastSlide = currentIndex === SLIDES.length - 1;

    const handleNext = () => {
        if (currentIndex < SLIDES.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
        }
    };

    const renderSlide = ({ item, index }: { item: typeof SLIDES[0]; index: number }) => (
        <View style={{ width, height: '100%', backgroundColor: item.bg }} className="justify-between">
            <StatusBar style={item.textColor === '#FFFFFF' ? 'light' : 'dark'} />

            {/* Top: Tag + Title */}
            <View className="px-8 pt-20 z-10">
                <View
                    style={{ backgroundColor: item.accent, alignSelf: 'flex-start' }}
                    className="px-4 py-1.5 rounded-full mb-4"
                >
                    <Text style={{ color: item.accent === '#000000' ? '#FFD600' : '#000' }} className="text-[10px] font-black uppercase tracking-[3px]">
                        {item.tag}
                    </Text>
                </View>

                <Text
                    style={{ color: item.textColor }}
                    className="text-5xl font-black uppercase tracking-tight leading-[1]"
                >
                    {item.title}
                </Text>

                <Text
                    style={{ color: item.textColor, opacity: 0.6 }}
                    className="text-sm font-medium mt-4 leading-5"
                >
                    {item.subtitle}
                </Text>
            </View>

            {/* Center: Lottie */}
            <View className="flex-1 items-center justify-center" style={{ marginTop: -20 }}>
                <LottieView
                    source={item.lottie}
                    autoPlay
                    loop
                    resizeMode="contain"
                    style={{ width: width * 0.85, height: width * 0.85 }}
                />
            </View>
        </View>
    );

    const activeSlide = SLIDES[currentIndex];

    return (
        <View style={{ flex: 1, backgroundColor: activeSlide.bg }}>
            {/* Swipeable Slides */}
            <FlatList
                ref={flatListRef}
                data={SLIDES}
                renderItem={renderSlide}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                bounces={false}
                style={{ flex: 1 }}
            />

            {/* Bottom Controls — fixed overlay */}
            <View
                style={{ backgroundColor: activeSlide.bg }}
                className="absolute bottom-0 left-0 right-0 pb-12 pt-6 px-8"
            >
                {/* Dots */}
                <View className="flex-row justify-center items-center gap-2 mb-6">
                    {SLIDES.map((_, idx) => (
                        <View
                            key={idx}
                            style={{
                                width: idx === currentIndex ? 32 : 8,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: idx === currentIndex
                                    ? activeSlide.accent
                                    : (activeSlide.textColor === '#FFFFFF' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'),
                            }}
                        />
                    ))}
                </View>

                {/* Button: Next or Sign In */}
                {isLastSlide ? (
                    <TouchableOpacity
                        onPress={handleGoogleSignIn}
                        disabled={isAuthenticating}
                        className="w-full py-5 rounded-2xl flex-row justify-center items-center"
                        style={{ backgroundColor: activeSlide.accent }}
                    >
                        <MaterialCommunityIcons
                            name="google"
                            size={22}
                            color={activeSlide.accent === '#000000' ? '#FFD600' : '#000'}
                            style={{ marginRight: 10 }}
                        />
                        <Text
                            style={{ color: activeSlide.accent === '#000000' ? '#FFD600' : '#000' }}
                            className="font-black text-lg uppercase tracking-tight"
                        >
                            {isAuthenticating ? 'Signing in...' : 'Continue with Google'}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={handleNext}
                        className="w-full py-5 rounded-2xl items-center"
                        style={{ backgroundColor: activeSlide.accent }}
                    >
                        <Text
                            style={{ color: activeSlide.accent === '#000000' ? '#FFD600' : '#000' }}
                            className="font-black text-lg uppercase tracking-tight"
                        >
                            Next
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
