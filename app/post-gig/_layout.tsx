import { Stack } from "expo-router";
import { View } from "react-native";

export default function PostGigLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
                contentStyle: { backgroundColor: "#FFFFFF" },
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="details" />
            <Stack.Screen name="budget" />
            <Stack.Screen name="attachments" />
            <Stack.Screen name="review" />
            <Stack.Screen name="success" />
        </Stack>
    );
}
