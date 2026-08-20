import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { QueryClientProvider } from "@tanstack/react-query";

import { useProfileStore } from "@/stores/useProfileStore";
import { queryClient } from "@/lib/query-client";

import "../global.css";

// 사용자 식별자를 준비하는 동안 네이티브 스플래시가 먼저 사라지지 않게 한다.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const initializeUserId = useProfileStore((state) => state.initializeUserId);

  useEffect(() => {
    // 보호 API의 X-Public-Id가 항상 준비된 뒤 앱 화면을 노출한다.
    initializeUserId();
    void SplashScreen.hideAsync();
  }, [initializeUserId]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false, animation: "none" }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
