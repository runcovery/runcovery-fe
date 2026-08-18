import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

import { useProfileStore } from "@/stores/useProfileStore";
import { useCameraPermissionStore } from "@/stores/useCameraPermissionStore";
import { useLocationPermissionStore } from "@/stores/useLocationPermissionStore";

import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const initializeUserId = useProfileStore((state) => state.initializeUserId);
  const initializeLocationPermission = useLocationPermissionStore(
    (state) => state.initializePermission,
  );
  const initializeCameraPermission = useCameraPermissionStore(
    (state) => state.initializePermission,
  );

  useEffect(() => {
    initializeUserId();

    const initializePermissions = async () => {
      await initializeLocationPermission();
      await initializeCameraPermission();
    };

    void initializePermissions();
    SplashScreen.hide();
  }, [
    initializeCameraPermission,
    initializeLocationPermission,
    initializeUserId,
  ]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ThemeProvider>
  );
}
