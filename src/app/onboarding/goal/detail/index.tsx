import ChooseStepScreen from "@/components/onboarding/goal/choose-step";
import GoalAdjustScreen from "@/components/onboarding/goal/goal-adjust";
import GoalDetailFormScreen from "@/components/onboarding/goal/goal-detail-form";
import GoalSummaryScreen from "@/components/onboarding/goal/goal-summary";
import SceneRecomendScreen from "@/components/onboarding/goal/scene-recomend";
import GradientScreenLayout from "@/components/shared/gradient-screen-layout";
import { router } from "expo-router";
import { ReactNode, useState } from "react";
import { Image, Pressable, View } from "react-native";

type DetailStep = "Scene" | "Adjust" | "Form" | "Summary" | "Choose";

export default function GoalDetailScreen() {
  const [selectedId, setSelectedId] = useState(0);
  const [step, setStep] = useState<DetailStep>("Choose");

  const stepComponents: Record<DetailStep, ReactNode> = {
    Choose: (
      <ChooseStepScreen
        selectedId={selectedId}
        onSelect={setSelectedId}
        onNext={() => {
          if (selectedId === 1) setStep("Scene");
          if (selectedId === 2) setStep("Form");
        }}
      />
    ),
    Form: <GoalDetailFormScreen onNext={() => setStep("Scene")} />,

    Scene: (
      <SceneRecomendScreen
        selectedId={selectedId}
        onNext={() => setStep(selectedId === 1 ? "Adjust" : "Summary")}
      />
    ),

    Adjust: <GoalAdjustScreen onNext={() => setStep("Summary")} />,

    Summary: <GoalSummaryScreen />,
  };

  return (
    <View className="justify-center flex-1 px-8">
      <GradientScreenLayout offsetY={120}>
        <View className="flex-1 py-16 w-full">
          {/* 이전 버튼 */}
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 -ml-3"
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="뒤로 가기"
          >
            <Image
              source={require("../../../../../assets/images/shared/prev.png")}
              className="h-full w-full"
            />
          </Pressable>

          {/* 스텝 렌더링 */}
          {stepComponents[step]}
        </View>
      </GradientScreenLayout>
    </View>
  );
}
