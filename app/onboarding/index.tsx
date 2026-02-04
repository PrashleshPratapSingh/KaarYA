import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

export default function OnboardingIndex() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-[#FFD600] relative">
            <StatusBar style="dark" />

            <View className="flex-1 w-full items-center pt-20 px-6 relative justify-between pb-12">
                {/* Title Section */}
                <Animated.View entering={FadeInDown.delay(200).duration(1000)} className="items-center z-10 mb-2 w-full">
                    <Text className="font-display text-[4rem] leading-[1] uppercase tracking-tighter text-black text-center mb-6">
                        KaarYA:
                    </Text>
                    <Text className="font-display text-4xl leading-[0.9] uppercase tracking-tight text-black text-center">
                        Your Story{'\n'}
                        Starts{'\n'}
                        Here.
                    </Text>
                </Animated.View>

                {/* Mascot / Graphic Section */}
                <Animated.View entering={FadeInUp.delay(500).duration(1000)} className="relative h-96 w-full flex justify-center items-center mt-4">

                    {/* Lottie Animation */}
                    <LottieView
                        source={require('../../assets/lottie/cute_cat_works.json')}
                        autoPlay
                        loop
                        style={{ width: 350, height: 350 }}
                    />

                    {/* Tooltip - Positioned top right relative to container */}
                    <View className="absolute top-10 right-0 bg-white px-4 py-3 rounded-2xl shadow-lg z-30 transform rotate-1 w-40">
                        <Text className="text-sm leading-tight text-black text-base" style={{ fontFamily: 'Merriweather_700Bold_Italic' }}>Let's build that bank, shall we?</Text>
                        <View className="absolute bottom-0 left-[-6px] translate-y-1/3 w-4 h-4 bg-white transform rotate-45"></View>
                    </View>

                    {/* Star Badge - Positioned middle left */}
                    <View className="absolute top-1/3 left-4 bg-white w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center transform -rotate-12 z-30 border-2 border-slate-100">
                        <MaterialIcons name="star" size={32} color="#FACC15" />
                    </View>
                </Animated.View>

                {/* Footer Section */}
                <Animated.View entering={FadeInUp.delay(800).duration(1000)} className="w-full max-w-md px-6 pb-4 items-center space-y-6 z-20">
                    <TouchableOpacity
                        onPress={() => router.push('/onboarding/community')}
                        className="w-full bg-black py-5 rounded-full shadow-xl active:scale-95 transition-transform"
                    >
                        <Text className="text-white font-display text-xl text-center uppercase tracking-wide">
                            Strike a Gig
                        </Text>
                    </TouchableOpacity>

                    {/* Pagination Dots */}
                    <View className="flex-row gap-2.5 justify-center items-center mt-6">
                        <View className="w-8 h-2.5 bg-black rounded-full" />
                        <View className="w-2.5 h-2.5 bg-black/20 rounded-full" />
                        <View className="w-2.5 h-2.5 bg-black/20 rounded-full" />
                        <View className="w-2.5 h-2.5 bg-black/20 rounded-full" />
                    </View>

                </Animated.View>
            </View>
        </View>
    );
}
