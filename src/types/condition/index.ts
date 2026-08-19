export type BodyCondition = "EXHAUSTED" | "FAIR" | "GOOD";
export type SleepQuality = "POOR" | "FAIR" | "GOOD";

export interface ConditionPayload {
  bodyCondition: BodyCondition;
  sleepQuality: SleepQuality;
  painAreas: string[];
}

export interface ConditionResponse {
  userId: number;
  conditionDate: string;
  conditionTitle: string;
  conditionFeedback: string[];
}
