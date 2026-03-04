import "../global.css";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { vars } from "nativewind";
import { memo, useEffect } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { AuthProvider, useAuth } from "./context/AuthContext";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

import {
  ArchivoBlack_400Regular,
} from '@expo-google-fonts/archivo-black';
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import {
  Merriweather_400Regular,
  Merriweather_700Bold,
  Merriweather_400Regular_Italic,
  Merriweather_700Bold_Italic,
} from '@expo-google-fonts/merriweather';
import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "onboarding",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default memo(function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
    ArchivoBlack_400Regular,
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_800ExtraBold,
    Merriweather_400Regular,
    Merriweather_700Bold,
    Merriweather_400Regular_Italic,
    Merriweather_700Bold_Italic,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
});

const theme = vars({
  "--theme-fg": "black",
  "--theme-bg": "rgba(230,230,230,1)",
});

// ──────────────────────────────────────────────────────────────────────────────
// AUTH GATING — This is the "bouncer" of the app
//
// It checks: "is this user logged in?"
// • YES → skip onboarding, go straight to Home Feed
// • NO  → show onboarding / login
// • STILL CHECKING → show nothing (splash screen stays visible)
//
// router.replace() is used instead of router.push() so the user
// can't press "back" to get to the wrong screen.
// ──────────────────────────────────────────────────────────────────────────────
function RootLayoutNav() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Still checking auth state — do nothing

    if (user) {
      // User is logged in → go to main app
      router.replace('/(tabs)');
    } else {
      // User is NOT logged in → show onboarding
      router.replace('/onboarding');
    }
  }, [user, loading]);

  return (
    <View style={[theme, StyleSheet.absoluteFill]}>
      <StatusBar hidden={true} />
      <Stack>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        <Stack.Screen
          name="post-gig"
          options={{
            presentation: "fullScreenModal",
            headerShown: false,
          }}
        />
      </Stack>
    </View>
  );
}
