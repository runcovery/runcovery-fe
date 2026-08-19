export type SurveyFeeling = "GREAT" | "NORMAL" | "EXHAUSTED";
export type SurveyEnergy = "DEPLETED" | "TIRED" | "ENERGETIC";
export type SurveySweat = "LOW" | "MODERATE" | "HIGH";

export interface ReportSurvey {
  feeling: SurveyFeeling;
  energy: SurveyEnergy;
  sweat: SurveySweat;
}

export interface ReportPayload {
  recordDate?: string;
  activityRecordId?: number;
  survey: ReportSurvey;
  painPartCodes: string[];
}

export interface ReportActivity {
  distanceM: number;
  runningDuration: number;
  avgPace: number;
  cadence: number;
}

export interface ReportWeather {
  uvIndex: number;
  temperatureCelsius: number;
  humidityPercent: number;
}

export interface ReportPreview {
  activityRecordId: number;
  nickname: string;
  recordDate: string;
  startTime: string;
  endTime: string;
  weather: ReportWeather;
  activity: ReportActivity;
}

export interface RunningIntensity {
  score: number;
  level: "LOW" | "MODERATE" | "HIGH";
  comment: string;
}

export interface ReportPrescription {
  title: string;
  solution: string;
}

export interface RecoveryVideo {
  title: string;
  videoUrl: string;
  sourceTitle: string;
  durationSeconds: number;
  bodyGroup: string;
  recommendationReason: string;
  targetParts: string[];
  coveredPainPartCodes: string[];
  uncoveredPainPartCodes: string[];
}

export interface ReportResponse {
  intensity: RunningIntensity;
  hydration: ReportPrescription;
  skin: ReportPrescription;
  stretching: ReportPrescription;
  recoveryVideos: RecoveryVideo[];
  uncoveredPainPartCodes: string[];
}

export interface WellnessReportSummary {
  reportId: number;
  activityRecordId: number;
  reportDate: string;
  runningIntensity: number;
  intensityLevel: "LOW" | "MODERATE" | "HIGH";
  comment: string;
}

export type PrescriptionCategory = "NUTRITION" | "SKIN" | "STRETCH";

export interface PrescriptionSummary {
  prescriptionId: number;
  reportId: number;
  prescriptionDate: string;
  category: PrescriptionCategory;
  categoryName: string;
  title: string;
  summary: string;
  isCompleted: boolean;
  completionSupported: boolean;
}

export interface NutritionDetail {
  description: string;
  runningDurationSeconds: number;
  caloriesBurned: number;
}

export interface SkinDetail {
  description: string;
  skinRecordId: number;
  measuredDate: string;
  skinRecordType: "AFTER_RUN" | "AFTER_CARE";
  totalScore: number;
  redness: number;
  oiliness: number;
  texture: number;
  pores: number;
  blemishes: number;
  hydration: number;
  pigment: number;
}

export interface StretchingStep {
  label: string;
  description: string;
}

export interface StretchingDetail {
  description: string;
  steps: StretchingStep[];
  recommendedLink: string;
  recoveryVideos: RecoveryVideo[];
}

export interface PrescriptionDetail extends PrescriptionSummary {
  nutritionDetail?: NutritionDetail | null;
  skinDetail?: SkinDetail | null;
  stretchingDetail?: StretchingDetail | null;
}

export interface PrescriptionCompletion {
  prescriptionId: number;
  reportId: number;
  category: PrescriptionCategory;
  categoryName: string;
  isCompleted: boolean;
}

export interface SkinRecordResponse {
  skinRecordId: number;
  type: "AFTER_RUN" | "AFTER_CARE";
  measuredDate: string;
  totalScore: number;
  redness: number;
  oiliness: number;
  texture: number;
  pores: number;
  blemishes: number;
  hydration: number;
  pigment: number;
}

export type SkinScores = Omit<
  SkinRecordResponse,
  "skinRecordId" | "type"
>;

export type SkinScoreDifference = Omit<SkinScores, "measuredDate">;

export interface SkinComparisonResponse {
  type: "AFTER_CARE";
  today: SkinScores;
  previousDay: SkinScores;
  difference: SkinScoreDifference;
}
