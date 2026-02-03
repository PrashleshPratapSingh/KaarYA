import React, { useState, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    StyleSheet,
    Dimensions,
    Modal,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    FadeIn,
    FadeOut,
    SlideInDown,
    SlideOutDown,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.createAnimatedComponent(View);
const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Colors from the HTML
const COLORS = {
    primary: "#d4f906",
    primaryDark: "#ccf005",
    karyaBlack: "#171811",
    karyaYellow: "#d4f906",
    karyaCobalt: "#2f45ff",
    white: "#FFFFFF",
    gray: "#666666",
    lightGray: "#F5F5F5",
};

// Predefined "Other" subcategories for search - comprehensive list
const OTHER_CATEGORIES = [
    // Admin & Support
    "Virtual Assistant",
    "Data Entry",
    "Customer Support",
    "Email Management",
    "Calendar Management",
    "Project Management",
    "Research",

    // Writing & Translation
    "Translation",
    "Transcription",
    "Proofreading",
    "Content Writing",
    "Copywriting",
    "Technical Writing",
    "Resume Writing",
    "Ghostwriting",
    "Blog Writing",
    "SEO Writing",

    // Creative & Media
    "Photography",
    "Music Production",
    "Audio Editing",
    "Voice Over",
    "Podcast Editing",
    "Sound Design",
    "Animation",
    "2D Animation",
    "3D Animation",
    "Motion Graphics",
    "3D Modeling",
    "Product Visualization",

    // Tech & Development
    "Game Development",
    "AI & Machine Learning",
    "Blockchain Development",
    "Cybersecurity",
    "Cloud Services",
    "DevOps",
    "Database Management",
    "API Development",
    "QA Testing",
    "IT Support",

    // Business & Consulting
    "Consulting",
    "Business Strategy",
    "Financial Consulting",
    "Legal Consulting",
    "Tax Services",
    "Accounting",
    "Bookkeeping",
    "HR & Recruiting",
    "Career Coaching",

    // Learning & Education
    "Tutoring",
    "Online Courses",
    "Language Teaching",
    "Academic Writing",
    "Presentation Design",

    // Lifestyle & Personal
    "Fitness Coaching",
    "Nutrition Planning",
    "Life Coaching",
    "Event Planning",
    "Travel Planning",
    "Personal Styling",

    // E-commerce
    "Product Listing",
    "Amazon FBA",
    "Dropshipping",
    "Inventory Management",

    // Real Estate
    "Virtual Tours",
    "Floor Plans",
    "Real Estate Photography",

    // Other
    "Other",
];

// Category data with Material Community Icons equivalents
const CATEGORIES = [
    { id: "design", name: "DESIGN", icon: "palette-outline", align: "left" },
    { id: "video", name: "VIDEO", icon: "video-outline", align: "right" },
    { id: "code", name: "CODE", icon: "code-tags", align: "left" },
    { id: "marketing", name: "MARKETING", icon: "bullhorn-outline", align: "right" },
    { id: "writing", name: "WRITING", icon: "pencil-outline", align: "left" },
    { id: "other", name: "OTHER", icon: "view-grid-outline", align: "right" },
];

interface CategoryButtonProps {
    id: string;
    name: string;
    icon: string;
    align: string;
    isSelected: boolean;
    onSelect: (id: string) => void;
}

function CategoryButton({
    id,
    name,
    icon,
    align,
    isSelected,
    onSelect,
}: CategoryButtonProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    };

    return (
        <AnimatedPressable
            onPress={() => onSelect(id)}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[
                animatedStyle,
                styles.buttonContainer,
                align === "right" && styles.buttonAlignRight,
            ]}
        >
            <View
                style={[
                    styles.buttonInner,
                    isSelected ? styles.buttonSelected : styles.buttonUnselected,
                    isSelected ? styles.shadowActive : styles.shadowPill,
                ]}
            >
                <View style={styles.buttonContent}>
                    {!isSelected && (
                        <MaterialCommunityIcons
                            name={icon as any}
                            size={24}
                            color={COLORS.karyaBlack}
                        />
                    )}
                    <Text
                        style={[
                            styles.buttonText,
                            isSelected && styles.buttonTextSelected,
                        ]}
                    >
                        {name}
                    </Text>
                </View>
                {isSelected && (
                    <MaterialCommunityIcons
                        name="check-circle"
                        size={24}
                        color={COLORS.white}
                    />
                )}
            </View>
        </AnimatedPressable>
    );
}

export default function CategorySelectionScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [customCategory, setCustomCategory] = useState<string>("");
    const [showOtherModal, setShowOtherModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const continueScale = useSharedValue(1);
    const searchInputRef = useRef<TextInput>(null);

    const filteredCategories = OTHER_CATEGORIES.filter((cat) =>
        cat.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCategorySelect = (id: string) => {
        if (id === "other") {
            setShowOtherModal(true);
        } else {
            setSelectedCategory(id);
            setCustomCategory("");
        }
    };

    const handleOtherCategorySelect = (category: string) => {
        setSelectedCategory("other");
        setCustomCategory(category);
        setShowOtherModal(false);
        setSearchQuery("");
    };

    const handleCustomCategorySubmit = () => {
        if (searchQuery.trim()) {
            setSelectedCategory("other");
            setCustomCategory(searchQuery.trim());
            setShowOtherModal(false);
            setSearchQuery("");
        }
    };

    const handleContinue = () => {
        if (selectedCategory) {
            router.push({
                pathname: "/post-gig/details",
                params: {
                    category: selectedCategory,
                    customCategory: customCategory || undefined,
                },
            });
        }
    };

    const continueAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: continueScale.value }],
    }));

    const handleContinuePressIn = () => {
        continueScale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    };

    const handleContinuePressOut = () => {
        continueScale.value = withSpring(1, { damping: 15, stiffness: 400 });
    };

    // Get display name for selected category
    const getSelectedDisplayName = () => {
        if (selectedCategory === "other" && customCategory) {
            return customCategory.toUpperCase();
        }
        const cat = CATEGORIES.find((c) => c.id === selectedCategory);
        return cat?.name || "";
    };

    return (
        <View style={styles.container}>
            {/* Yellow Striped Background - Full screen */}
            <View style={styles.stripedBackground}>
                {[...Array(60)].map((_, i) => (
                    <View key={i} style={[styles.stripe, { top: i * 20 - 300 }]} />
                ))}
            </View>

            {/* Header - Inside SafeArea, all elements on same line */}
            <View style={[styles.safeAreaTop, { height: insets.top > 0 ? insets.top : 0, backgroundColor: COLORS.white }]} />
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

                {/* Centered Title - flex:1 to center between left and right */}
                <Text style={styles.headerTitle}>New Gig</Text>

                {/* Step Counter Capsule */}
                <View style={styles.stepCapsule}>
                    <Text style={styles.stepText}>1/5</Text>
                </View>
            </View>

            {/* Fixed Hero Title - Center aligned */}
            <View style={styles.heroContainer}>
                <Text style={styles.heroText}>Pick Your</Text>
                <View style={styles.hustleWrapper}>
                    {/* White offset shadow - positioned BEHIND */}
                    <View style={styles.hustleShadow} />
                    {/* Main hustle box - on top */}
                    <View style={styles.hustleBox}>
                        <Text style={styles.hustleText}>Hustle</Text>
                    </View>
                </View>
            </View>

            {/* Scrollable Category Buttons - Scrolls behind title */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Spacer for the fixed hero */}
                <View style={{ height: 8 }} />

                {/* Category Buttons */}
                {CATEGORIES.map((category) => (
                    <CategoryButton
                        key={category.id}
                        id={category.id}
                        name={
                            category.id === "other" && customCategory
                                ? customCategory.toUpperCase()
                                : category.name
                        }
                        icon={category.icon}
                        align={category.align}
                        isSelected={selectedCategory === category.id}
                        onSelect={handleCategorySelect}
                    />
                ))}
            </ScrollView>

            {/* Bottom CTA */}
            <View style={styles.bottomContainer}>
                <AnimatedPressable
                    onPress={handleContinue}
                    onPressIn={handleContinuePressIn}
                    onPressOut={handleContinuePressOut}
                    disabled={!selectedCategory}
                    style={[continueAnimatedStyle, styles.continueButton]}
                >
                    <Text style={styles.continueText}>Continue</Text>
                    <MaterialCommunityIcons
                        name="arrow-right"
                        size={24}
                        color={COLORS.white}
                    />
                </AnimatedPressable>
            </View>

            {/* Other Category Modal */}
            <Modal
                visible={showOtherModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowOtherModal(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.modalOverlay}
                >
                    <Pressable
                        style={styles.modalBackdrop}
                        onPress={() => setShowOtherModal(false)}
                    />
                    <View style={styles.modalContent}>
                        {/* Modal Header */}
                        <View style={styles.modalHeader}>
                            <View style={styles.modalHandle} />
                            <Text style={styles.modalTitle}>What's Your Hustle?</Text>
                            <Text style={styles.modalSubtitle}>
                                Search or type your own category
                            </Text>
                        </View>

                        {/* Search Input */}
                        <View style={styles.searchContainer}>
                            <MaterialCommunityIcons
                                name="magnify"
                                size={22}
                                color={COLORS.gray}
                                style={styles.searchIcon}
                            />
                            <TextInput
                                ref={searchInputRef}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholder="Search or type custom category..."
                                placeholderTextColor={COLORS.gray}
                                style={styles.searchInput}
                                returnKeyType="done"
                                onSubmitEditing={handleCustomCategorySubmit}
                                autoFocus
                            />
                            {searchQuery.length > 0 && (
                                <Pressable
                                    onPress={() => setSearchQuery("")}
                                    style={styles.clearButton}
                                >
                                    <MaterialCommunityIcons
                                        name="close-circle"
                                        size={20}
                                        color={COLORS.gray}
                                    />
                                </Pressable>
                            )}
                        </View>

                        {/* Custom Category Button (when typing) */}
                        {searchQuery.trim() && !filteredCategories.includes(searchQuery.trim()) && (
                            <Pressable
                                onPress={handleCustomCategorySubmit}
                                style={styles.customCategoryButton}
                            >
                                <MaterialCommunityIcons
                                    name="plus-circle"
                                    size={24}
                                    color={COLORS.karyaCobalt}
                                />
                                <Text style={styles.customCategoryText}>
                                    Create "{searchQuery.trim()}"
                                </Text>
                            </Pressable>
                        )}

                        {/* Category List */}
                        <ScrollView
                            style={styles.categoryList}
                            contentContainerStyle={styles.categoryListContent}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            {filteredCategories.length > 0 ? (
                                filteredCategories.map((category) => (
                                    <Pressable
                                        key={category}
                                        onPress={() => handleOtherCategorySelect(category)}
                                        style={({ pressed }) => [
                                            styles.categoryItem,
                                            pressed && styles.categoryItemPressed,
                                        ]}
                                        hitSlop={8}
                                    >
                                        <Text style={styles.categoryItemText} numberOfLines={1}>
                                            {category}
                                        </Text>
                                    </Pressable>
                                ))
                            ) : (
                                <View style={styles.emptyContainer}>
                                    <MaterialCommunityIcons name="magnify-close" size={48} color={COLORS.gray} />
                                    <Text style={styles.emptyText}>No matching categories</Text>
                                </View>
                            )}
                            <View style={{ height: 40 }} />
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
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
        fontStyle: "italic",
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
    heroContainer: {
        alignItems: "center",
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 16,
        zIndex: 10,
        backgroundColor: "transparent",
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
    hustleWrapper: {
        marginTop: 4,
        position: "relative",
    },
    hustleShadow: {
        position: "absolute",
        top: 4,
        left: 4,
        right: -4,
        bottom: -4,
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.karyaBlack,
    },
    hustleBox: {
        backgroundColor: COLORS.karyaBlack,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderWidth: 2,
        borderColor: COLORS.karyaBlack,
        transform: [{ rotate: "-1deg" }],
        zIndex: 1,
    },
    hustleText: {
        fontSize: 44,
        fontWeight: "900",
        letterSpacing: -2,
        textTransform: "uppercase",
        color: COLORS.karyaYellow,
        lineHeight: 48,
    },
    scrollView: {
        flex: 1,
        zIndex: 5,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 140,
        gap: 20,
    },
    buttonContainer: {
        width: "85%",
    },
    buttonAlignRight: {
        alignSelf: "flex-end",
    },
    buttonInner: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 9999,
        borderWidth: 3,
        borderColor: COLORS.karyaBlack,
    },
    buttonUnselected: {
        backgroundColor: COLORS.white,
    },
    buttonSelected: {
        backgroundColor: COLORS.karyaCobalt,
        transform: [{ scale: 1.05 }],
    },
    shadowPill: {
        shadowColor: "rgba(23, 24, 17, 0.15)",
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 3,
    },
    shadowActive: {
        shadowColor: COLORS.karyaBlack,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: -0.5,
        color: COLORS.karyaBlack,
    },
    buttonTextSelected: {
        color: COLORS.white,
    },
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
    // Modal Styles
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
    },
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: "85%",
        minHeight: 400,
        paddingBottom: 34, // Safe area fallback
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 20,
    },
    modalHeader: {
        alignItems: "center",
        paddingTop: 12,
        paddingBottom: 16,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: "#DDD",
        borderRadius: 2,
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: "800",
        color: COLORS.karyaBlack,
        marginBottom: 4,
    },
    modalSubtitle: {
        fontSize: 14,
        color: COLORS.gray,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.lightGray,
        marginHorizontal: 24,
        marginTop: 16,
        marginBottom: 8,
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 2,
        borderColor: "transparent",
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 14,
        color: COLORS.karyaBlack,
    },
    clearButton: {
        padding: 4,
    },
    customCategoryButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: "#F0F4FF",
        marginHorizontal: 24,
        marginBottom: 8,
        borderRadius: 12,
        gap: 12,
    },
    customCategoryText: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.karyaCobalt,
    },
    categoryList: {
        height: 350,
    },
    categoryListContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    categoryItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
        width: "100%",
    },
    categoryItemPressed: {
        backgroundColor: COLORS.lightGray,
        borderRadius: 8,
    },
    categoryItemText: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.karyaBlack,
        flex: 1,
    },
    chevronContainer: {
        marginLeft: 12,
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
        gap: 16,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: "500",
        color: COLORS.gray,
    },
});
