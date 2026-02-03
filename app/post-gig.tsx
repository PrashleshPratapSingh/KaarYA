import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

export default function PostGigScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center px-4 pt-12 pb-4 border-b border-gray-200">
                <Pressable onPress={() => router.back()} className="p-2">
                    <Feather name="x" size={24} color="#000" />
                </Pressable>
                <Text className="flex-1 text-xl font-bold text-center">Post a Gig</Text>
                <View className="w-10" />
            </View>

            {/* Content */}
            <View className="flex-1 items-center justify-center">
                <Text className="text-2xl font-bold">Post Gig</Text>
                <Text className="text-gray-500 mt-2">Create a new gig posting</Text>
            </View>
        </View>
    );
}
