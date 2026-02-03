import React, { useState } from "react";
import {
    View,
    Text,
    Pressable,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Image,
    Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    FadeInDown,
    FadeInUp,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AttachedFile {
    name: string;
    size: string;
    type: string;
    uri: string;
}

export default function AttachmentsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
    const buttonScale = useSharedValue(1);

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ["application/pdf", "image/*", "video/*"],
                multiple: true,
            });

            if (!result.canceled && result.assets) {
                const newFiles = result.assets.map((asset) => ({
                    name: asset.name,
                    size: formatFileSize(asset.size || 0),
                    type: asset.mimeType || "unknown",
                    uri: asset.uri,
                }));
                setAttachedFiles((prev) => [...prev, ...newFiles].slice(0, 5));
            }
        } catch (error) {
            Alert.alert("Error", "Failed to pick document");
        }
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsMultipleSelection: true,
                quality: 0.8,
            });

            if (!result.canceled && result.assets) {
                const newFiles = result.assets.map((asset, index) => ({
                    name: `image_${Date.now()}_${index}.${asset.uri.split(".").pop()}`,
                    size: formatFileSize(asset.fileSize || 0),
                    type: asset.type === "video" ? "video/mp4" : "image/jpeg",
                    uri: asset.uri,
                }));
                setAttachedFiles((prev) => [...prev, ...newFiles].slice(0, 5));
            }
        } catch (error) {
            Alert.alert("Error", "Failed to pick image");
        }
    };

    const removeFile = (index: number) => {
        setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleReview = () => {
        router.push({
            pathname: "/post-gig/review",
            params: {
                ...params,
                files: JSON.stringify(attachedFiles.map((f) => ({ name: f.name, size: f.size }))),
            },
        });
    };

    const buttonAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }],
    }));

    const handleButtonPressIn = () => {
        buttonScale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
    };

    const handleButtonPressOut = () => {
        buttonScale.value = withSpring(1, { damping: 15, stiffness: 400 });
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Header */}
            <View className="flex-row items-center justify-between px-5 py-4 bg-white border-b border-gray-100">
                <Pressable
                    onPress={() => router.back()}
                    className="p-2"
                >
                    <Feather name="arrow-left" size={24} color="#000" />
                </Pressable>
                <Text className="text-lg font-black tracking-tight">POST GIG</Text>
                <View className="bg-[#D4FF00] rounded-full px-3 py-1">
                    <Text className="text-sm font-bold">4/5</Text>
                </View>
            </View>

            <ScrollView
                className="flex-1 bg-white"
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Title */}
                <Animated.View
                    entering={FadeInDown.delay(100).springify()}
                    className="px-6 pt-8 pb-6"
                >
                    <Text className="text-3xl font-black text-black">
                        Show 'em what
                    </Text>
                    <View className="bg-[#D4FF00] self-start px-2 py-1 mt-1">
                        <Text className="text-3xl font-black text-black">you need.</Text>
                    </View>
                    <Text className="text-base text-gray-600 mt-3">
                        Add reference files so they get it right.
                    </Text>
                </Animated.View>

                {/* Upload Zone */}
                <Animated.View
                    entering={FadeInDown.delay(200).springify()}
                    className="mx-6 mb-6"
                >
                    <Pressable
                        onPress={pickDocument}
                        className="border-2 border-dashed border-black rounded-3xl py-10 px-6 items-center bg-white"
                    >
                        {/* Upload Icon */}
                        <View className="w-16 h-16 rounded-2xl bg-[#D4FF00] items-center justify-center mb-4">
                            <Feather name="upload" size={28} color="#000" />
                        </View>

                        <Text className="text-xl font-black text-black mb-2">
                            DRAG OR DROP
                        </Text>

                        <View className="border border-black rounded-lg px-3 py-1 mb-4">
                            <Text className="text-sm font-medium">PDF, JPG, MP4 accepted</Text>
                        </View>

                        <Pressable
                            onPress={pickImage}
                            className="bg-black rounded-full px-6 py-3"
                        >
                            <Text className="text-white font-bold">BROWSE FILES</Text>
                        </Pressable>
                    </Pressable>
                </Animated.View>

                {/* Attached Files */}
                {attachedFiles.length > 0 && (
                    <Animated.View
                        entering={FadeInUp.delay(300).springify()}
                        className="mx-6"
                    >
                        <View className="flex-row items-center mb-4">
                            <Feather name="paperclip" size={18} color="#000" />
                            <Text className="text-sm font-bold text-black ml-2">
                                Attached Files ({attachedFiles.length})
                            </Text>
                        </View>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="-mx-2"
                        >
                            {attachedFiles.map((file, index) => (
                                <View
                                    key={index}
                                    className="mx-2 w-36 bg-gray-50 rounded-2xl overflow-hidden border border-gray-200"
                                >
                                    {/* Preview */}
                                    <View className="h-28 bg-gray-100 items-center justify-center relative">
                                        {file.type.startsWith("image") ? (
                                            <Image
                                                source={{ uri: file.uri }}
                                                className="w-full h-full"
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            <View className="w-12 h-12 bg-white rounded-lg border border-gray-200 items-center justify-center">
                                                <Feather
                                                    name={file.type.includes("pdf") ? "file-text" : "file"}
                                                    size={24}
                                                    color="#666"
                                                />
                                            </View>
                                        )}

                                        {/* Delete Button */}
                                        <Pressable
                                            onPress={() => removeFile(index)}
                                            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 items-center justify-center"
                                        >
                                            <Feather name="x" size={14} color="#FFF" />
                                        </Pressable>
                                    </View>

                                    {/* File Info */}
                                    <View className="p-3">
                                        <Text
                                            className="text-xs font-medium text-black"
                                            numberOfLines={1}
                                        >
                                            {file.name}
                                        </Text>
                                        <Text className="text-xs text-gray-400 mt-1">
                                            {file.size}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </Animated.View>
                )}
            </ScrollView>

            {/* Bottom CTA */}
            <View className="absolute bottom-0 left-0 right-0 bg-white px-6 pb-8 pt-4 border-t border-gray-100">
                <AnimatedPressable
                    onPress={handleReview}
                    onPressIn={handleButtonPressIn}
                    onPressOut={handleButtonPressOut}
                    style={[buttonAnimatedStyle]}
                    className="py-5 rounded-full flex-row items-center justify-center bg-[#00D4FF]"
                >
                    <Text className="text-black text-lg font-bold tracking-wide mr-2">
                        REVIEW HUSTLE
                    </Text>
                    <Feather name="arrow-right" size={20} color="#000" />
                </AnimatedPressable>
            </View>
        </SafeAreaView>
    );
}
