import ChooseStepScreen from "@/components/onboarding/goal/choose-step";
import GoalAdjustScreen from "@/components/onboarding/goal/goal-adjust";
import GoalDetailFormScreen from "@/components/onboarding/goal/goal-detail-form";
import GoalSummaryScreen from "@/components/onboarding/goal/goal-summary";
import SceneRecommendScreen from "@/components/onboarding/goal/scene-recommend";
import StepScreenLayout from "@/components/shared/step-screen-layout";
import { ReactNode, useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";

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
      <SceneRecommendScreen
        selectedId={selectedId}
        onNext={() => setStep(selectedId === 1 ? "Adjust" : "Summary")}
      />
    ),

    Adjust: <GoalAdjustScreen onNext={() => setStep("Summary")} />,

    Summary: <GoalSummaryScreen />,
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StepScreenLayout>
        <View className="flex-1 w-full">
          {/* 스텝 렌더링 */}
          {stepComponents[step]}
        </View>
      </StepScreenLayout>
    </KeyboardAvoidingView>
  );
}
