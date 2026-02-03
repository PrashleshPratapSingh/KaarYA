import React, { useState } from "react";
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
    FadeInUp,
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
    accentRed: "#ff4d4d",
    gray: "#666666",
};

interface AttachedFile {
    id: string;
    name: string;
    type: "image" | "pdf";
    size: string;
}

export default function AttachmentsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams();

    const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
    const buttonScale = useSharedValue(1);

    // Mock function - adds sample files when Browse is clicked
    const addMockFiles = () => {
        const mockFiles: AttachedFile[] = [
            {
                id: "1",
                name: "brand_guidelines_v2.jpg",
                type: "image",
                size: "2.4 MB",
            },
            {
                id: "2",
                name: "project_brief_draft.pdf",
                type: "pdf",
                size: "540 KB",
            },
        ];
        setAttachedFiles(mockFiles);
    };

    const removeFile = (id: string) => {
        setAttachedFiles((prev) => prev.filter((file) => file.id !== id));
    };

    const handleReview = () => {
        router.push({
            pathname: "/post-gig/review",
            params: {
                ...params,
                attachments: JSON.stringify(attachedFiles.map((f) => f.name)),
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
                <Text style={styles.headerTitle}>Post Gig</Text>

                {/* Step Counter Capsule */}
                <View style={styles.stepCapsule}>
                    <Text style={styles.stepText}>4/5</Text>
                </View>
            </View>

            {/* Scrollable Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Title - Same style as other screens */}
                <Animated.View
                    entering={FadeInDown.delay(100).springify()}
                    style={styles.heroContainer}
                >
                    <Text style={styles.heroText}>Show 'em what</Text>
                    <View style={styles.needWrapper}>
                        {/* White offset shadow */}
                        <View style={styles.needShadow} />
                        {/* Main box */}
                        <View style={styles.needBox}>
                            <Text style={styles.needText}>you need.</Text>
                        </View>
                    </View>
                    <Text style={styles.subtitle}>
                        Add reference files so they get it right.
                    </Text>
                </Animated.View>

                {/* Upload Zone */}
                <Animated.View
                    entering={FadeInDown.delay(200).springify()}
                    style={styles.uploadSection}
                >
                    <View style={styles.uploadZone}>
                        {/* Upload Icon with neobrutalist style */}
                        <View style={styles.uploadIconWrapper}>
                            <View style={styles.uploadIconShadow} />
                            <View style={styles.uploadIconBox}>
                                <MaterialCommunityIcons
                                    name="file-upload-outline"
                                    size={36}
                                    color={COLORS.karyaBlack}
                                />
                            </View>
                        </View>

                        <Text style={styles.uploadTitle}>DRAG OR DROP</Text>

                        <View style={styles.fileTypeBadge}>
                            <Text style={styles.fileTypeText}>PDF, JPG, MP4 accepted</Text>
                        </View>

                        <Pressable
                            onPress={addMockFiles}
                            style={({ pressed }) => [
                                styles.browseButton,
                                pressed && styles.browseButtonPressed,
                            ]}
                        >
                            <Text style={styles.browseButtonText}>BROWSE FILES</Text>
                        </Pressable>
                    </View>
                </Animated.View>

                {/* Attached Files Grid - Polaroid Style */}
                {attachedFiles.length > 0 && (
                    <Animated.View
                        entering={FadeInUp.delay(300).springify()}
                        style={styles.filesSection}
                    >
                        <View style={styles.filesSectionHeader}>
                            <MaterialCommunityIcons
                                name="paperclip"
                                size={20}
                                color={COLORS.karyaBlack}
                            />
                            <Text style={styles.filesSectionTitle}>
                                Attached Files ({attachedFiles.length})
                            </Text>
                        </View>

                        <View style={styles.filesGrid}>
                            {attachedFiles.map((file, index) => (
                                <View
                                    key={file.id}
                                    style={[
                                        styles.fileCard,
                                        { transform: [{ rotate: index % 2 === 0 ? "-2deg" : "1deg" }] },
                                    ]}
                                >
                                    {/* File Preview */}
                                    <View style={[
                                        styles.filePreview,
                                        file.type === "image" ? styles.imagePreviewBg : styles.pdfPreviewBg
                                    ]}>
                                        {file.type === "image" ? (
                                            // Mock image preview - beige/tan colored box with document icon
                                            <View style={styles.mockImagePreview}>
                                                <MaterialCommunityIcons
                                                    name="file-document-outline"
                                                    size={32}
                                                    color={COLORS.karyaBlack}
                                                />
                                            </View>
                                        ) : (
                                            // PDF preview - greenish yellow with PDF icons
                                            <View style={styles.filePlaceholder}>
                                                <MaterialCommunityIcons
                                                    name="file-pdf-box"
                                                    size={40}
                                                    color={COLORS.karyaBlack}
                                                />
                                                <View style={styles.pdfBadge}>
                                                    <Text style={styles.pdfBadgeText}>PDF</Text>
                                                </View>
                                            </View>
                                        )}
                                    </View>

                                    {/* File Info */}
                                    <Text style={styles.fileName} numberOfLines={1}>
                                        {file.name}
                                    </Text>
                                    <Text style={styles.fileSize}>{file.size}</Text>

                                    {/* Remove Button */}
                                    <Pressable
                                        onPress={() => removeFile(file.id)}
                                        style={styles.removeButton}
                                    >
                                        <MaterialCommunityIcons
                                            name="close"
                                            size={16}
                                            color={COLORS.white}
                                        />
                                    </Pressable>
                                </View>
                            ))}
                        </View>
                    </Animated.View>
                )}
            </ScrollView>

            {/* Fixed Bottom CTA - Same as other screens */}
            <View style={styles.bottomContainer}>
                <AnimatedPressable
                    onPress={handleReview}
                    onPressIn={handleButtonPressIn}
                    onPressOut={handleButtonPressOut}
                    style={[buttonAnimatedStyle, styles.continueButton]}
                >
                    <Text style={styles.continueText}>Review Hustle</Text>
                    <MaterialCommunityIcons
                        name="arrow-right"
                        size={24}
                        color={COLORS.white}
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
        paddingHorizontal: 20,
        paddingBottom: 120,
    },
    // Hero Section
    heroContainer: {
        paddingTop: 32,
        paddingBottom: 24,
    },
    heroText: {
        fontSize: 36,
        fontWeight: "900",
        letterSpacing: -1,
        color: COLORS.karyaBlack,
    },
    needWrapper: {
        alignSelf: "flex-start",
        marginTop: 4,
        marginBottom: 12,
        position: "relative",
    },
    needShadow: {
        position: "absolute",
        top: 4,
        left: 4,
        right: -4,
        bottom: -4,
        backgroundColor: COLORS.karyaBlack,
        borderWidth: 2,
        borderColor: COLORS.karyaBlack,
    },
    needBox: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 2,
        borderColor: COLORS.karyaBlack,
        transform: [{ rotate: "-1deg" }],
        zIndex: 1,
    },
    needText: {
        fontSize: 36,
        fontWeight: "900",
        letterSpacing: -1,
        color: COLORS.karyaBlack,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: "500",
        color: "rgba(23, 24, 17, 0.7)",
        marginTop: 4,
    },
    // Upload Section
    uploadSection: {
        marginBottom: 32,
    },
    uploadZone: {
        backgroundColor: COLORS.backgroundLight,
        borderRadius: 16,
        borderWidth: 4,
        borderStyle: "dashed",
        borderColor: COLORS.karyaBlack,
        paddingTop: 32,
        paddingBottom: 40,
        paddingHorizontal: 24,
        alignItems: "center",
        gap: 24,
        overflow: "visible",
    },
    uploadIconWrapper: {
        position: "relative",
        width: 80,
        height: 80,
    },
    uploadIconShadow: {
        position: "absolute",
        top: 4,
        left: 4,
        width: 76,
        height: 76,
        backgroundColor: COLORS.karyaBlack,
        borderRadius: 12,
    },
    uploadIconBox: {
        position: "absolute",
        top: 0,
        left: 0,
        width: 76,
        height: 76,
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.karyaBlack,
        alignItems: "center",
        justifyContent: "center",
        transform: [{ rotate: "3deg" }],
    },
    uploadTitle: {
        fontSize: 24,
        fontWeight: "900",
        color: COLORS.karyaBlack,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    fileTypeBadge: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.karyaBlack,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        shadowColor: COLORS.karyaBlack,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 2,
    },
    fileTypeText: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.karyaBlack,
    },
    browseButton: {
        backgroundColor: "#171811",
        paddingHorizontal: 36,
        paddingVertical: 16,
        borderRadius: 28,
        minWidth: 180,
        alignItems: "center",
        justifyContent: "center",
    },
    browseButtonPressed: {
        backgroundColor: "#2a2b22",
    },
    browseButtonText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#171811",
        textTransform: "uppercase",
        letterSpacing: 1.5,
    },
    // Files Section - Polaroid Style
    filesSection: {
        flex: 1,
    },
    filesSectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        gap: 8,
    },
    filesSectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.karyaBlack,
    },
    filesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 16,
    },
    fileCard: {
        width: (SCREEN_WIDTH - 56) / 2,
        backgroundColor: COLORS.white,
        padding: 12,
        paddingBottom: 32,
        borderWidth: 2,
        borderColor: COLORS.karyaBlack,
        shadowColor: COLORS.karyaBlack,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    filePreview: {
        width: "100%",
        aspectRatio: 1,
        borderWidth: 1,
        borderColor: COLORS.karyaBlack,
        marginBottom: 8,
        overflow: "hidden",
    },
    imagePreviewBg: {
        backgroundColor: "#D4C4B0", // Beige/tan color like the reference
    },
    pdfPreviewBg: {
        backgroundColor: "#E8F0D0", // Greenish yellow for PDF
    },
    mockImagePreview: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#D4C4B0",
    },
    filePlaceholder: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#E8F0D0",
        gap: 4,
    },
    pdfBadge: {
        backgroundColor: COLORS.karyaBlack,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    pdfBadgeText: {
        fontSize: 10,
        fontWeight: "700",
        color: COLORS.white,
    },
    fileName: {
        fontSize: 12,
        fontWeight: "700",
        color: COLORS.karyaBlack,
    },
    fileSize: {
        fontSize: 10,
        fontWeight: "700",
        color: "#888",
        marginTop: 2,
    },
    removeButton: {
        position: "absolute",
        top: -12,
        right: -12,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.accentRed,
        borderWidth: 2,
        borderColor: COLORS.karyaBlack,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: COLORS.karyaBlack,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 2,
        zIndex: 10,
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
});
