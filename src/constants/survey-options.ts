import type { BodyCondition, SleepQuality } from "@/types/condition";
import type {
  SurveyEnergy,
  SurveyFeeling,
  SurveySweat,
} from "@/types/wellness";

export type SurveyOptionId = 1 | 2 | 3;

export const BODY_CONDITION_BY_OPTION: Record<SurveyOptionId, BodyCondition> = {
  1: "EXHAUSTED",
  2: "FAIR",
  3: "GOOD",
};

export const SLEEP_QUALITY_BY_OPTION: Record<SurveyOptionId, SleepQuality> = {
  1: "GOOD",
  2: "FAIR",
  3: "POOR",
};

export const FEELING_BY_OPTION: Record<SurveyOptionId, SurveyFeeling> = {
  1: "GREAT",
  2: "NORMAL",
  3: "EXHAUSTED",
};

export const ENERGY_BY_OPTION: Record<SurveyOptionId, SurveyEnergy> = {
  1: "DEPLETED",
  2: "TIRED",
  3: "ENERGETIC",
};

export const SWEAT_BY_OPTION: Record<SurveyOptionId, SurveySweat> = {
  1: "LOW",
  2: "MODERATE",
  3: "HIGH",
};

export const FEELING_OPTION_BY_VALUE: Record<SurveyFeeling, SurveyOptionId> = {
  GREAT: 1,
  NORMAL: 2,
  EXHAUSTED: 3,
};

export const ENERGY_OPTION_BY_VALUE: Record<SurveyEnergy, SurveyOptionId> = {
  DEPLETED: 1,
  TIRED: 2,
  ENERGETIC: 3,
};

export const SWEAT_OPTION_BY_VALUE: Record<SurveySweat, SurveyOptionId> = {
  LOW: 1,
  MODERATE: 2,
  HIGH: 3,
};
