import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { supabase } from "@/services/supabase";
import { setAuthUserFromSession } from "@/utils";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

import { Colors } from "@/constants/Colors";
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    MavenPro: require("../assets/fonts/MavenPro-VariableFont.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const { user, setAuthUser } = useAuth();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthUserFromSession(session, setAuthUser).catch((error) =>
        Toast.show({ type: "error", text1: "Error", text2: error.message })
      );
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUserFromSession(session, setAuthUser).catch((error) =>
        Toast.show({ type: "error", text1: "Error", text2: error.message })
      );
      if (!session) {
        router.replace("/");
      }
    });
  }, []);

  useEffect(() => {
    if (user?.username) {
      Toast.show({
        type: "success",
        text1: "Welcome",
        text2: `Logged in as ${user?.username}`,
      });
    }
  }, [user]);

  if (!loaded) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors[colorScheme ?? "light"].background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust based on platform
      >
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        </Stack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default function _layout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <RootLayout />
        <Toast position="top" />
      </AuthProvider>
    </ThemeProvider>
  );
}
