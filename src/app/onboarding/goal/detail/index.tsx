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
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";

export default function GoalDetailScreen() {
  const {
    goal,
    errorMessage,
    goBack,
    goToSummary,
    handleChooseNext,
    handleFormNext,
    handleRefreshScenes,
    handleSceneChange,
    handleSceneNext,
    isSubmitting,
    scenes,
    selectedScene,
    selectedId,
    setSelectedId,
    step,
    submittingAction,
    submitGoal,
    updateGoalPlan,
  } = useGoalDetailFlow();

  const handleSubmit = async () => {
    const isSaved = await submitGoal();

    if (isSaved) {
      router.navigate("/home");
    }
  };

  const handleBack = () => {
    if (!goBack()) router.back();
  };

  const stepComponents: Record<GoalDetailStep, ReactNode> = {
    Choose: (
      <ChooseStepScreen
        isLoading={isSubmitting}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onNext={handleChooseNext}
      />
    ),
    Form: (
      <GoalDetailFormScreen
        isLoading={isSubmitting}
        onChange={updateGoalPlan}
        onNext={handleFormNext}
      />
    ),
    Scene: (
      <SceneRecommendScreen
        isLoading={isSubmitting}
        loadingAction={
          submittingAction === "sceneNext"
            ? "next"
            : submittingAction === "refresh"
              ? "refresh"
              : null
        }
        scenes={scenes}
        selectedScene={selectedScene}
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
        scene={selectedScene}
      />
    ),
    Summary: (
      <GoalSummaryScreen
        isLoading={isSubmitting}
        goal={goal}
        onSubmit={handleSubmit}
        scene={selectedScene}
      />
    ),
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StepScreenLayout onBack={handleBack}>
        <View className="flex-1 w-full">
          {/* API 오류 메시지 */}
          {errorMessage ? <Text className="mb-3 text-center text-error">{errorMessage}</Text> : null}
          {/* 현재 목표 설정 단계 */}
          {stepComponents[step]}
        </View>
      </StepScreenLayout>
    </KeyboardAvoidingView>
  );
}
