import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useOAuth, useAuth as useClerkAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useAuth } from '../context/AuthContext';

export const useWarmUpBrowser = () => {
    useEffect(() => {
        void WebBrowser.warmUpAsync();
        return () => { void WebBrowser.coolDownAsync(); };
    }, []);
};

WebBrowser.maybeCompleteAuthSession();

const { width, height } = Dimensions.get('window');

export default function OnboardingSimplified() {
    const router = useRouter();
    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
    const { user } = useAuth();
    const { isSignedIn } = useClerkAuth();
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    useWarmUpBrowser();

    useEffect(() => {
        if (isSignedIn || user) {
            router.replace('/(tabs)');
        }
    }, [isSignedIn, user]);

    const handleGoogleSignIn = React.useCallback(async () => {
        if (isSignedIn || user) {
            router.replace('/(tabs)');
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
            if (err?.errors?.[0]?.code === 'session_exists' || isSignedIn) {
                router.replace('/(tabs)');
            } else {
                console.error('OAuth error', err);
            }
        } finally {
            setIsAuthenticating(false);
        }
    }, [startOAuthFlow, router, isSignedIn, user]);

    return (
        <View className="flex-1 bg-[#FFD600]">
            <StatusBar style="dark" />
            
            {/* ── Background Pattern (Brutalist Grid) ── */}
            <View 
                className="absolute inset-0 opacity-[0.03]" 
                style={{ 
                    borderWidth: 1, 
                    borderColor: 'black', 
                    borderStyle: 'dashed' 
                }} 
            />

            <View className="flex-1 px-8 justify-center">
                
                {/* ── Hero Animation ── */}
                <Animated.View entering={FadeIn.delay(200)} className="items-center mb-12">
                    <View className="w-64 h-64 bg-white border-4 border-black rounded-[60px] shadow-hard items-center justify-center overflow-hidden">
                        <LottieView
                            source={require('../../assets/lottie/Developer 01 - Whoooa!.json')}
                            autoPlay
                            loop
                            style={{ width: '120%', height: '120%' }}
                        />
                    </View>
                </Animated.View>

                {/* ── Text Content ── */}
                <Animated.View entering={FadeInDown.delay(400)}>
                    <View className="bg-black self-start px-4 py-1.5 rounded-lg mb-4">
                        <Text className="text-[#FFD600] font-black text-[10px] uppercase tracking-[4px]">
                            WELCOME TO KAARYA
                        </Text>
                    </View>
                    
                    <Text className="text-black font-black text-6xl uppercase tracking-tighter leading-[0.85] mb-6">
                        SKILLS{'\n'}MEET{'\n'}HUSTLE.
                    </Text>
                    
                    <Text className="text-black/60 font-bold text-lg leading-6 mb-12 max-w-[80%]">
                        The ultimate marketplace for students to get paid for their superpowers.
                    </Text>
                </Animated.View>

                {/* ── CTA ── */}
                <Animated.View entering={FadeInUp.delay(600)}>
                    <TouchableOpacity
                        onPress={handleGoogleSignIn}
                        disabled={isAuthenticating}
                        activeOpacity={0.9}
                        className="w-full bg-black py-6 border-4 border-black rounded-3xl shadow-hard-white flex-row justify-center items-center gap-4"
                    >
                        <MaterialCommunityIcons
                            name="google"
                            size={24}
                            color="#FFD600"
                        />
                        <Text className="text-white font-black text-xl uppercase tracking-tight">
                            {isAuthenticating ? 'VERIFYING...' : 'GET STARTED'}
                        </Text>
                    </TouchableOpacity>
                    
                    <Text className="text-center text-black/30 font-bold text-[9px] uppercase tracking-[2px] mt-6">
                        SECURE LOGIN • NO SPAM • REAL GIGS
                    </Text>
                </Animated.View>

            </View>
        </View>
    );
}
