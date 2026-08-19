export interface MissionResponse {
  userId: number;
  missionId: number;
  recommendedIntensity: string;
  recommendedTime: string;
  recommendedZone: string;
  recommendedZoneDesc: string;
  detailComment: string;
  isRest: boolean;
}

export interface WeeklySchedule {
  trainingId: number;
  trainingContent: string;
}

export interface WeeklyGoalResponse {
  weekId: number;
  weekNo: number;
  weeklyGoal: string;
  weeklyGoalDistance: number;
  expectedCalories: number;
  schedules: WeeklySchedule[];
}
