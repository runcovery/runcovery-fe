import CharacterScene from "@/components/onboarding/character-scene";
import TitleSection from "@/components/onboarding/title-section";
import GradientScreenLayout from "@/components/shared/gradient-screen-layout";
import Button from "@/components/ui/Button";

import { router } from "expo-router";
import { ScrollView, View } from "react-native";

export default function OnboardingScreen() {
  return (
    <View className="flex-1">
      <GradientScreenLayout offsetY={120}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 32,
            paddingVertical: 64,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center justify-between flex-1 gap-8">
            {/* 타이틀 */}
            <TitleSection
              title="런커버리에 오신 걸 환영합니다."
              subTitle={
                "오늘의 컨디션을 분석하고, 러닝부터 회복까지\n관리해 보세요!"
              }
            />

            {/* 캐릭터 */}
            <CharacterScene />

            {/* 버튼 */}
            <Button onPress={() => router.push("/onboarding/profile")}>
              시작하기
            </Button>
          </View>
        </ScrollView>
      </GradientScreenLayout>
    </View>
  );
}
