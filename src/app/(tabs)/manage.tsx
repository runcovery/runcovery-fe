import { BodyCheckStep, BodyPartId } from "@/components/body-check";
// import ComparisonResultScreen from "@/components/manage/comparison-result";
// import SkinAnalysisScreen from "@/components/manage/skin-analysis";
import CareCheckStepScreen from "@/components/manage/care-check-step";
import ManageSummaryScreen from "@/components/manage/manage-summary";
import RunningIntensityAnalysis from "@/components/manage/running-intensity-analysis";
import WellnessReport from "@/components/manage/wellness-report";
import StepScreenLayout from "@/components/shared/step-screen-layout";
import { StepType } from "@/types/careStep";
import { useEffect, useState } from "react";
import { View } from "react-native";
import LoadingScreen from "../../components/shared/loading";

const REPORT_LOADING_DELAY_MS = 1800;

const createRecoveryReport = () =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, REPORT_LOADING_DELAY_MS);
  });

export default function ManageScreen() {
  const [step, setStep] = useState<StepType>("running");
  const [selectedBodyParts, setSelectedBodyParts] = useState<BodyPartId[]>([]);
  const [loadingAttempt, setLoadingAttempt] = useState(0);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  const isCheck = step === "running" || step === "energy" || step === "sweat";

  useEffect(() => {
    if (step !== "loading") return;

    let isActive = true;
    setLoadingError(null);

    createRecoveryReport()
      .then(() => {
        if (isActive) setStep("intensity");
      })
      .catch(() => {
        if (isActive) {
          setLoadingError("네트워크 상태를 확인한 뒤 다시 시도해 주세요.");
        }
      });

    return () => {
      isActive = false;
    };
  }, [loadingAttempt, step]);

  const handleNext = () => {
    if (step === "running") setStep("energy");
    if (step === "energy") setStep("sweat");
    if (step === "sweat") setStep("pain");
  };

  const handleBodyCheckNext = (parts: BodyPartId[]) => {
    setSelectedBodyParts(parts);
    setStep("summary");
  };

  const startReportLoading = () => {
    setLoadingAttempt((attempt) => attempt + 1);
    setStep("loading");
  };

  return (
    <View className="flex-1">
      <StepScreenLayout
        title="사후 관리"
        edges={["left", "right"]}
        contentContainerStyle={
          step === "report" ? { paddingBottom: 0 } : undefined
        }
      >
        {isCheck && <CareCheckStepScreen step={step} onNext={handleNext} />}
        {step === "pain" && (
          <BodyCheckStep
            selectedParts={selectedBodyParts}
            onChange={setSelectedBodyParts}
            onNext={handleBodyCheckNext}
          />
        )}
        {step === "summary" && (
          <ManageSummaryScreen onNext={startReportLoading} />
        )}
        {step === "loading" && (
          <LoadingScreen
            title="입력해 주신 컨디션과 러닝 데이터를 종합하여 맞춤형 회복 리포트를 작성하고 있습니다."
            subTitle="잠시만 기다려주시면 맞춤 리포트가 완성돼요."
            text="고양이가 리포트를 열심히 적고 있어요!"
            error={loadingError}
            onRetry={startReportLoading}
          />
        )}
        {step === "intensity" && (
          <RunningIntensityAnalysis
            onPressReport={() => setStep("report")}
          />
        )}
        {step === "report" && <WellnessReport />}
        {/* <SkinAnalysisScreen /> */}
        {/* <ComparisonResultScreen /> */}
      </StepScreenLayout>
    </View>
  );
}
