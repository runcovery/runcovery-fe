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

export type GoalDetailStep =
  | "Scene"
  | "Adjust"
  | "Form"
  | "Summary"
  | "Choose";

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
      setIsSubmitting(true);
      await requestScenesByProfile();
      setStep("Scene");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormNext = async () => {
    try {
      setIsSubmitting(true);
      await requestScenesByPlan();
      setStep("Scene");
    } finally {
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
      setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefreshScenes = async () => {
    try {
      setIsSubmitting(true);
      if (selectedId === 1) {
        await requestScenesByProfile();
      } else {
        await requestScenesByPlan();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitGoal = async () => {
    if (!ENABLE_ONBOARDING_API) return true;

    try {
      setIsSubmitting(true);
      await saveFutureGoal({ payload: goal });
      return true;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    goal,
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
    submitGoal,
    updateGoalPlan,
  };
};
