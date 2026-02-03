import { Stack } from 'expo-router';

export default function OnboardingLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="community" options={{ headerShown: false }} />
            <Stack.Screen name="skills" options={{ headerShown: false }} />
            <Stack.Screen name="story" options={{ headerShown: false }} />
        </Stack>
    );
}
