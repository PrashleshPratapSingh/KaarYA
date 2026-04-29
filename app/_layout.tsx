import "../global.css";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { vars } from "nativewind";
import { memo, useEffect, useState } from "react";
import { View, StyleSheet, StatusBar, Platform } from "react-native";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ClerkProvider } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  console.error('❌ Error: EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is missing from your environment.');
  console.info('💡 Tip: If you just added it to .env, you MUST restart your Expo server (npx expo start -c).');
}

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
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </ClerkProvider>
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
  const segments = useSegments();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    if (!user) {
      // Not logged in — reset and unblock routing immediately
      setHasOnboarded(false);
      setCheckingOnboarding(false);
      return;
    }

    // User IS authenticated — they have a Clerk session.
    // For authenticated users, ALWAYS default to hasOnboarded=true.
    // Reasoning:
    //   • Returning users: they signed in before, so onboarding is done.
    //   • New users: handleGoogleSignIn navigates to /onboarding/skills
    //     BEFORE this effect resolves, so they stay there regardless.
    //   • This avoids ALL Firestore race conditions / timeouts causing a
    //     redirect loop back to onboarding.
    let isMounted = true;
    setCheckingOnboarding(true);

    const checkOnboardingStatus = async () => {
      try {
        const val = await AsyncStorage.getItem('kaarya_onboarding_complete');
        if (!isMounted) return;

        if (val !== 'true') {
          // Write the flag so future cold-starts are instant
          await AsyncStorage.setItem('kaarya_onboarding_complete', 'true');
        }
        if (isMounted) {
          setHasOnboarded(true);
          setCheckingOnboarding(false);
        }
      } catch {
        // AsyncStorage failed — still safe to proceed as onboarded
        if (isMounted) {
          setHasOnboarded(true);
          setCheckingOnboarding(false);
        }
      }
    };

    checkOnboardingStatus();
    return () => { isMounted = false; };
  }, [user]);

  useEffect(() => {
    if (loading || checkingOnboarding) return; // Wait for both auth check and onboarding check

    const inAuthGroup = segments[0] === 'onboarding';

    if (!user) {
      // Not logged in -> kick them to onboarding (login screen)
      if (!inAuthGroup) {
        router.replace('/onboarding');
      }
    } else {
      // Logged in user
      if (!hasOnboarded) {
        // MUST finish onboarding first
        if (!inAuthGroup) {
          router.replace('/onboarding');
        } else if (segments.length === 1) {
          // If already logged in but at the login screen, move to next step
          router.replace('/onboarding/skills');
        }
      } else {
        // Onboarding complete
        // Only redirect if they're on the LOGIN page (/onboarding index).
        // Let them stay on sub-pages (community/skills/story) for editing.
        if (inAuthGroup && segments.length === 1) {
           router.replace('/(tabs)');
        }
      }
    }
  }, [user, loading, checkingOnboarding, hasOnboarded, segments]);

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
        <Stack.Screen
          name="chat/[id]"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </View>
  );
}
