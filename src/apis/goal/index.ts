import { api } from "..";

import type { ApiPayload, ApiResponse } from "@/types/api";
import type {
  FutureGoalResponse,
  GoalPayload,
  GoalPlanPayload,
  PlanRecommendationResponse,
  RecommendedScene,
  SceneRecommendationResponse,
} from "@/types/goal";
import type { WeeklyGoalResponse } from "@/types/mission";

// 프로필 기반 장면 추천
export const recommendScenesByProfile = async () => {
  const res = await api.post<ApiResponse<SceneRecommendationResponse>>(
    "/goals/future/scenes/recommend/profile",
  );

  return res;
};

// 프로필 기반 - 수치 추천
export const recommendPlan = async ({
  payload,
}: ApiPayload<RecommendedScene>) => {
  const res = await api.post<ApiResponse<PlanRecommendationResponse>>(
    "/goals/future/plan/recommend",
    payload,
  );

  return res;
};

// 수치 기반 장면 추천
export const recommendScenesByPlan = async ({
  payload,
}: ApiPayload<GoalPlanPayload>) => {
  const res = await api.post<ApiResponse<SceneRecommendationResponse>>(
    "/goals/future/scenes/recommend/plan",
    payload,
  );

  return res;
};

// 미래 목표 저장
export const saveFutureGoal = async ({
  payload,
}: ApiPayload<GoalPayload>) => {
  const res = await api.post<ApiResponse<FutureGoalResponse>>(
    "/goals/future",
    payload,
  );

  return res;
};

export const getGoal = async () => {
  const res = await api.get<ApiResponse<FutureGoalResponse>>("/goals/future");

  return res;
};

export const getCurrentWeeklyGoal = async () => {
  const { data } = await api.get<ApiResponse<WeeklyGoalResponse>>(
    "/goals/weekly/current",
  );
  return data.data;
};

export const generateWeeklyGoal = async () => {
  const { data } = await api.post<ApiResponse<WeeklyGoalResponse>>(
    "/goals/weekly/generate",
  );
  return data.data;
};
