import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import { useOAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import React, { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { useAuth } from '../context/AuthContext';

// Warm up the android browser to improve UX
export const useWarmUpBrowser = () => {
    useEffect(() => {
        void WebBrowser.warmUpAsync();
        return () => {
            void WebBrowser.coolDownAsync();
        };
    }, []);
};

WebBrowser.maybeCompleteAuthSession();

const { width } = Dimensions.get('window');

export default function OnboardingIndex() {
    const router = useRouter();
    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
    const { user, loading } = useAuth();
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    
    useWarmUpBrowser();

    const handleGoogleSignIn = React.useCallback(async () => {
        try {
            setIsAuthenticating(true);
            const { createdSessionId, setActive } = await startOAuthFlow({
                redirectUrl: Linking.createURL('/onboarding/community', { scheme: 'com.kaarya.studentmarketplace' }),
            });

            if (createdSessionId && setActive) {
                await setActive({ session: createdSessionId });
                router.push('/onboarding/community');
            }
        } catch (err) {
            console.error('OAuth error', err);
        } finally {
            setIsAuthenticating(false);
        }
    }, [startOAuthFlow, router]);

    return (
        <View className="flex-1 bg-[#FFD600] relative">
            <StatusBar style="dark" />

            <View className="flex-1 w-full items-center pt-16 px-6 relative justify-between pb-12">
                {/* Title Section - Brutalist Style */}
                <Animated.View entering={FadeInDown.delay(200).duration(1000)} className="items-center z-10 w-full">
                    <View className="bg-white border-4 border-black px-6 py-2 shadow-hard mb-6 transform -rotate-1">
                        <Text className="font-display text-5xl leading-[1] uppercase text-black text-center">
                            KaarYA:
                        </Text>
                    </View>
                    
                    <View className="bg-black border-4 border-black px-6 py-4 shadow-hard-white transform rotate-1">
                        <Text className="font-display text-3xl leading-[1] uppercase text-white text-center">
                            Your Story{'\n'}Starts Here.
                        </Text>
                    </View>
                </Animated.View>

                {/* Mascot / Graphic Section */}
                <Animated.View entering={FadeInUp.delay(500).duration(1000)} className="relative h-80 w-full flex justify-center items-center">

                    {/* Lottie Animation */}
                    <LottieView
                        source={require('../../assets/lottie/cute_cat_works.json')}
                        autoPlay
                        loop
                        style={{ width: 320, height: 320 }}
                    />

                    {/* Tooltip - Brutalist Sharp Style */}
                    <View className="absolute top-0 right-0 bg-white border-2 border-black px-4 py-3 shadow-hard-sm z-30 transform rotate-2 w-44">
                        <Text className="text-sm leading-tight text-black font-bold" style={{ fontFamily: 'Merriweather_700Bold_Italic' }}>
                            Let's build that bank, shall we?
                        </Text>
                    </View>

                    {/* Star Badge - Brutalist Style */}
                    <View className="absolute top-1/4 left-0 bg-white w-14 h-14 border-2 border-black shadow-hard-sm flex items-center justify-center transform -rotate-12 z-30">
                        <MaterialIcons name="star" size={32} color="#000" />
                    </View>
                </Animated.View>

                {/* Footer Section */}
                <Animated.View entering={FadeInUp.delay(800).duration(1000)} className="w-full max-w-md px-4 items-center z-20">
                    <TouchableOpacity
                        onPress={handleGoogleSignIn}
                        disabled={isAuthenticating}
                        className="w-full bg-black py-5 border-4 border-black shadow-hard active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex-row justify-center items-center px-8"
                    >
                        <MaterialCommunityIcons name="google" size={24} color="white" style={{ marginRight: 12 }} />
                        <Text 
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            className="text-white font-display text-xl text-center uppercase tracking-tight"
                        >
                            {isAuthenticating ? 'Signing in...' : 'Continue with Google'}
                        </Text>
                    </TouchableOpacity>

                    {/* Pagination Dots - Brutalist Rectangles */}
                    <View className="flex-row gap-3 justify-center items-center mt-10">
                        <View className="w-12 h-3 bg-black border-2 border-black" />
                        <View className="w-3 h-3 bg-white border-2 border-black" />
                        <View className="w-3 h-3 bg-white border-2 border-black" />
                        <View className="w-3 h-3 bg-white border-2 border-black" />
                    </View>

                </Animated.View>
            </View>
        </View>
    );
}
