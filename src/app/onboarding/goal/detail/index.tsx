import ChooseStepScreen from "@/components/onboarding/goal/choose-step";
import GoalAdjustScreen from "@/components/onboarding/goal/goal-adjust";
import GoalDetailFormScreen from "@/components/onboarding/goal/goal-detail-form";
import GoalSummaryScreen from "@/components/onboarding/goal/goal-summary";
import SceneRecommendScreen from "@/components/onboarding/goal/scene-recommend";
import StepScreenLayout from "@/components/shared/step-screen-layout";
import {
  GoalDetailStep,
  useGoalDetailFlow,
} from "@/hooks/onboarding/useGoalDetailFlow";
import { router } from "expo-router";
import { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";

export default function GoalDetailScreen() {
  const {
    goal,
    goToSummary,
    handleChooseNext,
    handleFormNext,
    handleRefreshScenes,
    handleSceneChange,
    handleSceneNext,
    isSubmitting,
    scenes,
    selectedId,
    setSelectedId,
    step,
    submitGoal,
    updateGoalPlan,
  } = useGoalDetailFlow();

  const handleSubmit = async () => {
    const isSaved = await submitGoal();

    if (isSaved) {
      router.navigate("/home");
    }
  };

  const stepComponents: Record<GoalDetailStep, ReactNode> = {
    Choose: (
      <ChooseStepScreen
        selectedId={selectedId}
        onSelect={setSelectedId}
        onNext={handleChooseNext}
      />
    ),
    Form: (
      <GoalDetailFormScreen
        onChange={updateGoalPlan}
        onNext={handleFormNext}
      />
    ),
    Scene: (
      <SceneRecommendScreen
        scenes={scenes}
        selectedId={selectedId}
        onSceneChange={handleSceneChange}
        onNext={handleSceneNext}
        onRefresh={handleRefreshScenes}
      />
    ),
    Adjust: (
      <GoalAdjustScreen
        goal={goal}
        onChange={updateGoalPlan}
        onNext={goToSummary}
      />
    ),
    Summary: (
      <GoalSummaryScreen disabled={isSubmitting} onSubmit={handleSubmit} />
    ),
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StepScreenLayout>
        <View className="flex-1 w-full">{stepComponents[step]}</View>
      </StepScreenLayout>
    </KeyboardAvoidingView>
  );
}
