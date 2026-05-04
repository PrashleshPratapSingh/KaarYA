import { View, Text, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, FadeIn, SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../../lib/auth';

const { width } = Dimensions.get('window');
const STORAGE_KEY = '@kaarya_onboarding_data';

const SUGGESTED_SKILLS = [
    'UI/UX', 'VIDEO EDITING', 'WEB DEV', 'GRAPHIC DESIGN',
    'WRITING', 'DATA ENTRY', 'PHOTOGRAPHY', 'SOCIAL MEDIA',
];

export default function OnboardingSimplified() {
    const router = useRouter();
    const { user } = useAuth();

    const [step, setStep] = useState(0);
    const [name, setName] = useState('');
    const [university, setUniversity] = useState('');
    const [role, setRole] = useState<'doer' | 'client'>('doer');
    const [bio, setBio] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [skills, setSkills] = useState<string[]>([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    // Load initial data
    useEffect(() => {
        const load = async () => {
            try {
                const saved = await AsyncStorage.getItem(STORAGE_KEY);
                if (saved) {
                    const d = JSON.parse(saved);
                    setName(d.name || '');
                    setUniversity(d.university || '');
                    setRole(d.role || 'doer');
                    setBio(d.bio || '');
                    setImage(d.image || null);
                    setSkills(d.skills || []);
                }
            } catch { }
            setIsDataLoaded(true);
        };
        load();
    }, []);

    // Sync with User context
    useEffect(() => {
        if (!isDataLoaded || !user) return;
        if (user.name && !name) setName(user.name);
        if (user.avatarUrl && !image) setImage(user.avatarUrl);
    }, [isDataLoaded, user]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, aspect: [1, 1], quality: 0.8,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            try {
                if (!user) return;
                const { uploadAvatar } = await import('../../lib/storage');
                const url = await uploadAvatar(user.uid, result.assets[0].uri);
                await updateUserProfile(user.uid, { avatar_url: url });
            } catch (e) { console.log('Img upload err:', e); }
        }
    };

    const toggleSkill = (s: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
    };

    const handleNext = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (step === 0) {
            if (!name.trim()) return alert('Tell us your name first!');
            setStep(1);
        } else {
            handleComplete();
        }
    };

    const handleComplete = async () => {
        if (user) {
            try {
                await updateUserProfile(user.uid, { 
                    name, 
                    university, 
                    role,
                    bio, 
                    skills,
                    onboarding_complete: true 
                });
                await AsyncStorage.setItem('kaarya_onboarding_complete', 'true');
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                router.replace('/(tabs)');
            } catch (e) {
                console.log('Save error:', e);
            }
        }
    };

    return (
        <GestureHandlerRootView className="flex-1">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 bg-[#FFD600]"
            >
                <StatusBar style="dark" />
                
                <ScrollView 
                    contentContainerStyle={{ flexGrow: 1 }} 
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex-1 px-6 pt-16 pb-32">
                        
                        {/* ── Progress Bar ── */}
                        <View className="flex-row gap-2 mb-10">
                            <View className={`h-2 flex-1 border-2 border-black rounded-full ${step >= 0 ? 'bg-black' : 'bg-white'}`} />
                            <View className={`h-2 flex-1 border-2 border-black rounded-full ${step >= 1 ? 'bg-black' : 'bg-white'}`} />
                        </View>

                        {step === 0 ? (
                            <Animated.View entering={SlideInRight} exiting={SlideOutLeft} key="step0">
                                <Text className="font-display text-5xl uppercase leading-[0.9] text-black mb-2 tracking-tighter">
                                    THE{'\n'}BASICS.
                                </Text>
                                <Text className="font-bold text-black/40 uppercase tracking-[3px] text-[10px] mb-8">
                                    Who are you?
                                </Text>

                                {/* Avatar */}
                                <View className="items-center mb-10">
                                    <TouchableOpacity onPress={pickImage} activeOpacity={0.9} className="relative">
                                        <View className="w-36 h-36 bg-white border-4 border-black rounded-[40px] overflow-hidden shadow-hard">
                                            {image ? (
                                                <Image source={{ uri: image }} className="w-full h-full" />
                                            ) : (
                                                <View className="flex-1 items-center justify-center">
                                                    <Ionicons name="camera" size={40} color="black" />
                                                </View>
                                            )}
                                        </View>
                                        <View className="absolute -bottom-2 -right-2 bg-black w-12 h-12 rounded-2xl items-center justify-center border-4 border-[#FFD600] shadow-hard-sm">
                                            <Feather name="plus" size={24} color="#FFD600" />
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                {/* Inputs */}
                                <View className="gap-6">
                                    <View>
                                        <Text className="font-display text-[10px] uppercase mb-2 text-black/60 tracking-[2px]">Your Name</Text>
                                        <TextInput
                                            value={name}
                                            onChangeText={setName}
                                            placeholder="ARJUN MEHTA"
                                            className="bg-white h-16 border-4 border-black px-5 font-display text-xl rounded-2xl shadow-hard"
                                        />
                                    </View>
                                    
                                    <View>
                                        <Text className="font-display text-[10px] uppercase mb-2 text-black/60 tracking-[2px]">University</Text>
                                        <TextInput
                                            value={university}
                                            onChangeText={setUniversity}
                                            placeholder="IIT BOMBAY"
                                            className="bg-white h-16 border-4 border-black px-5 font-display text-xl rounded-2xl shadow-hard"
                                        />
                                    </View>

                                    <View>
                                        <Text className="font-display text-[10px] uppercase mb-3 text-black/60 tracking-[2px]">Main Goal</Text>
                                        <View className="flex-row gap-3">
                                            <TouchableOpacity 
                                                onPress={() => { setRole('doer'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                                                className={`flex-1 py-4 border-4 border-black rounded-2xl items-center ${role === 'doer' ? 'bg-black shadow-none translate-y-1' : 'bg-white shadow-hard'}`}
                                            >
                                                <Text className={`font-display uppercase ${role === 'doer' ? 'text-[#FFD600]' : 'text-black'}`}>Work & Earn</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity 
                                                onPress={() => { setRole('client'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                                                className={`flex-1 py-4 border-4 border-black rounded-2xl items-center ${role === 'client' ? 'bg-black shadow-none translate-y-1' : 'bg-white shadow-hard'}`}
                                            >
                                                <Text className={`font-display uppercase ${role === 'client' ? 'text-[#FFD600]' : 'text-black'}`}>Hire Talent</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </Animated.View>
                        ) : (
                            <Animated.View entering={SlideInRight} exiting={SlideOutLeft} key="step1">
                                <TouchableOpacity 
                                    onPress={() => setStep(0)} 
                                    className="mb-4"
                                >
                                    <Ionicons name="arrow-back" size={24} color="black" />
                                </TouchableOpacity>
                                
                                <Text className="font-display text-5xl uppercase leading-[0.9] text-black mb-2 tracking-tighter">
                                    THE{'\n'}VIBE.
                                </Text>
                                <Text className="font-bold text-black/40 uppercase tracking-[3px] text-[10px] mb-8">
                                    Show off a bit.
                                </Text>

                                {/* Skills */}
                                <View className="mb-8">
                                    <Text className="font-display text-[10px] uppercase mb-4 text-black/60 tracking-[2px]">Skills (Pick some)</Text>
                                    <View className="flex-row flex-wrap gap-2">
                                        {SUGGESTED_SKILLS.map((s) => {
                                            const active = skills.includes(s);
                                            return (
                                                <TouchableOpacity
                                                    key={s}
                                                    onPress={() => toggleSkill(s)}
                                                    className={`px-4 py-3 border-3 border-black rounded-xl ${active ? 'bg-black' : 'bg-white shadow-hard-sm'}`}
                                                >
                                                    <Text className={`font-display text-[11px] uppercase ${active ? 'text-[#FFD600]' : 'text-black'}`}>
                                                        {s}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>

                                {/* Bio */}
                                <View>
                                    <Text className="font-display text-[10px] uppercase mb-2 text-black/60 tracking-[2px]">Short Bio</Text>
                                    <TextInput
                                        value={bio}
                                        onChangeText={setBio}
                                        placeholder="I build cool stuff..."
                                        multiline
                                        numberOfLines={4}
                                        className="bg-white border-4 border-black p-5 font-display text-lg rounded-2xl shadow-hard min-h-[140px]"
                                        style={{ textAlignVertical: 'top' }}
                                    />
                                </View>
                            </Animated.View>
                        )}

                    </View>
                </ScrollView>

                {/* Floating Bottom Button */}
                <View className="absolute bottom-10 left-0 right-0 px-6">
                    <TouchableOpacity
                        onPress={handleNext}
                        activeOpacity={0.9}
                        className="bg-black py-6 border-4 border-black rounded-3xl shadow-hard-white items-center flex-row justify-center gap-3"
                    >
                        <Text className="text-white font-display text-2xl uppercase italic">
                            {step === 0 ? 'Next Vibe' : 'Let\'s Go'}
                        </Text>
                        <MaterialIcons 
                            name={step === 0 ? "arrow-forward" : "rocket-launch"} 
                            size={24} 
                            color="white" 
                        />
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
        </GestureHandlerRootView>
    );
}
