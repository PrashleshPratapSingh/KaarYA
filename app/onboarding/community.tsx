import { View, Text, TouchableOpacity, TextInput, Dimensions, KeyboardAvoidingView, Platform, ScrollView, FlatList, LayoutAnimation, UIManager, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    FadeInDown,
    FadeIn
} from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const CAMPUSES = [
    "Woxsen University",
    "Delhi University",
    "IIT Bombay",
    "IIT Delhi",
    "Amity University",
    "Mumbai University",
    "Bangalore University",
    "Manipal University",
    "BITS Pilani",
    "SRM University",
    "VIT",
    "JNU",
    "Christ University",
    "Symbiosis",
    "Chandigarh University"
];

export default function OnboardingCommunity() {
    const router = useRouter();
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Animation for the floating tooltip
    const floatY = useSharedValue(0);

    // Eye tracking animation values
    const eyeX = useSharedValue(0);
    const eyeY = useSharedValue(0);

    useEffect(() => {
        floatY.value = withRepeat(
            withSequence(
                withTiming(-10, { duration: 1500 }),
                withTiming(0, { duration: 1500 })
            ),
            -1,
            true
        );
    }, []);

    const animatedFloatStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: floatY.value }]
        };
    });

    const handleFocus = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsSearching(true);
        eyeX.value = withTiming(2, { duration: 200 });
        eyeY.value = withTiming(5, { duration: 200 });
    };

    const handleBlur = () => {
        // We don't automatically close on blur to keep results visible, 
        // user can close explicitly or by clearing text/keyboard dismiss if desired.
        // For now, let's keep it open until back or explicit action if we want strict mode.
        // But to match standard behavior, if they click "Done" on keyboard:
        eyeX.value = withTiming(0, { duration: 200 });
        eyeY.value = withTiming(2, { duration: 200 });
    };

    const handleBack = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsSearching(false);
        Keyboard.dismiss();
    };

    const handleSelectCampus = (campus: string) => {
        setSearchQuery(campus);
        handleBack();
    };

    const filteredCampuses = CAMPUSES.filter(campus =>
        campus.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-[#FFD700] relative"
        >
            <StatusBar style="dark" />

            <View className={`flex-1 w-full px-6 flex-col relative max-w-md mx-auto ${isSearching ? 'pt-12' : 'pt-20 justify-between'}`}>

                {/* Header / Back Button when searching */}
                {isSearching && (
                    <TouchableOpacity onPress={handleBack} className="mb-4">
                        <MaterialIcons name="arrow-back" size={28} color="black" />
                    </TouchableOpacity>
                )}

                {/* Title */}
                {!isSearching && (
                    <Animated.View entering={FadeInDown.delay(200)} className="mt-2 mb-2 relative z-20">
                        <View className="bg-white border-4 border-black px-6 py-4 shadow-hard transform -rotate-1 self-start">
                            <Text className="font-display text-5xl leading-[0.9] tracking-tighter uppercase text-black">
                                Find{'\n'}Your{'\n'}Tribe.
                            </Text>
                        </View>
                    </Animated.View>
                )}

                {/* Animation Area */}
                {!isSearching && (
                    <View className="flex-1 relative w-full items-center justify-center -mt-8">
                        {/* Office Team Foreground */}
                        <LottieView
                            source={require('../../assets/lottie/office_team.json')}
                            autoPlay
                            loop
                            style={{ width: '100%', height: 250, marginTop: 100 }}
                        />

                        {/* Floating Tooltip - Brutalist Sharp Style */}
                        <Animated.View
                            style={[{ position: 'absolute', top: 40, right: -10, zIndex: 30 }, animatedFloatStyle]}
                        >
                            <View className="bg-white px-5 py-4 border-2 border-black shadow-hard-sm max-w-[180px] relative transform rotate-1">
                                <Text className="font-bold italic text-sm leading-tight text-black">We only let the real ones in.</Text>
                            </View>
                        </Animated.View>
                    </View>
                )}

                {/* Search Interaction Wrapper */}
                <View className={`w-full ${isSearching ? 'flex-1' : 'mb-6'}`}>
                    {/* Search Field */}
                    <Animated.View className="relative z-20 w-full">
                        <View className="relative">
                            <View className="absolute inset-y-0 left-0 pl-4 py-4 justify-center z-10">
                                <MaterialIcons name="search" size={28} color="black" />
                            </View>
                            <TextInput
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                placeholder="Search your campus..."
                                placeholderTextColor="#6B7280"
                                className="block w-full pl-14 pr-4 py-4 bg-white border-4 border-black text-black font-bold text-lg shadow-hard focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none"
                            />
                            {/* Star Decoration on Input */}
                            {!isSearching && (
                                <View className="absolute -top-4 -right-2 bg-white w-10 h-10 border-2 border-black items-center justify-center shadow-hard-sm z-20 transform rotate-12">
                                    <MaterialIcons name="star" size={20} color="#000" />
                                </View>
                            )}
                        </View>
                    </Animated.View>

                    {/* Results List */}
                    {isSearching && (
                        <FlatList
                            data={filteredCampuses}
                            keyExtractor={(item) => item}
                            className="mt-4 flex-1"
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => handleSelectCampus(item)}
                                    className="py-4 border-b-2 border-black"
                                >
                                    <Text className="text-xl font-black text-black uppercase tracking-tighter">{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </View>

                {/* Footer */}
                {!isSearching && (
                    <Animated.View entering={FadeIn.delay(600)} className="px-6 pb-8 pt-2 items-center z-20 w-full max-w-md mx-auto">
                        <TouchableOpacity
                            onPress={() => router.push({
                                pathname: '/onboarding/skills',
                                params: { university: searchQuery }
                            })}
                            className="w-full bg-black py-5 border-4 border-black shadow-hard active:translate-x-1 active:translate-y-1 active:shadow-none transition-all mb-8"
                        >
                            <Text className="text-white font-display text-xl text-center uppercase tracking-wider">
                                Strike a Gig
                            </Text>
                        </TouchableOpacity>

                        {/* Pagination Dots - Brutalist Rectangles */}
                        <View className="flex-row gap-3 justify-center items-center">
                            <View className="w-3 h-3 bg-white border-2 border-black" />
                            <View className="w-12 h-3 bg-black border-2 border-black" />
                            <View className="w-3 h-3 bg-white border-2 border-black" />
                            <View className="w-3 h-3 bg-white border-2 border-black" />
                        </View>

                    </Animated.View>
                )}
            </View>
        </KeyboardAvoidingView>
    );
}
