import { View, Text, TouchableOpacity, Dimensions, TextInput, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const STORAGE_KEY = '@kaarya_onboarding_data';

export default function OnboardingSkills() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Form States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [university, setUniversity] = useState('');
    const [gradYear, setGradYear] = useState('2028');
    const [bio, setBio] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [skills, setSkills] = useState(['VIDEO EDITING', 'UI/UX']);
    const [newSkill, setNewSkill] = useState('');

    // UI/Verification States
    const [isVerified, setIsVerified] = useState(false);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    // Initial Load from Storage
    useEffect(() => {
        const loadSavedData = async () => {
            try {
                const savedData = await AsyncStorage.getItem(STORAGE_KEY);
                if (savedData) {
                    const data = JSON.parse(savedData);
                    setName(data.name || '');
                    setEmail(data.email || '');
                    setPhone(data.phone || '');
                    // Only set university from storage if transition param isn't present
                    if (!params.university) {
                        setUniversity(data.university || '');
                    }
                    setGradYear(data.gradYear || '2028');
                    setBio(data.bio || '');
                    setImage(data.image || null);
                    if (data.skills) setSkills(data.skills);
                    setIsVerified(data.isVerified || false);
                }

                // If university is passed via params (from Community screen), it takes precedence
                if (params.university) {
                    setUniversity(params.university as string);
                }
                setIsDataLoaded(true);
            } catch (error) {
                console.error('Failed to load data from storage:', error);
                setIsDataLoaded(true);
            }
        };

        loadSavedData();
    }, []);

    // Save to Storage on every change (Debounced)
    useEffect(() => {
        if (!isDataLoaded) return;

        const saveData = async () => {
            try {
                const currentData = {
                    name,
                    email,
                    phone,
                    university,
                    gradYear,
                    bio,
                    image,
                    skills,
                    isVerified
                };
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
            } catch (error) {
                console.error('Failed to save data to storage:', error);
            }
        };

        const timer = setTimeout(saveData, 1000);
        return () => clearTimeout(timer);
    }, [name, email, phone, university, gradYear, bio, image, skills, isVerified, isDataLoaded]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    const addSkill = () => {
        if (newSkill.trim().length > 0) {
            setSkills([...skills, newSkill.trim().toUpperCase()]);
            setNewSkill('');
        }
    };

    return (
        <GestureHandlerRootView className="flex-1">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 bg-[#FFD600] relative"
            >
                <StatusBar style="dark" />

                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex-1 px-6 pt-16 pb-12 w-full max-w-md mx-auto">

                        {/* Title */}
                        <Animated.View entering={FadeInDown.delay(200)} className="mb-12">
                            <Text className="font-display text-6xl leading-[0.85] uppercase tracking-tighter text-black">
                                Identity{"\n"}Setup
                            </Text>
                        </Animated.View>

                        {/* Profile Photo Area */}
                        <TouchableOpacity
                            onPress={pickImage}
                            className="bg-white/30 border-4 border-black border-dashed rounded-[40px] w-48 h-48 mx-auto mb-14 items-center justify-center relative overflow-hidden active:opacity-90 transition-opacity"
                        >
                            {image ? (
                                <Image source={{ uri: image }} className="w-full h-full" resizeMode="cover" />
                            ) : (
                                <View className="items-center justify-center">
                                    <View className="w-16 h-16 bg-white border-[3px] border-black rounded-[20px] items-center justify-center mb-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                        <MaterialIcons name="add-a-photo" size={28} color="black" />
                                    </View>
                                    <Text className="font-display text-center uppercase text-[11px] tracking-wider px-2 text-black leading-tight">Drag face here</Text>
                                    <Text className="text-[9px] font-display opacity-60 text-black mt-1 uppercase">or tap</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        <View>
                            {/* Name Input */}
                            <View className="mb-9">
                                <Text className="font-display text-[10px] uppercase mb-1.5 ml-1 text-black opacity-60 tracking-[2px]">The Name You Answer To</Text>
                                <TextInput
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="e.g. ARJUN MEHTA"
                                    placeholderTextColor="rgba(0,0,0,0.3)"
                                    className="w-full bg-white h-16 border-[3px] border-black px-5 text-black font-display rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-xl"
                                />
                            </View>

                            {/* Email Input */}
                            <View className="mb-9">
                                <Text className="font-display text-[10px] uppercase mb-1.5 ml-1 text-black opacity-60 tracking-[2px]">Academic Email (.ac.in)</Text>
                                <TextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="arjun@university.ac.in"
                                    placeholderTextColor="rgba(0,0,0,0.3)"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    className="w-full bg-white h-16 border-[3px] border-black px-5 text-black font-display rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-xl"
                                />
                            </View>

                            {/* Phone Input with Dynamic Verification Button */}
                            <View className="mb-9">
                                <Text className="font-display text-[10px] uppercase mb-1.5 ml-1 text-black opacity-60 tracking-[2px]">Digits (Phone)</Text>
                                <View className="relative">
                                    <TextInput
                                        value={phone}
                                        onChangeText={setPhone}
                                        placeholder="+91 98765 43210"
                                        placeholderTextColor="rgba(0,0,0,0.3)"
                                        keyboardType="phone-pad"
                                        className="w-full bg-white h-16 border-[3px] border-black pl-5 pr-32 text-black font-display rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-xl"
                                    />
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => setIsVerified(true)}
                                        disabled={isVerified}
                                        className={`absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl flex-row items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-black ${isVerified ? 'bg-[#4ADE80]' : 'bg-black'}`}
                                    >
                                        {isVerified && <MaterialIcons name="verified" size={16} color="black" />}
                                        <Text className={`text-[10px] font-display uppercase tracking-wider ${isVerified ? 'text-black' : 'text-white'}`}>
                                            {isVerified ? 'Verified' : 'Verify'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Grid: University & Grad Year */}
                            <View className="flex-row gap-5 mb-9">
                                <View className="flex-[2]">
                                    <Text className="font-display text-[10px] uppercase mb-1.5 ml-1 text-black opacity-60 tracking-[2px]">University</Text>
                                    <TextInput
                                        value={university}
                                        onChangeText={setUniversity}
                                        placeholder="IITB"
                                        placeholderTextColor="rgba(0,0,0,0.3)"
                                        className="w-full bg-white h-16 border-[3px] border-black px-5 text-black font-display rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-xl"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="font-display text-[10px] uppercase mb-1.5 ml-1 text-black opacity-60 tracking-[2px]">Year</Text>
                                    <TextInput
                                        value={gradYear}
                                        onChangeText={setGradYear}
                                        placeholder="2028"
                                        placeholderTextColor="rgba(0,0,0,0.3)"
                                        keyboardType="numeric"
                                        className="w-full bg-white h-16 border-[3px] border-black px-3 text-black font-display rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-xl text-center"
                                    />
                                </View>
                            </View>

                            {/* Skills Tag Input */}
                            <View className="mb-9">
                                <Text className="font-display text-[10px] uppercase mb-1.5 ml-1 text-black opacity-60 tracking-[2px]">Your Superpowers (Skills)</Text>
                                <View className="w-full bg-white border-[3px] border-black px-5 py-5 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex-row flex-wrap gap-3 items-center min-h-[72px]">
                                    {skills.map((skill, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => removeSkill(skill)}
                                            className="bg-black px-4 py-2.5 rounded-full flex-row items-center gap-2 border border-black"
                                        >
                                            <Text className="text-white text-[11px] font-display">{skill}</Text>
                                            <MaterialIcons name="close" size={12} color="white" />
                                        </TouchableOpacity>
                                    ))}
                                    <TextInput
                                        value={newSkill}
                                        onChangeText={setNewSkill}
                                        onSubmitEditing={addSkill}
                                        placeholder="+ Add"
                                        placeholderTextColor="rgba(0,0,0,0.2)"
                                        className="bg-transparent text-base font-display text-black min-w-[100px] h-10 flex-1"
                                    />
                                </View>
                            </View>

                            {/* Portfolio Link */}
                            <View className="mb-9">
                                <Text className="font-display text-[10px] uppercase mb-1.5 ml-1 text-black opacity-60 tracking-[2px]">Proof of Work (Portfolio)</Text>
                                <TouchableOpacity className="bg-black py-10 border-[3px] border-black rounded-2xl items-center justify-center border-dashed active:scale-[0.98] transition-transform shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]">
                                    <MaterialIcons name="link" size={36} color="#FFD600" className="mb-2" />
                                    <Text className="font-display text-lg uppercase text-white tracking-widest leading-none">Add Links / Files</Text>
                                    <Text className="text-[10px] font-display opacity-50 text-white mt-2 uppercase">Behance, GitHub, or PDF</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Bio Input */}
                            <View className="mb-9">
                                <Text className="font-display text-[10px] uppercase mb-1.5 ml-1 text-black opacity-60 tracking-[2px]">The Lore (Bio)</Text>
                                <TextInput
                                    value={bio}
                                    onChangeText={setBio}
                                    placeholder="TELL YOUR STORY..."
                                    placeholderTextColor="rgba(0,0,0,0.2)"
                                    multiline
                                    numberOfLines={4}
                                    className="w-full bg-white border-[3px] border-black px-5 py-6 text-black font-display rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] min-h-[180px] text-xl"
                                    style={{ textAlignVertical: 'top' }}
                                />
                            </View>

                            {/* Submit Button */}
                            <View className="pt-4 pb-0">
                                <TouchableOpacity
                                    onPress={() => router.push('/onboarding/story')}
                                    className="w-full bg-black h-24 items-center justify-center flex-row gap-5 border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] active:translate-y-1 active:shadow-none transition-all rounded-[30px]"
                                >
                                    <Text className="font-display text-4xl uppercase tracking-widest italic text-white leading-none">Stamp it & Go</Text>
                                    <MaterialIcons name="check-circle" size={40} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </GestureHandlerRootView>
    );
}
