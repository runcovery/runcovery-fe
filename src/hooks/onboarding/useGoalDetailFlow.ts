import { useState } from "react";

import {
  recommendPlan,
  recommendScenesByPlan,
  recommendScenesByProfile,
  saveFutureGoal,
} from "@/apis/goal";
import { ENABLE_ONBOARDING_API } from "@/constants/featureFlags";
import type {
  GoalPayload,
  GoalPlanPayload,
  RecommendedScene,
} from "@/types/goal";
import { getApiErrorMessage } from "@/apis";

export type GoalDetailStep =
  | "Scene"
  | "Adjust"
  | "Form"
  | "Summary"
  | "Choose";

export type GoalSubmittingAction =
  | "choose"
  | "form"
  | "sceneNext"
  | "refresh"
  | "submit"
  | null;

const initialGoal: GoalPayload = {
  scene: "",
  targetDistance: 0,
  targetPeriod: 0,
  weeklyFrequency: 0,
  availableTime: 0,
};

// 목표 설정 화면들의 입력, 추천 요청, 단계 이동을 한곳에서 관리한다.
export const useGoalDetailFlow = () => {
  const [selectedId, setSelectedId] = useState(0);
  const [goal, setGoal] = useState<GoalPayload>(initialGoal);
  const [scenes, setScenes] = useState<RecommendedScene[]>([]);
  const [selectedScene, setSelectedScene] =
    useState<RecommendedScene | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingAction, setSubmittingAction] =
    useState<GoalSubmittingAction>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [step, setStep] = useState<GoalDetailStep>("Choose");

  const updateGoalPlan = (goalPlan: GoalPlanPayload) => {
    setGoal((previous) => ({ ...previous, ...goalPlan }));
  };

  const runSubmittingAction = async (
    action: Exclude<GoalSubmittingAction, null>,
    task: () => Promise<void>,
    fallbackMessage: string,
  ) => {
    try {
      setSubmittingAction(action);
      setIsSubmitting(true);
      setErrorMessage(null);
      await task();
      return true;
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, fallbackMessage));
      return false;
    } finally {
      setSubmittingAction(null);
      setIsSubmitting(false);
    }
  };

  const requestScenes = async (source: "profile" | "plan") => {
    if (!ENABLE_ONBOARDING_API) return;

    const response =
      source === "profile"
        ? await recommendScenesByProfile()
        : await recommendScenesByPlan({
            payload: {
              targetDistance: goal.targetDistance,
              targetPeriod: goal.targetPeriod,
              weeklyFrequency: goal.weeklyFrequency,
              availableTime: goal.availableTime,
            },
          });
    const recommendedScenes = response.scenes;
    // 서버가 대표로 지정한 main 장면을 초기 선택값으로 사용한다.
    const mainScene =
      recommendedScenes.find((scene) => scene.sceneId === "main") ?? null;

    setScenes(recommendedScenes);
    setSelectedScene(mainScene);
    if (mainScene) {
      setGoal((previous) => ({ ...previous, scene: mainScene.scene }));
    }
  };

  const handleChooseNext = async () => {
    // 직접 입력은 추천 API 없이 폼으로, 맞춤 추천은 프로필 기반 장면으로 분기한다.
    if (selectedId === 2) {
      setStep("Form");
      return;
    }

    if (selectedId !== 1) return;

    const isSuccessful = await runSubmittingAction(
      "choose",
      () => requestScenes("profile"),
      "추천 장면을 불러오지 못했습니다.",
    );
    if (isSuccessful) {
      setStep("Scene");
    }
  };

  const handleFormNext = async () => {
    const isSuccessful = await runSubmittingAction(
      "form",
      () => requestScenes("plan"),
      "추천 장면을 불러오지 못했습니다.",
    );
    if (isSuccessful) {
      setStep("Scene");
    }
  };

  const handleSceneChange = (scene: RecommendedScene | string) => {
    if (typeof scene === "string") {
      setSelectedScene(null);
      setGoal((previous) => ({ ...previous, scene }));
      return;
    }

    setSelectedScene(scene);
    setGoal((previous) => ({ ...previous, scene: scene.scene }));
  };

  const handleSceneNext = async () => {
    // 직접 입력한 수치는 이미 goal에 있으므로 바로 최종 확인 단계로 이동한다.
    if (selectedId === 2) {
      setStep("Summary");
      return;
    }

    if (!ENABLE_ONBOARDING_API) {
      setStep("Adjust");
      return;
    }

    if (!selectedScene) return;

    const isSuccessful = await runSubmittingAction(
      "sceneNext",
      async () => {
        const plan = await recommendPlan({ payload: selectedScene });
        setGoal((previous) => ({
          ...previous,
          scene: selectedScene.scene,
          targetDistance: plan.targetDistance,
          targetPeriod: plan.targetPeriod,
          weeklyFrequency: plan.weeklyFrequency,
          availableTime: plan.availableTime,
        }));
      },
      "추천 목표를 불러오지 못했습니다.",
    );
    if (isSuccessful) {
      setStep("Adjust");
    }
  };

  const handleRefreshScenes = async () => {
    await runSubmittingAction(
      "refresh",
      () => requestScenes(selectedId === 1 ? "profile" : "plan"),
      "추천 장면을 새로 불러오지 못했습니다.",
    );
  };

  const submitGoal = async () => {
    if (!ENABLE_ONBOARDING_API) return true;

    return runSubmittingAction(
      "submit",
      async () => {
        await saveFutureGoal({ payload: goal });
      },
      "미래 목표를 저장하지 못했습니다.",
    );
  };

  const goBack = () => {
    // 요청 중 화면 이탈을 막아 응답이 이전 단계의 상태를 덮어쓰지 않게 한다.
    if (isSubmitting) return true;

    if (step === "Choose") return false;

    setErrorMessage(null);
    if (step === "Form") setStep("Choose");
    if (step === "Scene") setStep(selectedId === 2 ? "Form" : "Choose");
    if (step === "Adjust") setStep("Scene");
    if (step === "Summary")
      setStep(selectedId === 2 ? "Scene" : "Adjust");

    return true;
  };

  return {
    goal,
    errorMessage,
    goBack,
    goToSummary: () => setStep("Summary"),
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
  };
};
