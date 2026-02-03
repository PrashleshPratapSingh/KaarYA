import React from "react";
import { View, Text, Pressable } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CategoryCardProps {
    id: string;
    name: string;
    icon: string;
    iconType: "feather" | "material";
    isSelected: boolean;
    onSelect: (id: string) => void;
}

export default function CategoryCard({
    id,
    name,
    icon,
    iconType,
    isSelected,
    onSelect,
}: CategoryCardProps) {
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

    const IconComponent = iconType === "feather" ? Feather : MaterialCommunityIcons;

    return (
        <AnimatedPressable
            onPress={() => onSelect(id)}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[animatedStyle]}
            className={`
        flex-row items-center px-6 py-4 rounded-full
        ${isSelected
                    ? "bg-[#4F46E5]"
                    : "bg-white border-2 border-black"
                }
      `}
        >
            <View className="mr-3">
                <IconComponent
                    name={icon as any}
                    size={22}
                    color={isSelected ? "#FFFFFF" : "#000000"}
                />
            </View>
            <Text
                className={`text-base font-bold uppercase tracking-wide ${isSelected ? "text-white" : "text-black"
                    }`}
            >
                {name}
            </Text>
            {isSelected && (
                <View className="ml-auto">
                    <View className="w-6 h-6 rounded-full bg-white items-center justify-center">
                        <Feather name="check" size={14} color="#4F46E5" />
                    </View>
                </View>
            )}
        </AnimatedPressable>
    );
}
