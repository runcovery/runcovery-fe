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
  const { data } = await api.post<ApiResponse<SceneRecommendationResponse>>(
    "/goals/future/scenes/recommend/profile",
  );

  return data.data;
};

// 프로필 기반 - 수치 추천
export const recommendPlan = async ({
  payload,
}: ApiPayload<RecommendedScene>) => {
  const { data } = await api.post<ApiResponse<PlanRecommendationResponse>>(
    "/goals/future/plan/recommend",
    payload,
  );

  return data.data;
};

// 수치 기반 장면 추천
export const recommendScenesByPlan = async ({
  payload,
}: ApiPayload<GoalPlanPayload>) => {
  const { data } = await api.post<ApiResponse<SceneRecommendationResponse>>(
    "/goals/future/scenes/recommend/plan",
    payload,
  );

  return data.data;
};

// 미래 목표 저장
export const saveFutureGoal = async ({
  payload,
}: ApiPayload<GoalPayload>) => {
  const { data } = await api.post<ApiResponse<FutureGoalResponse>>(
    "/goals/future",
    payload,
  );

  return data.data;
};

// 미래 목표 조회
export const getGoal = async () => {
  const { data } = await api.get<ApiResponse<FutureGoalResponse>>("/goals/future");

  return data.data;
};

// 현재 주간 목표 조회
export const getCurrentWeeklyGoal = async () => {
  const { data } = await api.get<ApiResponse<WeeklyGoalResponse>>(
    "/goals/weekly/current",
  );
  return data.data;
};

// 컨디션과 미래 목표 기반 주간 목표 생성
export const generateWeeklyGoal = async () => {
  const { data } = await api.post<ApiResponse<WeeklyGoalResponse>>(
    "/goals/weekly/generate",
  );
  return data.data;
};
