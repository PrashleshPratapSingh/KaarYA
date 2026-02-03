import { View, Text } from "react-native";

export default function MyWorkScreen() {
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text className="text-2xl font-bold">My Work</Text>
            <Text className="text-gray-500 mt-2">Active & Past Orders</Text>
        </View>
    );
}
