export type UserGender = "male" | "female";

export interface UserProfile {
  nickname: string;
  age: number;
  gender: UserGender | "";
  height: number;
  weight: number;
  runningExperience: string;
}

export interface UserCreatePayload extends Omit<UserProfile, "gender"> {
  userId: string;
  gender: UserGender;
}

export interface UserCreateResponse {
  userId: number;
  nickname: string;
}

export type WeekdayCode =
  | "MON"
  | "TUE"
  | "WED"
  | "THU"
  | "FRI"
  | "SAT"
  | "SUN";

export interface WeeklyMissionStats {
  successCount: number;
  successDays: WeekdayCode[];
}

export interface PostCareStats {
  conditionRate: number;
  skinRate: number;
  stretchRate: number;
  weeklyFeedback: string;
}

export interface SkinScore {
  day: number;
  score: number;
}

export interface MyStatsResponse {
  userId: number;
  nickname: string;
  totalCalories: number;
  burnedCalories: number;
  weeklyMission: WeeklyMissionStats;
  postCare: PostCareStats;
  monthlySkinScore: SkinScore[];
}
