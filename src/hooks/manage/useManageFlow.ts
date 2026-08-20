import { useState } from "react";

import type { BodyPartId } from "@/components/body-check";
import {
  ENERGY_BY_OPTION,
  ENERGY_OPTION_BY_VALUE,
  FEELING_BY_OPTION,
  FEELING_OPTION_BY_VALUE,
  SWEAT_BY_OPTION,
  SWEAT_OPTION_BY_VALUE,
  type SurveyOptionId,
} from "@/constants/survey-options";
import type { StepType } from "@/types/careStep";
import type { ReportSurvey } from "@/types/wellness";

export const PREVIOUS_CARE_STEP: Partial<Record<StepType, StepType>> = {
  running: "skin",
  energy: "running",
  sweat: "energy",
  pain: "sweat",
  summary: "pain",
  intensity: "summary",
  report: "intensity",
};

export const isCompleteReportSurvey = (
  survey: Partial<ReportSurvey>,
): survey is ReportSurvey =>
  Boolean(survey.feeling && survey.energy && survey.sweat);

export const useManageFlow = () => {
  const [step, setStep] = useState<StepType>("skin");
  const [selectedBodyParts, setSelectedBodyParts] = useState<BodyPartId[]>([]);
  const [survey, setSurvey] = useState<Partial<ReportSurvey>>({});

  const handleSurveyNext = () => {
    const nextStep: Partial<Record<StepType, StepType>> = {
      running: "energy",
      energy: "sweat",
      sweat: "pain",
    };
    const next = nextStep[step];
    if (next) setStep(next);
  };

  const handleBodyCheckNext = (parts: BodyPartId[]) => {
    setSelectedBodyParts(parts);
    setStep("summary");
  };

  const handleSurveySelect = (id: number) => {
    if (id !== 1 && id !== 2 && id !== 3) return;
    const optionId: SurveyOptionId = id;

    if (step === "running") {
      setSurvey((value) => ({
        ...value,
        feeling: FEELING_BY_OPTION[optionId],
      }));
    }
    if (step === "energy") {
      setSurvey((value) => ({
        ...value,
        energy: ENERGY_BY_OPTION[optionId],
      }));
    }
    if (step === "sweat") {
      setSurvey((value) => ({
        ...value,
        sweat: SWEAT_BY_OPTION[optionId],
      }));
    }
  };

  const selectedSurveyId =
    step === "running" && survey.feeling
      ? FEELING_OPTION_BY_VALUE[survey.feeling]
      : step === "energy" && survey.energy
        ? ENERGY_OPTION_BY_VALUE[survey.energy]
        : step === "sweat" && survey.sweat
          ? SWEAT_OPTION_BY_VALUE[survey.sweat]
          : undefined;

  return {
    handleBodyCheckNext,
    handleSurveyNext,
    handleSurveySelect,
    selectedBodyParts,
    selectedSurveyId,
    setSelectedBodyParts,
    setStep,
    step,
    survey,
  };
};
