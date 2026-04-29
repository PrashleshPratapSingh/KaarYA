import { View, Text, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../../lib/auth';

const STORAGE_KEY = '@kaarya_onboarding_data';

const SUGGESTED_SKILLS = [
    'UI/UX', 'VIDEO EDITING', 'WEB DEV', 'GRAPHIC DESIGN',
    'WRITING', 'DATA ENTRY', 'PHOTOGRAPHY', 'SOCIAL MEDIA',
    'APP DEV', 'SEO', 'ANIMATION', 'MARKETING',
];

export default function OnboardingSkills() {
    const router = useRouter();
    const { user } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [university, setUniversity] = useState('');
    const [bio, setBio] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [skills, setSkills] = useState<string[]>([]);
    const [newSkill, setNewSkill] = useState('');
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const saved = await AsyncStorage.getItem(STORAGE_KEY);
                if (saved) {
                    const d = JSON.parse(saved);
                    setName(d.name || ''); setEmail(d.email || '');
                    setUniversity(d.university || ''); setBio(d.bio || '');
                    setImage(d.image || null);
                    if (d.skills) setSkills(d.skills);
                }
            } catch { }
            setIsDataLoaded(true);
        };
        load();
    }, []);

    useEffect(() => {
        if (!isDataLoaded || !user) return;
        if (user.name) setName(user.name);
        if (user.email) setEmail(user.email);
        if (user.avatarUrl && !image) setImage(user.avatarUrl);

        (async () => {
            try {
                const { fetchUser } = await import('../../lib/queries');
                const p = await fetchUser(user.uid);
                if (p) {
                    if (p.university) setUniversity(p.university);
                    if (p.bio) setBio(p.bio);
                    if (p.avatar_url) setImage(p.avatar_url);
                    if (p.skills?.length) setSkills(p.skills.map((s: string) => s.toUpperCase()));
                }
            } catch { }
        })();
    }, [isDataLoaded, user]);

    useEffect(() => {
        if (!isDataLoaded) return;
        const t = setTimeout(async () => {
            try {
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ name, email, university, bio, image, skills }));
            } catch { }
        }, 1000);
        return () => clearTimeout(t);
    }, [name, email, university, bio, image, skills, isDataLoaded]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, aspect: [1, 1], quality: 0.8,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
            try {
                if (!user) throw new Error('x');
                const { uploadAvatar } = await import('../../lib/storage');
                const url = await uploadAvatar(user.uid, result.assets[0].uri);
                await updateUserProfile(user.uid, { avatar_url: url });
            } catch { }
        }
    };

    const toggleSkill = (s: string) => {
        setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
    };

    const addCustomSkill = () => {
        if (newSkill.trim().length > 0) {
            const upper = newSkill.trim().toUpperCase();
            if (!skills.includes(upper)) setSkills([...skills, upper]);
            setNewSkill('');
        }
    };

    const handleContinue = async () => {
        if (user) {
            updateUserProfile(user.uid, { name, email, university, bio, skills })
                .catch(e => console.log('Save error:', e));
        }
        await AsyncStorage.setItem('kaarya_onboarding_complete', 'true');
        router.replace('/(tabs)');
    };

    return (
        <GestureHandlerRootView className="flex-1">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 bg-[#FFD600]"
            >
                <StatusBar style="dark" />

                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 140 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex-1 px-6 pt-16 pb-12 w-full max-w-md mx-auto">

                        {/* ── Title Block ── */}
                        <Animated.View entering={FadeInDown.delay(100)} className="mb-8">
                            <View className="bg-white border-4 border-black px-6 py-4 shadow-hard transform -rotate-1 self-start">
                                <Text className="font-display text-[42px] leading-[0.9] uppercase text-black tracking-tighter">
                                    Build{'\n'}Your ID.
                                </Text>
                            </View>
                            <Text className="text-black/50 font-bold text-xs uppercase tracking-[3px] mt-4 ml-1">
                                Fill what you want • edit later anytime
                            </Text>
                        </Animated.View>

                        {/* ── Avatar ── */}
                        <Animated.View entering={FadeIn.delay(200)} className="items-center mb-10">
                            <TouchableOpacity onPress={pickImage} activeOpacity={0.85}>
                                <View className="w-32 h-32 bg-white border-4 border-black rounded-3xl overflow-hidden items-center justify-center shadow-hard">
                                    {image ? (
                                        <Image source={{ uri: image }} className="w-full h-full" resizeMode="cover" />
                                    ) : (
                                        <View className="items-center">
                                            <View className="w-14 h-14 bg-[#FFD600] border-3 border-black rounded-2xl items-center justify-center mb-2">
                                                <MaterialIcons name="add-a-photo" size={28} color="black" />
                                            </View>
                                            <Text className="font-display text-[9px] uppercase tracking-widest text-black/50">Tap to add</Text>
                                        </View>
                                    )}
                                </View>
                                {image && (
                                    <View className="absolute -bottom-2 -right-2 w-10 h-10 bg-black border-3 border-[#FFD600] rounded-xl items-center justify-center shadow-hard-sm">
                                        <Feather name="edit-2" size={16} color="#FFD600" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </Animated.View>

                        {/* ── Name ── */}
                        <Animated.View entering={FadeInUp.delay(250)} className="mb-6">
                            <Text className="font-display text-[10px] uppercase mb-2 ml-1 text-black/60 tracking-[2px]">The Name</Text>
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                placeholder="e.g. ARJUN MEHTA"
                                placeholderTextColor="rgba(0,0,0,0.15)"
                                className="w-full bg-white h-16 border-4 border-black px-5 text-black font-display rounded-xl shadow-hard text-xl"
                            />
                        </Animated.View>

                        {/* ── Email ── */}
                        <Animated.View entering={FadeInUp.delay(300)} className="mb-6">
                            <Text className="font-display text-[10px] uppercase mb-2 ml-1 text-black/60 tracking-[2px]">Email</Text>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="your@email.com"
                                placeholderTextColor="rgba(0,0,0,0.15)"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                className="w-full bg-white h-16 border-4 border-black px-5 text-black font-display rounded-xl shadow-hard text-xl"
                            />
                        </Animated.View>

                        {/* ── University ── */}
                        <Animated.View entering={FadeInUp.delay(350)} className="mb-6">
                            <Text className="font-display text-[10px] uppercase mb-2 ml-1 text-black/60 tracking-[2px]">University / College</Text>
                            <TextInput
                                value={university}
                                onChangeText={setUniversity}
                                placeholder="Where do you study?"
                                placeholderTextColor="rgba(0,0,0,0.15)"
                                className="w-full bg-white h-16 border-4 border-black px-5 text-black font-display rounded-xl shadow-hard text-xl"
                            />
                        </Animated.View>

                        {/* ── Skills ── */}
                        <Animated.View entering={FadeInUp.delay(400)} className="mb-6">
                            <View className="flex-row items-center justify-between mb-3">
                                <Text className="font-display text-[10px] uppercase text-black/60 tracking-[2px] ml-1">Your Superpowers</Text>
                                {skills.length > 0 && (
                                    <View className="bg-black px-3 py-1 rounded-lg">
                                        <Text className="text-[10px] font-display text-[#FFD600] uppercase">{skills.length} picked</Text>
                                    </View>
                                )}
                            </View>

                            <View className="flex-row flex-wrap gap-2 mb-4">
                                {SUGGESTED_SKILLS.map((skill) => {
                                    const on = skills.includes(skill);
                                    return (
                                        <TouchableOpacity
                                            key={skill}
                                            onPress={() => toggleSkill(skill)}
                                            activeOpacity={0.8}
                                            className={`px-4 py-3 border-3 border-black rounded-xl ${on ? 'bg-black' : 'bg-white'}`}
                                            style={on ? {
                                                shadowColor: '#FFD600', shadowOffset: { width: 3, height: 3 },
                                                shadowOpacity: 1, shadowRadius: 0, elevation: 4,
                                            } : {
                                                shadowColor: '#000', shadowOffset: { width: 3, height: 3 },
                                                shadowOpacity: 1, shadowRadius: 0, elevation: 4,
                                            }}
                                        >
                                            <Text className={`text-[11px] font-display uppercase tracking-wider ${on ? 'text-[#FFD600]' : 'text-black'}`}>
                                                {on ? `✦ ${skill}` : skill}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            <View className="flex-row gap-2">
                                <TextInput
                                    value={newSkill}
                                    onChangeText={setNewSkill}
                                    onSubmitEditing={addCustomSkill}
                                    placeholder="+ YOUR OWN SKILL"
                                    placeholderTextColor="rgba(0,0,0,0.15)"
                                    returnKeyType="done"
                                    className="flex-1 bg-white h-14 border-4 border-black border-dashed px-4 text-black font-display rounded-xl text-sm"
                                />
                                {newSkill.trim().length > 0 && (
                                    <TouchableOpacity
                                        onPress={addCustomSkill}
                                        className="bg-black border-4 border-black h-14 w-14 rounded-xl items-center justify-center shadow-hard"
                                    >
                                        <MaterialIcons name="add" size={24} color="#FFD600" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </Animated.View>

                        {/* ── Bio ── */}
                        <Animated.View entering={FadeInUp.delay(450)} className="mb-8">
                            <Text className="font-display text-[10px] uppercase mb-2 ml-1 text-black/60 tracking-[2px]">The Lore (Bio)</Text>
                            <TextInput
                                value={bio}
                                onChangeText={setBio}
                                placeholder="TELL YOUR STORY..."
                                placeholderTextColor="rgba(0,0,0,0.15)"
                                multiline
                                numberOfLines={4}
                                className="w-full bg-white border-4 border-black px-5 py-5 text-black font-display rounded-xl shadow-hard min-h-[140px] text-xl"
                                style={{ textAlignVertical: 'top' }}
                            />
                        </Animated.View>
                    </View>
                </ScrollView>

                {/* ── Floating Bottom CTA ── */}
                <Animated.View
                    entering={FadeInUp.delay(600)}
                    className="absolute bottom-0 left-0 right-0 px-6 pb-10 pt-5 bg-[#FFD600]"
                >
                    <TouchableOpacity
                        onPress={handleContinue}
                        activeOpacity={0.85}
                        className="w-full bg-black py-6 border-4 border-black rounded-2xl shadow-hard-white flex-row items-center justify-center gap-4 active:translate-y-1 active:shadow-none"
                    >
                        <Text className="font-display text-3xl uppercase tracking-tighter italic text-white leading-none">
                            Let's Go
                        </Text>
                        <View className="w-10 h-10 bg-[#FFD600] rounded-xl items-center justify-center border-2 border-[#FFD600]">
                            <MaterialIcons name="arrow-forward" size={24} color="black" />
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            </KeyboardAvoidingView>
        </GestureHandlerRootView>
    );
}
