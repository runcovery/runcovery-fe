import GradientBackground from "@/components/gradient-background";
import CharacterScene from "@/components/onboarding/character-scene";
import TitleSection from "@/components/onboarding/title-section";
import Button from "@/components/ui/Button";

import { router } from "expo-router";
import { styled } from "nativewind";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const StyledSafeAreaView = styled(SafeAreaView);

export default function OnboardingScreen() {
  return (
    <View className="justify-center flex-1 px-8">
      <GradientBackground offsetY={120} />
      <StyledSafeAreaView className="flex-1">
        <View className="items-center justify-between flex-1 py-16 ">
          <TitleSection
            title="런커버리에 오신걸 환영합니다."
            subTitle={
              "오늘의 컨디션을 분석하고, 러닝부터 회복까지\n관리해보세요!"
            }
          />
          <CharacterScene />
          <Button onPress={() => router.push("/onboarding/profile")}>
            시작하기
          </Button>
        </View>
      </StyledSafeAreaView>
    </View>
  );
}
