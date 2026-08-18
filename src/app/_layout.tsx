import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

import { useProfileStore } from "@/stores/useProfileStore";
import { useLocationPermissionStore } from "@/stores/useLocationPermissionStore";

import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const initializeUserId = useProfileStore((state) => state.initializeUserId);
  const initializeLocationPermission = useLocationPermissionStore(
    (state) => state.initializePermission,
  );

  useEffect(() => {
    initializeUserId();
    void initializeLocationPermission();
    SplashScreen.hide();
  }, [initializeLocationPermission, initializeUserId]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ThemeProvider>
  );
}
