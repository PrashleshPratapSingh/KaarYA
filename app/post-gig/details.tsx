import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    StyleSheet,
    Dimensions,
    Keyboard,
    Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    FadeInDown,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Colors - consistent with index.tsx
const COLORS = {
    primary: "#d4f906",
    primaryDark: "#ccf005",
    karyaBlack: "#171811",
    karyaYellow: "#d4f906",
    karyaCobalt: "#2f45ff",
    white: "#FFFFFF",
    gray: "#666666",
    lightGray: "#F5F5F5",
    backgroundLight: "#f8f8f5",
};

const SUGGESTED_SKILLS: Record<string, string[]> = {
    design: ["LogoDesign", "Branding", "Illustration", "UI/UX", "Poster"],
    video: ["VideoEditing", "MotionGraphics", "ColorGrading", "Thumbnail", "Reels"],
    code: ["WebDev", "MobileApp", "Backend", "Frontend", "API"],
    marketing: ["SocialMedia", "SEO", "Content", "Ads", "Strategy"],
    writing: ["Copywriting", "Blog", "Script", "Technical", "Creative"],
    other: ["VirtualAssistant", "DataEntry", "Research", "Translation"],
};

export default function GigDetailsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { category, customCategory } = useLocalSearchParams<{
        category: string;
        customCategory: string;
    }>();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [showAddSkillModal, setShowAddSkillModal] = useState(false);
    const [customSkill, setCustomSkill] = useState("");

    const buttonScale = useSharedValue(1);

    const suggestedSkills =
        SUGGESTED_SKILLS[category || "other"] || SUGGESTED_SKILLS.other;

    // Keyboard visibility listener
    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setKeyboardVisible(true);
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardVisible(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const toggleSkill = (skill: string) => {
        setSelectedSkills((prev) =>
            prev.includes(skill)
                ? prev.filter((s) => s !== skill)
                : prev.length < 5
                    ? [...prev, skill]
                    : prev
        );
    };

    const addCustomSkill = () => {
        if (customSkill.trim() && selectedSkills.length < 5) {
            const formattedSkill = customSkill.trim().replace(/\s+/g, "");
            if (!selectedSkills.includes(formattedSkill)) {
                setSelectedSkills((prev) => [...prev, formattedSkill]);
            }
            setCustomSkill("");
            setShowAddSkillModal(false);
        }
    };

    const handleNext = () => {
        router.push({
            pathname: "/post-gig/budget",
            params: {
                category,
                customCategory,
                title,
                description,
                skills: selectedSkills.join(","),
            },
        });
    };

    const buttonAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }],
    }));

    const handleButtonPressIn = () => {
        buttonScale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    };

    const handleButtonPressOut = () => {
        buttonScale.value = withSpring(1, { damping: 15, stiffness: 400 });
    };

    return (
        <View style={styles.container}>
            {/* Yellow Striped Background - Full screen */}
            <View style={styles.stripedBackground}>
                {[...Array(60)].map((_, i) => (
                    <View key={i} style={[styles.stripe, { top: i * 20 - 300 }]} />
                ))}
            </View>

            {/* Header - Consistent with index.tsx */}
            <View
                style={[
                    styles.safeAreaTop,
                    { height: insets.top > 0 ? insets.top : 0, backgroundColor: COLORS.white },
                ]}
            />
            <View style={styles.header}>
                {/* Back Button */}
                <Pressable
                    onPress={() => router.back()}
                    style={({ pressed }) => [
                        styles.backButton,
                        pressed && styles.backButtonPressed,
                    ]}
                >
                    <MaterialCommunityIcons
                        name="arrow-left"
                        size={20}
                        color={COLORS.karyaBlack}
                    />
                </Pressable>

                {/* Centered Title */}
                <Text style={styles.headerTitle}>Gig Details</Text>

                {/* Step Counter Capsule */}
                <View style={styles.stepCapsule}>
                    <Text style={styles.stepText}>2/5</Text>
                </View>
            </View>

            {/* Scrollable Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: isKeyboardVisible ? 20 : 180 },
                ]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Hero Title - Same style as "Pick Your Hustle" */}
                <View style={styles.heroContainer}>
                    <Text style={styles.heroText}>What's</Text>
                    <View style={styles.gigWrapper}>
                        {/* White offset shadow - positioned BEHIND */}
                        <View style={styles.gigShadow} />
                        {/* Main gig box - on top */}
                        <View style={styles.gigBox}>
                            <Text style={styles.gigText}>the gig?</Text>
                        </View>
                    </View>
                </View>

                {/* Form Fields */}
                <View style={styles.formContainer}>
                    {/* Gig Title Input */}
                    <Animated.View
                        entering={FadeInDown.delay(150).springify()}
                        style={styles.inputGroup}
                    >
                        <Text style={styles.inputLabel}>Gig Title</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                value={title}
                                onChangeText={setTitle}
                                placeholder="e.g. Design a logo for my startup"
                                placeholderTextColor="#9CA3AF"
                                style={styles.textInput}
                                maxLength={80}
                            />
                        </View>
                    </Animated.View>

                    {/* Description Textarea */}
                    <Animated.View
                        entering={FadeInDown.delay(200).springify()}
                        style={styles.inputGroup}
                    >
                        <Text style={styles.inputLabel}>Description</Text>
                        <View style={styles.textareaWrapper}>
                            <TextInput
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Describe the work in detail. What deliverables are you expecting? What is the deadline?"
                                placeholderTextColor="#9CA3AF"
                                style={styles.textarea}
                                multiline
                                numberOfLines={6}
                                textAlignVertical="top"
                            />
                        </View>
                    </Animated.View>

                    {/* Skills Section */}
                    <Animated.View
                        entering={FadeInDown.delay(250).springify()}
                        style={styles.inputGroup}
                    >
                        <Text style={styles.inputLabel}>Skills Needed</Text>
                        <View style={styles.skillsContainer}>
                            {/* All Skills */}
                            {[...selectedSkills, ...suggestedSkills.filter(s => !selectedSkills.includes(s))].map((skill) => {
                                const isSelected = selectedSkills.includes(skill);
                                return (
                                    <Pressable
                                        key={skill}
                                        onPress={() => toggleSkill(skill)}
                                        style={({ pressed }) => [
                                            styles.skillTag,
                                            isSelected ? styles.skillTagActive : styles.skillTagInactive,
                                            pressed && styles.skillTagPressed,
                                        ]}
                                    >
                                        <Text style={isSelected ? styles.skillTextActive : styles.skillTextInactive}>
                                            #{skill}
                                        </Text>
                                        {isSelected && (
                                            <MaterialCommunityIcons
                                                name="close"
                                                size={14}
                                                color={COLORS.white}
                                            />
                                        )}
                                    </Pressable>
                                );
                            })}

                            {/* Add Tag Button */}
                            <Pressable
                                onPress={() => setShowAddSkillModal(true)}
                                style={styles.addTagButton}
                            >
                                <MaterialCommunityIcons
                                    name="plus"
                                    size={20}
                                    color={COLORS.karyaBlack}
                                />
                            </Pressable>
                        </View>
                    </Animated.View>

                    {/* Save Draft Link - Inside scroll */}
                    <Pressable style={styles.saveDraftButton}>
                        <Text style={styles.saveDraftText}>Save Draft</Text>
                    </Pressable>
                </View>
            </ScrollView>

            {/* Fixed Bottom CTA - Same as index.tsx Continue button */}
            {!isKeyboardVisible && (
                <View style={styles.bottomContainer}>
                    <AnimatedPressable
                        onPress={handleNext}
                        onPressIn={handleButtonPressIn}
                        onPressOut={handleButtonPressOut}
                        style={[buttonAnimatedStyle, styles.continueButton]}
                    >
                        <Text style={styles.continueText}>Continue</Text>
                        <MaterialCommunityIcons
                            name="arrow-right"
                            size={24}
                            color={COLORS.white}
                        />
                    </AnimatedPressable>
                </View>
            )}

            {/* Add Custom Skill Modal */}
            <Modal
                visible={showAddSkillModal}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setShowAddSkillModal(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setShowAddSkillModal(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Custom Skill</Text>
                        <View style={styles.modalInputWrapper}>
                            <TextInput
                                value={customSkill}
                                onChangeText={setCustomSkill}
                                placeholder="Enter skill name..."
                                placeholderTextColor="#9CA3AF"
                                style={styles.modalInput}
                                autoFocus
                                onSubmitEditing={addCustomSkill}
                            />
                        </View>
                        <View style={styles.modalButtons}>
                            <Pressable
                                onPress={() => setShowAddSkillModal(false)}
                                style={styles.modalCancelButton}
                            >
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                onPress={addCustomSkill}
                                style={styles.modalAddButton}
                            >
                                <Text style={styles.modalAddText}>Add</Text>
                            </Pressable>
                        </View>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
    },
    stripedBackground: {
        ...StyleSheet.absoluteFillObject,
        overflow: "hidden",
        transform: [{ rotate: "45deg" }],
    },
    stripe: {
        position: "absolute",
        left: -200,
        width: SCREEN_WIDTH * 3,
        height: 10,
        backgroundColor: COLORS.primaryDark,
    },
    safeAreaTop: {
        width: "100%",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: COLORS.white,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 4,
        borderBottomColor: COLORS.karyaBlack,
        zIndex: 50,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: COLORS.karyaBlack,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.white,
        shadowColor: COLORS.karyaBlack,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 2,
    },
    backButtonPressed: {
        backgroundColor: COLORS.karyaYellow,
        transform: [{ scale: 0.95 }],
    },
    headerTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: "800",
        textTransform: "uppercase",
        letterSpacing: -0.5,
        color: COLORS.karyaBlack,
        textAlign: "center",
    },
    stepCapsule: {
        backgroundColor: COLORS.karyaBlack,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    stepText: {
        fontSize: 12,
        fontWeight: "700",
        color: COLORS.white,
        letterSpacing: 0.5,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
    },
    // Hero Title - Same as "Pick Your Hustle" style
    heroContainer: {
        alignItems: "center",
        paddingTop: 32,
        paddingBottom: 24,
    },
    heroText: {
        fontSize: 44,
        fontWeight: "900",
        lineHeight: 40,
        letterSpacing: -2,
        textTransform: "uppercase",
        color: COLORS.karyaBlack,
        textAlign: "center",
    },
    gigWrapper: {
        marginTop: 4,
        position: "relative",
    },
    gigShadow: {
        position: "absolute",
        top: 4,
        left: 4,
        right: -4,
        bottom: -4,
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.karyaBlack,
    },
    gigBox: {
        backgroundColor: COLORS.karyaBlack,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderWidth: 2,
        borderColor: COLORS.karyaBlack,
        transform: [{ rotate: "-1deg" }],
        zIndex: 1,
    },
    gigText: {
        fontSize: 44,
        fontWeight: "900",
        letterSpacing: -2,
        textTransform: "uppercase",
        color: COLORS.karyaYellow,
        lineHeight: 48,
    },
    formContainer: {
        gap: 24,
    },
    inputGroup: {
        marginBottom: 0,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.karyaBlack,
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 8,
    },
    inputWrapper: {
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.karyaBlack,
        borderRadius: 8,
        shadowColor: COLORS.karyaBlack,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    textInput: {
        height: 56,
        paddingHorizontal: 16,
        fontSize: 18,
        fontWeight: "500",
        color: COLORS.karyaBlack,
    },
    textareaWrapper: {
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.karyaBlack,
        borderRadius: 8,
        shadowColor: COLORS.karyaBlack,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    textarea: {
        minHeight: 160,
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 18,
        fontWeight: "500",
        color: COLORS.karyaBlack,
        lineHeight: 26,
    },
    skillsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    skillTag: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 999,
        borderWidth: 2,
        gap: 8,
        shadowColor: COLORS.karyaBlack,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 2,
    },
    skillTagActive: {
        backgroundColor: COLORS.karyaBlack,
        borderColor: COLORS.karyaBlack,
    },
    skillTagInactive: {
        backgroundColor: COLORS.white,
        borderColor: COLORS.karyaBlack,
    },
    skillTagPressed: {
        transform: [{ scale: 0.95 }],
    },
    skillTextActive: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.white,
    },
    skillTextInactive: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.karyaBlack,
    },
    addTagButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 2,
        borderStyle: "dashed",
        borderColor: COLORS.karyaBlack,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
    },
    // Bottom Container - Same as index.tsx
    bottomContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        paddingBottom: 24,
        paddingTop: 48,
        zIndex: 40,
    },
    continueButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.karyaBlack,
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.karyaBlack,
        gap: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    continueText: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.white,
        textTransform: "uppercase",
        letterSpacing: 2,
    },
    saveDraftButton: {
        alignSelf: "center",
        paddingVertical: 16,
        marginTop: 24,
    },
    saveDraftText: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.karyaBlack,
        textDecorationLine: "underline",
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    modalContent: {
        width: "100%",
        backgroundColor: COLORS.white,
        borderRadius: 16,
        borderWidth: 3,
        borderColor: COLORS.karyaBlack,
        padding: 24,
        shadowColor: COLORS.karyaBlack,
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 8,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: COLORS.karyaBlack,
        textAlign: "center",
        marginBottom: 16,
    },
    modalInputWrapper: {
        backgroundColor: COLORS.lightGray,
        borderWidth: 2,
        borderColor: COLORS.karyaBlack,
        borderRadius: 8,
        marginBottom: 20,
    },
    modalInput: {
        height: 50,
        paddingHorizontal: 16,
        fontSize: 16,
        fontWeight: "500",
        color: COLORS.karyaBlack,
    },
    modalButtons: {
        flexDirection: "row",
        gap: 12,
    },
    modalCancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: COLORS.karyaBlack,
        alignItems: "center",
    },
    modalCancelText: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.karyaBlack,
    },
    modalAddButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        backgroundColor: COLORS.karyaBlack,
        borderWidth: 2,
        borderColor: COLORS.karyaBlack,
        alignItems: "center",
    },
    modalAddText: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.white,
    },
});
