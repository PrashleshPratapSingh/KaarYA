import React from "react";
import { View, Text } from "react-native";

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
    const progress = (currentStep / totalSteps) * 100;

    return (
        <View className="flex-row items-center">
            <View className="bg-black rounded-full px-3 py-1">
                <Text className="text-white font-bold text-sm">
                    {currentStep}/{totalSteps}
                </Text>
            </View>
        </View>
    );
}
