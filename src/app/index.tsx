import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Image, View } from "react-native";

import GradientScreenLayout from "@/components/shared/gradient-screen-layout";

const LOADING_DURATION_MS = 2000;

export default function LandingScreen() {
  useEffect(() => {
    void SplashScreen.hideAsync();

    const navigationTimer = setTimeout(() => {
      router.replace("/onboarding");
    }, LOADING_DURATION_MS);

    return () => clearTimeout(navigationTimer);
  }, []);

  return (
    <View className="flex-1">
      <StatusBar style="dark" hidden={false} />
      <GradientScreenLayout>
        <View className="-translate-y-10 flex-1 items-center justify-center px-6">
          <View className="items-center gap-7">
            <Image
              source={require("@/assets/images/logo.png")}
              className="h-38 w-47.5"
              resizeMode="contain"
            />
            <Image
              source={require("@/assets/images/logo-text.png")}
              className="h-6.75 w-37.5"
              resizeMode="contain"
            />
          </View>
        </View>
      </GradientScreenLayout>
    </View>
  );
}
