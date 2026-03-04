import { View, Text, TouchableOpacity, Dimensions, TextInput, Image, KeyboardAvoidingView, Platform, ScrollView, Modal, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useState, useEffect, useRef } from 'react';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { type ConfirmationResult } from 'firebase/auth';
import { sendOtp, verifyOtp, updateUserProfile, requireAuth } from '../../lib/auth';
import { FirebaseRecaptchaVerifierModal } from '../../components/RecaptchaVerifier';

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
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [confirmResult, setConfirmResult] = useState<ConfirmationResult | null>(null);

    // reCAPTCHA ref
    const recaptchaRef = useRef<any>(null);

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

    // ─── Phone OTP Handlers ─────────────────────────────────────────────

    const handleSendOtp = async () => {
        const cleanPhone = phone.replace(/\s/g, '');
        if (cleanPhone.length < 10) {
            Alert.alert('Invalid Phone', 'Please enter a valid phone number with country code (e.g. +919876543210)');
            return;
        }

        // Ensure country code
        const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone : `+91${cleanPhone}`;

        setIsSendingOtp(true);
        try {
            const confirmation = await sendOtp(formattedPhone, recaptchaRef.current);
            setConfirmResult(confirmation);
            setShowOtpModal(true);
        } catch (error: any) {
            console.error('OTP send error:', error);
            Alert.alert('Error', error.message || 'Failed to send OTP. Please try again.');
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otpCode.length !== 6 || !confirmResult) return;

        setIsVerifying(true);
        try {
            const user = await verifyOtp(confirmResult, otpCode);

            // Update the user profile with onboarding data
            await updateUserProfile(user.uid, {
                name,
                email,
                university,
                bio,
                skills,
            });

            setIsVerified(true);
            setShowOtpModal(false);
            setOtpCode('');
        } catch (error: any) {
            console.error('OTP verify error:', error);
            Alert.alert('Verification Failed', 'Invalid OTP. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    // ─── Other Handlers ─────────────────────────────────────────────────

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            const localUri = result.assets[0].uri;
            setImage(localUri);

            // Upload to Firebase Storage if user is authenticated
            try {
                const userId = requireAuth();
                const { uploadAvatar } = await import('../../lib/storage');
                const downloadUrl = await uploadAvatar(userId, localUri);
                await updateUserProfile(userId, { avatar_url: downloadUrl });
            } catch (error) {
                // User not authenticated yet or upload failed — that's OK,
                // the local URI is still shown. Upload happens on verify.
                console.log('Avatar upload skipped (not authenticated yet)');
            }
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

    const handleContinue = async () => {
        // If verified, save profile data before navigating
        if (isVerified) {
            try {
                const userId = requireAuth();
                await updateUserProfile(userId, {
                    name,
                    email,
                    university,
                    bio,
                    skills,
                    gradYear,
                });
            } catch {
                // Not a blocker — data already saved on verify
            }
        }
        router.push('/onboarding/story');
    };

    return (
        <GestureHandlerRootView className="flex-1">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 bg-[#FFD600] relative"
            >
                <StatusBar style="dark" />

                {/* reCAPTCHA Verifier (invisible) */}
                <FirebaseRecaptchaVerifierModal ref={recaptchaRef} />

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

                            {/* Phone Input with OTP Verification */}
                            <View className="mb-9">
                                <Text className="font-display text-[10px] uppercase mb-1.5 ml-1 text-black opacity-60 tracking-[2px]">Digits (Phone)</Text>
                                <View className="relative">
                                    <TextInput
                                        value={phone}
                                        onChangeText={setPhone}
                                        placeholder="+91 98765 43210"
                                        placeholderTextColor="rgba(0,0,0,0.3)"
                                        keyboardType="phone-pad"
                                        editable={!isVerified}
                                        className="w-full bg-white h-16 border-[3px] border-black pl-5 pr-32 text-black font-display rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-xl"
                                    />
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={handleSendOtp}
                                        disabled={isVerified || isSendingOtp}
                                        className={`absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl flex-row items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-black ${isVerified ? 'bg-[#4ADE80]' : 'bg-black'}`}
                                    >
                                        {isVerified && <MaterialIcons name="verified" size={16} color="black" />}
                                        <Text className={`text-[10px] font-display uppercase tracking-wider ${isVerified ? 'text-black' : 'text-white'}`}>
                                            {isVerified ? 'Verified' : isSendingOtp ? 'Sending...' : 'Verify'}
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
                                    onPress={handleContinue}
                                    className="w-full bg-black h-24 items-center justify-center flex-row gap-5 border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] active:translate-y-1 active:shadow-none transition-all rounded-[30px]"
                                >
                                    <Text className="font-display text-4xl uppercase tracking-widest italic text-white leading-none">Stamp it & Go</Text>
                                    <MaterialIcons name="check-circle" size={40} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                {/* OTP Verification Modal */}
                <Modal
                    visible={showOtpModal}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowOtpModal(false)}
                >
                    <View className="flex-1 justify-end">
                        <View className="bg-white rounded-t-[32px] border-t-[4px] border-x-[4px] border-black p-8 pb-12">
                            <Text className="font-display text-3xl uppercase tracking-tight text-black mb-2">
                                Enter OTP
                            </Text>
                            <Text className="text-sm text-black/60 mb-8">
                                We sent a 6-digit code to {phone}
                            </Text>

                            <TextInput
                                value={otpCode}
                                onChangeText={(text) => setOtpCode(text.replace(/[^0-9]/g, '').slice(0, 6))}
                                placeholder="● ● ● ● ● ●"
                                placeholderTextColor="rgba(0,0,0,0.2)"
                                keyboardType="number-pad"
                                maxLength={6}
                                autoFocus
                                className="w-full bg-[#FFD600] h-20 border-[3px] border-black px-6 text-black font-display rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-4xl text-center tracking-[16px]"
                            />

                            <TouchableOpacity
                                onPress={handleVerifyOtp}
                                disabled={otpCode.length !== 6 || isVerifying}
                                className={`w-full h-16 mt-6 items-center justify-center rounded-2xl border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${otpCode.length === 6 ? 'bg-[#4ADE80]' : 'bg-gray-200'}`}
                            >
                                <Text className="font-display text-xl uppercase tracking-wider text-black">
                                    {isVerifying ? 'Verifying...' : 'Confirm'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => { setShowOtpModal(false); setOtpCode(''); }}
                                className="mt-4 items-center"
                            >
                                <Text className="font-display text-sm uppercase tracking-wider text-black/40">Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        </GestureHandlerRootView>
    );
}
