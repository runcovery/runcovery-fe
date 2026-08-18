export interface GoalPlanPayload {
  targetDistance: number;
  targetPeriod: number;
  weeklyFrequency: number;
  availableTime: number;
}

export interface GoalPayload extends GoalPlanPayload {
  scene: string;
}

export interface RecommendedScene {
  sceneId: string;
  scene: string;
  reason: string;
}

export interface SceneRecommendationResponse {
  scenes: RecommendedScene[];
}

export interface PlanRecommendationResponse extends GoalPlanPayload {
  baselineVolume: number;
  reason: string;
}

export interface FutureGoalResponse extends GoalPayload {
  futureId: number;
  achievementRate: number;
  createdAt: string;
}
