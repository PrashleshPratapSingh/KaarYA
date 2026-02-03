import React, { useState, useMemo } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    SafeAreaView,
    StatusBar,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    FadeInDown,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
    const params = useLocalSearchParams();

    const [paymentType, setPaymentType] = useState<PaymentType>("fixed");
    const [amount, setAmount] = useState("5000");
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const buttonScale = useSharedValue(1);
    const dates = useMemo(() => generateDates(), []);

    const isFormValid = parseInt(amount) >= 100 && selectedDate;

    const handleNext = () => {
        if (isFormValid) {
            router.push({
                pathname: "/post-gig/attachments",
                params: {
                    ...params,
                    paymentType,
                    amount,
                    deadline: selectedDate,
                },
            });
        }
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
                    className="w-12 h-12 rounded-full border-2 border-black items-center justify-center"
                >
                    <Feather name="arrow-left" size={20} color="#000" />
                </Pressable>
                <Text className="text-lg font-black italic tracking-tight">STEP 4/5</Text>
                <View className="w-12" />
            </View>

            <ScrollView
                className="flex-1 bg-[#D4FF00]"
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Rupee Icon */}
                <Animated.View
                    entering={FadeInDown.delay(100).springify()}
                    className="items-center pt-8 pb-4"
                >
                    <View className="w-20 h-20 rounded-full border-3 border-black bg-white items-center justify-center">
                        <Text className="text-3xl font-bold">₹</Text>
                    </View>
                </Animated.View>

                {/* Title */}
                <Animated.View
                    entering={FadeInDown.delay(150).springify()}
                    className="items-center pb-6"
                >
                    <Text className="text-3xl font-black text-black">SET BUDGET</Text>
                    <Text className="text-base text-gray-700 mt-2">
                        How do you want to pay?
                    </Text>
                </Animated.View>

                {/* Payment Type Selector */}
                <Animated.View
                    entering={FadeInDown.delay(200).springify()}
                    className="mx-6 mb-8"
                >
                    <View className="flex-row bg-white rounded-full p-1 border-2 border-black">
                        {(["fixed", "hourly", "milestone"] as PaymentType[]).map((type) => (
                            <Pressable
                                key={type}
                                onPress={() => setPaymentType(type)}
                                className={`flex-1 py-3 rounded-full items-center ${paymentType === type ? "bg-black" : "bg-transparent"
                                    }`}
                            >
                                <Text
                                    className={`font-bold uppercase text-sm ${paymentType === type ? "text-white" : "text-black"
                                        }`}
                                >
                                    {type}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </Animated.View>

                {/* Amount Input */}
                <Animated.View
                    entering={FadeInDown.delay(250).springify()}
                    className="mx-6 mb-6"
                >
                    <Text className="text-sm font-bold text-black uppercase tracking-wider mb-3">
                        TOTAL AMOUNT
                    </Text>
                    <View className="bg-white border-2 border-black rounded-2xl px-5 py-4 flex-row items-center">
                        <Text className="text-3xl text-gray-400 mr-2">₹</Text>
                        <TextInput
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                            className="text-3xl font-bold text-black flex-1"
                            placeholder="0"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                    <View className="flex-row items-center mt-3">
                        <Feather name="shield" size={14} color="#666" />
                        <Text className="text-xs text-gray-600 ml-2">
                            Money will be held in Escrow for safety until the gig is completed.
                        </Text>
                    </View>
                </Animated.View>

                {/* Deadline Section */}
                <Animated.View
                    entering={FadeInDown.delay(300).springify()}
                    className="mx-6"
                >
                    <Text className="text-xl font-black text-black uppercase mb-4">
                        DEADLINE
                    </Text>

                    {/* Date Selector Card */}
                    <View className="bg-white border-2 border-black rounded-3xl p-5">
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-sm font-bold text-gray-500 uppercase">
                                SELECT DATE
                            </Text>
                            <Feather name="calendar" size={20} color="#000" />
                        </View>

                        {/* Dotted Separator */}
                        <View className="border-t border-dashed border-gray-300 mb-4" />

                        {/* Date Pills */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="-mx-1"
                        >
                            {dates.map((date, index) => (
                                <Pressable
                                    key={date.fullDate}
                                    onPress={() => setSelectedDate(date.fullDate)}
                                    className={`
                    mx-1 px-4 py-3 rounded-2xl items-center min-w-[70px]
                    ${selectedDate === date.fullDate
                                            ? "bg-black"
                                            : index === 0
                                                ? "border-2 border-black bg-white"
                                                : "bg-gray-100"
                                        }
                  `}
                                >
                                    <Text
                                        className={`text-xs font-medium ${selectedDate === date.fullDate
                                                ? "text-white"
                                                : "text-gray-500"
                                            }`}
                                    >
                                        {date.month}
                                    </Text>
                                    <Text
                                        className={`text-2xl font-black ${selectedDate === date.fullDate
                                                ? "text-white"
                                                : "text-black"
                                            }`}
                                    >
                                        {date.day}
                                    </Text>
                                    <Text
                                        className={`text-xs font-medium ${selectedDate === date.fullDate
                                                ? "text-[#D4FF00]"
                                                : "text-gray-500"
                                            }`}
                                    >
                                        {date.weekday}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>
                </Animated.View>
            </ScrollView>

            {/* Bottom CTA */}
            <View className="absolute bottom-0 left-0 right-0 bg-[#D4FF00] px-6 pb-8 pt-4">
                <AnimatedPressable
                    onPress={handleNext}
                    onPressIn={handleButtonPressIn}
                    onPressOut={handleButtonPressOut}
                    disabled={!isFormValid}
                    style={[buttonAnimatedStyle]}
                    className={`
            py-5 rounded-full flex-row items-center justify-center
            ${isFormValid ? "bg-black" : "bg-gray-400"}
          `}
                >
                    <Text className="text-white text-lg font-bold tracking-wide mr-2">
                        NEXT STEP
                    </Text>
                    <Feather name="arrow-right" size={20} color="#FFFFFF" />
                </AnimatedPressable>
            </View>
        </SafeAreaView>
    );
}
