import React, { useState, useMemo } from "react";
import {
    View,
    Text,
    Pressable,
    ScrollView,
    StyleSheet,
    Dimensions,
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

// Colors - consistent with all screens
const COLORS = {
    primary: "#d4f906",
    primaryDark: "#ccf005",
    karyaBlack: "#171811",
    karyaYellow: "#d4f906",
    white: "#FFFFFF",
    backgroundLight: "#fffdf5",
    gray: "#8a8760",
    grayLight: "#e6e5db",
};

const CATEGORY_NAMES: Record<string, { label: string; sub: string }> = {
    design: { label: "Graphic Design", sub: "Logo & Brand Identity" },
    video: { label: "Video Editing", sub: "Content & Motion" },
    code: { label: "Development", sub: "Web & Mobile Apps" },
    marketing: { label: "Marketing", sub: "Social & Digital" },
    writing: { label: "Writing", sub: "Content & Copy" },
    other: { label: "Other", sub: "Miscellaneous" },
};

// Mock attachments data (same as attachments screen)
const MOCK_ATTACHMENTS = [
    { id: "1", name: "brand_guidelines_v2.jpg", type: "image", size: "2.4 MB" },
    { id: "2", name: "project_brief_draft.pdf", type: "pdf", size: "540 KB" },
];

export default function ReviewScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams();

    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const buttonScale = useSharedValue(1);

    // Parse params
    const category = params.category as string;
    const amount = params.amount as string;
    const deadline = params.deadline as string;

    // Parse attachments from params or use mock
    const attachments = useMemo(() => {
        try {
            const parsed = JSON.parse((params.attachments as string) || "[]");
            if (parsed.length > 0) {
                // If we have attachment names from the attachments screen
                return parsed.map((name: string, index: number) => ({
                    id: String(index),
                    name,
                    type: name.endsWith(".pdf") ? "pdf" : "image",
                    size: index === 0 ? "2.4 MB" : "540 KB",
                }));
            }
            return MOCK_ATTACHMENTS;
        } catch {
            return MOCK_ATTACHMENTS;
        }
    }, [params.attachments]);

    // Generate manifest ID
    const manifestId = useMemo(() => {
        return `#KY-${Math.floor(1000 + Math.random() * 9000)}`;
    }, []);

    // Format deadline
    const formattedDeadline = useMemo(() => {
        if (!deadline) return "Oct 24, 2023";
        const date = new Date(deadline);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }, [deadline]);

    const categoryInfo = CATEGORY_NAMES[category] || CATEGORY_NAMES.design;

    const handleBlastLive = () => {
        if (agreedToTerms) {
            router.push("/post-gig/success");
        }
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
            {/* Yellow Striped Background - Same as other screens */}
            <View style={styles.stripedBackground}>
                {[...Array(60)].map((_, i) => (
                    <View key={i} style={[styles.stripe, { top: i * 20 - 300 }]} />
                ))}
            </View>

            {/* Header - Consistent with other screens */}
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
                <Text style={styles.headerTitle}>Final Review</Text>

                {/* Step Counter Capsule */}
                <View style={styles.stepCapsule}>
                    <Text style={styles.stepText}>5/5</Text>
                </View>
            </View>

            {/* Scrollable Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Receipt Card */}
                <Animated.View
                    entering={FadeInDown.delay(100).springify()}
                    style={styles.receiptCard}
                >
                    {/* Receipt Header */}
                    <View style={styles.receiptHeader}>
                        <View>
                            <Text style={styles.manifestLabel}>Manifest ID</Text>
                            <Text style={styles.manifestId}>{manifestId}</Text>
                        </View>
                        <View style={styles.receiptIcon}>
                            <MaterialCommunityIcons
                                name="receipt"
                                size={20}
                                color={COLORS.primary}
                            />
                        </View>
                    </View>

                    {/* Section: Category */}
                    <View style={styles.receiptSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionLabel}>Category</Text>
                            <Pressable
                                style={styles.editButton}
                                onPress={() => router.push("/post-gig")}
                            >
                                <Text style={styles.editButtonText}>EDIT</Text>
                            </Pressable>
                        </View>
                        <Text style={styles.sectionTitle}>{categoryInfo.label}</Text>
                        <Text style={styles.sectionSubtitle}>{categoryInfo.sub}</Text>
                    </View>

                    {/* Section: Gig Details */}
                    <View style={styles.receiptSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionLabel}>Gig Details</Text>
                            <Pressable
                                style={styles.editButton}
                                onPress={() => router.push("/post-gig/details")}
                            >
                                <Text style={styles.editButtonText}>EDIT</Text>
                            </Pressable>
                        </View>
                        <View style={styles.detailsGrid}>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Type</Text>
                                <Text style={styles.detailValue}>One-time Project</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Deadline</Text>
                                <Text style={styles.detailValue}>{formattedDeadline}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Location</Text>
                                <Text style={styles.detailValue}>Remote</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Visibility</Text>
                                <View style={styles.visibilityRow}>
                                    <MaterialCommunityIcons
                                        name="earth"
                                        size={14}
                                        color={COLORS.karyaBlack}
                                    />
                                    <Text style={styles.detailValue}>Public</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Section: Budget */}
                    <View style={[styles.receiptSection, styles.budgetSection]}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionLabel}>Total Budget</Text>
                            <Pressable
                                style={styles.editButton}
                                onPress={() => router.push("/post-gig/budget")}
                            >
                                <Text style={styles.editButtonText}>EDIT</Text>
                            </Pressable>
                        </View>
                        <View style={styles.budgetRow}>
                            <Text style={styles.budgetAmount}>
                                ₹{parseInt(amount || "5000").toLocaleString()}
                            </Text>
                            <Text style={styles.budgetCurrency}>INR</Text>
                        </View>
                        <View style={styles.paymentRow}>
                            <MaterialCommunityIcons
                                name="credit-card-outline"
                                size={16}
                                color={COLORS.gray}
                            />
                            <Text style={styles.paymentText}>Via UPI / GPay</Text>
                        </View>
                    </View>

                    {/* Section: Attachments */}
                    <View style={styles.receiptSectionLast}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionLabel}>Attachments</Text>
                            <Pressable
                                style={styles.editButton}
                                onPress={() => router.push("/post-gig/attachments")}
                            >
                                <Text style={styles.editButtonText}>EDIT</Text>
                            </Pressable>
                        </View>
                        {attachments.map((file: any) => (
                            <View key={file.id} style={styles.attachmentItem}>
                                <View style={styles.attachmentIcon}>
                                    <MaterialCommunityIcons
                                        name={file.type === "pdf" ? "file-pdf-box" : "image"}
                                        size={18}
                                        color={COLORS.karyaBlack}
                                    />
                                </View>
                                <View style={styles.attachmentInfo}>
                                    <Text style={styles.attachmentName} numberOfLines={1}>
                                        {file.name}
                                    </Text>
                                    <Text style={styles.attachmentSize}>{file.size}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </Animated.View>

                {/* Terms Checkbox */}
                <Pressable
                    onPress={() => setAgreedToTerms(!agreedToTerms)}
                    style={styles.termsContainer}
                >
                    <View
                        style={[
                            styles.checkbox,
                            agreedToTerms && styles.checkboxChecked,
                        ]}
                    >
                        {agreedToTerms && (
                            <MaterialCommunityIcons
                                name="check"
                                size={16}
                                color={COLORS.primary}
                            />
                        )}
                    </View>
                    <View style={styles.termsTextContainer}>
                        <Text style={styles.termsTitle}>
                            I agree to the Terms & Conditions
                        </Text>
                        <Text style={styles.termsSubtitle}>
                            By posting, you agree to Karya's community guidelines and payment policy.
                        </Text>
                    </View>
                </Pressable>
            </ScrollView>

            {/* Fixed Bottom CTA - Same as index.tsx Continue button */}
            <View style={styles.bottomContainer}>
                <AnimatedPressable
                    onPress={handleBlastLive}
                    onPressIn={handleButtonPressIn}
                    onPressOut={handleButtonPressOut}
                    disabled={!agreedToTerms}
                    style={[
                        buttonAnimatedStyle,
                        styles.continueButton,
                        !agreedToTerms && styles.continueButtonDisabled,
                    ]}
                >
                    <Text
                        style={[
                            styles.continueText,
                            !agreedToTerms && styles.continueTextDisabled,
                        ]}
                    >
                        Make it Live
                    </Text>
                    <MaterialCommunityIcons
                        name="arrow-right"
                        size={24}
                        color={agreedToTerms ? COLORS.white : "#888888"}
                    />
                </AnimatedPressable>
            </View>
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
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 140,
    },
    // Receipt Card
    receiptCard: {
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.karyaBlack,
        shadowColor: COLORS.karyaBlack,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
        marginBottom: 20,
    },
    receiptHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.karyaBlack,
        borderStyle: "dashed",
        backgroundColor: "#f8f8f5",
    },
    manifestLabel: {
        fontSize: 10,
        fontWeight: "700",
        color: COLORS.gray,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    manifestId: {
        fontSize: 20,
        fontWeight: "900",
        color: COLORS.karyaBlack,
        marginTop: 4,
        fontFamily: "monospace",
    },
    receiptIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.karyaBlack,
        alignItems: "center",
        justifyContent: "center",
    },
    receiptSection: {
        padding: 20,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.grayLight,
        borderStyle: "dashed",
    },
    receiptSectionLast: {
        padding: 20,
        paddingBottom: 24,
    },
    budgetSection: {
        backgroundColor: "#fdfdfc",
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 8,
    },
    sectionLabel: {
        fontSize: 10,
        fontWeight: "700",
        color: COLORS.gray,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    editButton: {
        backgroundColor: COLORS.karyaBlack,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    editButtonText: {
        fontSize: 10,
        fontWeight: "700",
        color: COLORS.primary,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.karyaBlack,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: "rgba(23, 24, 17, 0.6)",
        marginTop: 2,
    },
    detailsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 8,
    },
    detailItem: {
        width: "50%",
        marginBottom: 12,
    },
    detailLabel: {
        fontSize: 12,
        color: COLORS.gray,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.karyaBlack,
        marginTop: 2,
    },
    visibilityRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: 2,
    },
    budgetRow: {
        flexDirection: "row",
        alignItems: "baseline",
        gap: 4,
    },
    budgetAmount: {
        fontSize: 32,
        fontWeight: "900",
        color: COLORS.karyaBlack,
    },
    budgetCurrency: {
        fontSize: 14,
        fontWeight: "500",
        color: COLORS.gray,
    },
    paymentRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 8,
    },
    paymentText: {
        fontSize: 14,
        fontWeight: "500",
        color: COLORS.karyaBlack,
    },
    attachmentItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.grayLight,
        borderRadius: 4,
        marginTop: 8,
    },
    attachmentIcon: {
        width: 32,
        height: 32,
        borderRadius: 4,
        backgroundColor: `${COLORS.primary}33`,
        alignItems: "center",
        justifyContent: "center",
    },
    attachmentInfo: {
        flex: 1,
        marginLeft: 12,
    },
    attachmentName: {
        fontSize: 14,
        fontWeight: "500",
        color: COLORS.karyaBlack,
    },
    attachmentSize: {
        fontSize: 12,
        color: COLORS.gray,
        marginTop: 2,
    },
    // Terms
    termsContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        padding: 16,
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.karyaBlack,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: COLORS.karyaBlack,
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
        backgroundColor: COLORS.white,
    },
    checkboxChecked: {
        backgroundColor: COLORS.karyaBlack,
    },
    termsTextContainer: {
        flex: 1,
    },
    termsTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.karyaBlack,
    },
    termsSubtitle: {
        fontSize: 12,
        color: "rgba(23, 24, 17, 0.7)",
        marginTop: 4,
        lineHeight: 18,
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
    continueButtonDisabled: {
        backgroundColor: "#cccccc",
        borderColor: "#cccccc",
    },
    continueText: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.white,
        textTransform: "uppercase",
        letterSpacing: 2,
    },
    continueTextDisabled: {
        color: "#888888",
    },
});
