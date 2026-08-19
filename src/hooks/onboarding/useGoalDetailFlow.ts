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

  const requestScenesByProfile = async () => {
    if (!ENABLE_ONBOARDING_API) return;

    const response = await recommendScenesByProfile();
    const recommendedScenes = response.data.data.scenes;
    const mainScene =
      recommendedScenes.find((scene) => scene.sceneId === "main") ?? null;

    setScenes(recommendedScenes);
    setSelectedScene(mainScene);
    if (mainScene) {
      setGoal((previous) => ({ ...previous, scene: mainScene.scene }));
    }
  };

  const requestScenesByPlan = async () => {
    if (!ENABLE_ONBOARDING_API) return;

    const response = await recommendScenesByPlan({
      payload: {
        targetDistance: goal.targetDistance,
        targetPeriod: goal.targetPeriod,
        weeklyFrequency: goal.weeklyFrequency,
        availableTime: goal.availableTime,
      },
    });
    const recommendedScenes = response.data.data.scenes;
    const mainScene =
      recommendedScenes.find((scene) => scene.sceneId === "main") ?? null;

    setScenes(recommendedScenes);
    setSelectedScene(mainScene);
    if (mainScene) {
      setGoal((previous) => ({ ...previous, scene: mainScene.scene }));
    }
  };

  const handleChooseNext = async () => {
    if (selectedId === 2) {
      setStep("Form");
      return;
    }

    if (selectedId !== 1) return;

    try {
      setSubmittingAction("choose");
      setIsSubmitting(true);
      setErrorMessage(null);
      await requestScenesByProfile();
      setStep("Scene");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "추천 장면을 불러오지 못했습니다."));
    } finally {
      setSubmittingAction(null);
      setIsSubmitting(false);
    }
  };

  const handleFormNext = async () => {
    try {
      setSubmittingAction("form");
      setIsSubmitting(true);
      setErrorMessage(null);
      await requestScenesByPlan();
      setStep("Scene");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "추천 장면을 불러오지 못했습니다."));
    } finally {
      setSubmittingAction(null);
      setIsSubmitting(false);
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
    if (selectedId === 2) {
      setStep("Summary");
      return;
    }

    if (!ENABLE_ONBOARDING_API) {
      setStep("Adjust");
      return;
    }

    if (!selectedScene) return;

    try {
      setSubmittingAction("sceneNext");
      setIsSubmitting(true);
      setErrorMessage(null);
      const response = await recommendPlan({ payload: selectedScene });
      const plan = response.data.data;

      setGoal((previous) => ({
        ...previous,
        scene: selectedScene.scene,
        targetDistance: plan.targetDistance,
        targetPeriod: plan.targetPeriod,
        weeklyFrequency: plan.weeklyFrequency,
        availableTime: plan.availableTime,
      }));
      setStep("Adjust");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "추천 목표를 불러오지 못했습니다."));
    } finally {
      setSubmittingAction(null);
      setIsSubmitting(false);
    }
  };

  const handleRefreshScenes = async () => {
    try {
      setSubmittingAction("refresh");
      setIsSubmitting(true);
      setErrorMessage(null);
      if (selectedId === 1) {
        await requestScenesByProfile();
      } else {
        await requestScenesByPlan();
      }
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "추천 장면을 새로 불러오지 못했습니다."));
    } finally {
      setSubmittingAction(null);
      setIsSubmitting(false);
    }
  };

  const submitGoal = async () => {
    if (!ENABLE_ONBOARDING_API) return true;

    try {
      setSubmittingAction("submit");
      setIsSubmitting(true);
      setErrorMessage(null);
      await saveFutureGoal({ payload: goal });
      return true;
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "미래 목표를 저장하지 못했습니다."));
      return false;
    } finally {
      setSubmittingAction(null);
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
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
