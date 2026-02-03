import React, { useState, useMemo } from "react";
import {
    View,
    Text,
    TextInput,
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

// Colors - consistent with index.tsx and details.tsx
const COLORS = {
    primary: "#d4f906",
    primaryDark: "#ccf005",
    karyaBlack: "#171811",
    karyaYellow: "#d4f906",
    karyaGray: "#858c5f",
    white: "#FFFFFF",
    gray: "#666666",
    lightGray: "#F5F5F5",
    backgroundLight: "#f8f8f5",
};

type PaymentType = "fixed" | "hourly" | "milestone";

// Generate dates for the next 7 days
const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push({
            day: date.getDate(),
            weekday: date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
            month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
            fullDate: date.toISOString().split("T")[0],
        });
    }
    return dates;
};

export default function BudgetTimelineScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams();

    const [paymentType, setPaymentType] = useState<PaymentType>("fixed");
    const [amount, setAmount] = useState("5000");
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const buttonScale = useSharedValue(1);
    const dates = useMemo(() => generateDates(), []);

    const handleNext = () => {
        router.push({
            pathname: "/post-gig/attachments",
            params: {
                ...params,
                paymentType,
                amount,
                deadline: selectedDate,
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
            {/* Yellow Striped Background */}
            <View style={styles.stripedBackground}>
                {[...Array(60)].map((_, i) => (
                    <View key={i} style={[styles.stripe, { top: i * 20 - 300 }]} />
                ))}
            </View>

            {/* Header - Consistent with index.tsx and details.tsx */}
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
                <Text style={styles.headerTitle}>Set Budget</Text>

                {/* Step Counter Capsule */}
                <View style={styles.stepCapsule}>
                    <Text style={styles.stepText}>3/5</Text>
                </View>
            </View>

            {/* Scrollable Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Hero Section - Title */}
                <View style={styles.heroContainer}>
                    {/* Title - Same style as "Pick Your Hustle" */}
                    <Animated.View entering={FadeInDown.delay(100).springify()}>
                        <Text style={styles.heroText}>Set</Text>
                        <View style={styles.budgetWrapper}>
                            {/* White offset shadow */}
                            <View style={styles.budgetShadow} />
                            {/* Main budget box */}
                            <View style={styles.budgetBox}>
                                <Text style={styles.budgetText}>Budget</Text>
                            </View>
                        </View>
                    </Animated.View>

                    <Animated.Text
                        entering={FadeInDown.delay(150).springify()}
                        style={styles.subtitle}
                    >
                        How do you want to pay?
                    </Animated.Text>
                </View>

                {/* Payment Type Selector - Segmented Toggle */}
                <Animated.View
                    entering={FadeInDown.delay(250).springify()}
                    style={styles.segmentedContainer}
                >
                    <View style={styles.segmentedControl}>
                        {(["fixed", "hourly", "milestone"] as PaymentType[]).map((type) => (
                            <Pressable
                                key={type}
                                onPress={() => setPaymentType(type)}
                                style={[
                                    styles.segmentItem,
                                    paymentType === type && styles.segmentItemActive,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.segmentText,
                                        paymentType === type && styles.segmentTextActive,
                                    ]}
                                >
                                    {type}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </Animated.View>

                {/* Amount Input */}
                <Animated.View
                    entering={FadeInDown.delay(300).springify()}
                    style={styles.inputGroup}
                >
                    <Text style={styles.inputLabel}>Total Amount</Text>
                    <View style={styles.amountInputContainer}>
                        <Text style={styles.rupeeSymbol}>₹</Text>
                        <TextInput
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                            style={styles.amountInput}
                            placeholder="5000"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                    <View style={styles.escrowNote}>
                        <MaterialCommunityIcons
                            name="shield-check"
                            size={16}
                            color={COLORS.karyaBlack}
                        />
                        <Text style={styles.escrowText}>
                            Money will be held in Escrow for safety until the gig is completed.
                        </Text>
                    </View>
                </Animated.View>

                {/* Deadline Section */}
                <Animated.View
                    entering={FadeInDown.delay(350).springify()}
                    style={styles.deadlineSection}
                >
                    <Text style={styles.deadlineTitle}>Deadline</Text>

                    <View style={styles.calendarCard}>
                        {/* Spiral Binding Effect */}
                        <View style={styles.spiralBinding}>
                            {[...Array(6)].map((_, i) => (
                                <View key={i} style={styles.spiralDot} />
                            ))}
                        </View>

                        <View style={styles.calendarContent}>
                            <View style={styles.calendarHeader}>
                                <Text style={styles.calendarLabel}>Select Date</Text>
                                <MaterialCommunityIcons
                                    name="calendar-edit"
                                    size={22}
                                    color={COLORS.karyaBlack}
                                />
                            </View>

                            {/* Dashed Separator */}
                            <View style={styles.dashedSeparator} />

                            {/* Date Selector */}
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.dateScrollContent}
                            >
                                {dates.map((date, index) => {
                                    const isSelected = selectedDate === date.fullDate;
                                    return (
                                        <Pressable
                                            key={date.fullDate}
                                            onPress={() => setSelectedDate(date.fullDate)}
                                            style={[
                                                styles.dateItem,
                                                isSelected && styles.dateItemActive,
                                                index === 0 && !selectedDate && styles.dateItemFirst,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.dateMonth,
                                                    isSelected && styles.dateMonthActive,
                                                ]}
                                            >
                                                {date.month}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.dateDay,
                                                    isSelected && styles.dateDayActive,
                                                ]}
                                            >
                                                {date.day}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.dateWeekday,
                                                    isSelected && styles.dateWeekdayActive,
                                                ]}
                                            >
                                                {date.weekday}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </ScrollView>
                        </View>
                    </View>
                </Animated.View>
            </ScrollView>

            {/* Fixed Bottom CTA - Same as index.tsx */}
            <View style={styles.bottomContainer}>
                <AnimatedPressable
                    onPress={handleNext}
                    onPressIn={handleButtonPressIn}
                    onPressOut={handleButtonPressOut}
                    style={[buttonAnimatedStyle, styles.continueButton]}
                >
                    <Text style={styles.continueText}>Next Step</Text>
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
    budgetWrapper: {
        marginTop: 4,
        position: "relative",
    },
    budgetShadow: {
        position: "absolute",
        top: 4,
        left: 4,
        right: -4,
        bottom: -4,
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.karyaBlack,
    },
    budgetBox: {
        backgroundColor: COLORS.karyaBlack,
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderWidth: 2,
        borderColor: COLORS.karyaBlack,
        transform: [{ rotate: "-1deg" }],
        zIndex: 1,
    },
    budgetText: {
        fontSize: 44,
        fontWeight: "900",
        letterSpacing: -2,
        textTransform: "uppercase",
        color: COLORS.karyaYellow,
        lineHeight: 48,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: "500",
        color: COLORS.karyaBlack,
        marginTop: 16,
        opacity: 0.8,
    },
    // Segmented Control
    segmentedContainer: {
        marginBottom: 24,
    },
    segmentedControl: {
        flexDirection: "row",
        backgroundColor: COLORS.white,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.karyaBlack,
        padding: 4,
        shadowColor: COLORS.karyaBlack,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    segmentItem: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    segmentItemActive: {
        backgroundColor: COLORS.karyaBlack,
        shadowColor: COLORS.karyaGray,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 2,
    },
    segmentText: {
        fontSize: 14,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        color: COLORS.karyaBlack,
    },
    segmentTextActive: {
        color: COLORS.primary,
    },
    // Amount Input
    inputGroup: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.karyaBlack,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    amountInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.karyaBlack,
        borderRadius: 12,
        height: 80,
        paddingHorizontal: 20,
        shadowColor: COLORS.karyaBlack,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    rupeeSymbol: {
        fontSize: 36,
        fontWeight: "900",
        color: COLORS.karyaBlack,
        opacity: 0.4,
        marginRight: 8,
    },
    amountInput: {
        flex: 1,
        fontSize: 40,
        fontWeight: "900",
        color: COLORS.karyaBlack,
        padding: 0,
    },
    escrowNote: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginTop: 12,
        gap: 8,
    },
    escrowText: {
        fontSize: 12,
        fontWeight: "600",
        color: COLORS.karyaBlack,
        flex: 1,
        lineHeight: 18,
    },
    // Deadline Section
    deadlineSection: {
        marginBottom: 24,
    },
    deadlineTitle: {
        fontSize: 24,
        fontWeight: "800",
        color: COLORS.karyaBlack,
        textTransform: "uppercase",
        marginBottom: 12,
    },
    calendarCard: {
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.karyaBlack,
        borderRadius: 16,
        overflow: "hidden",
        shadowColor: COLORS.karyaBlack,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    spiralBinding: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        paddingVertical: 4,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
    },
    spiralDot: {
        width: 8,
        height: 20,
        backgroundColor: COLORS.karyaBlack,
        borderRadius: 4,
        marginTop: -8,
    },
    calendarContent: {
        padding: 16,
    },
    calendarHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    calendarLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: "#888",
        textTransform: "uppercase",
    },
    dashedSeparator: {
        borderTopWidth: 2,
        borderStyle: "dashed",
        borderColor: "#E5E5E5",
        marginBottom: 16,
    },
    dateScrollContent: {
        paddingRight: 8,
        gap: 8,
    },
    dateItem: {
        width: 56,
        height: 80,
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.karyaBlack,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    dateItemActive: {
        backgroundColor: COLORS.karyaBlack,
    },
    dateItemFirst: {
        borderWidth: 2,
        borderColor: COLORS.karyaBlack,
    },
    dateMonth: {
        fontSize: 10,
        fontWeight: "500",
        color: "#888",
        textTransform: "uppercase",
        marginTop: 4,
    },
    dateMonthActive: {
        color: COLORS.white,
    },
    dateDay: {
        fontSize: 24,
        fontWeight: "900",
        color: COLORS.karyaBlack,
    },
    dateDayActive: {
        color: COLORS.white,
    },
    dateWeekday: {
        fontSize: 10,
        fontWeight: "700",
        color: "#888",
        textTransform: "uppercase",
        marginBottom: 4,
    },
    dateWeekdayActive: {
        color: COLORS.primary,
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
