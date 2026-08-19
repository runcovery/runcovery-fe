import { getApiErrorMessage } from "@/apis";
import { getTodayActivity, syncActivity } from "@/apis/activity";
import { generateReport, getReportPreview, scanSkin } from "@/apis/wellness";
import { BodyCheckStep, BodyPartId } from "@/components/body-check";
import CareCheckStepScreen from "@/components/manage/care-check-step";
import ManageSummaryScreen from "@/components/manage/manage-summary";
import RunningIntensityAnalysis from "@/components/manage/running-intensity-analysis";
import SkinAnalysisScreen from "@/components/manage/skin-analysis";
import WellnessReport from "@/components/manage/wellness-report";
import StepScreenLayout from "@/components/shared/step-screen-layout";
import { useProfileStore } from "@/stores/useProfileStore";
import { createDemoActivitySyncPayload } from "@/lib/activity-sync";
import { StepType } from "@/types/careStep";
import type { ReportSurvey } from "@/types/wellness";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { View } from "react-native";
import LoadingScreen from "../../components/shared/loading";

export default function ManageScreen() {
  const [step, setStep] = useState<StepType>("skin");
  const [selectedBodyParts, setSelectedBodyParts] = useState<BodyPartId[]>([]);
  const [survey, setSurvey] = useState<Partial<ReportSurvey>>({});
  const isReady = useProfileStore((state) => state.isUserIdInitialized);
  const queryClient = useQueryClient();
  const skinUploadLockRef = useRef(false);
  const reportGenerationLockRef = useRef(false);
  const shouldHandleReportResultRef = useRef(true);

  const activityQuery = useQuery({
    queryKey: ["activity", "today"],
    queryFn: getTodayActivity,
    enabled: isReady && step === "summary",
  });
  const previewQuery = useQuery({
    queryKey: ["wellness", "preview", activityQuery.data?.recordId],
    queryFn: () => getReportPreview(activityQuery.data!.recordId),
    enabled: step === "summary" && Boolean(activityQuery.data?.recordId),
  });
  const activitySyncMutation = useMutation({
    mutationFn: async () => {
      const synced = await syncActivity(createDemoActivitySyncPayload());
      const [activity, preview] = await Promise.all([
        getTodayActivity(),
        getReportPreview(synced.recordId),
      ]);
      return { activity, preview };
    },
    onSuccess: async ({ activity, preview }) => {
      queryClient.setQueryData(["activity", "today"], activity);
      queryClient.setQueryData(
        ["wellness", "preview", activity.recordId],
        preview,
      );
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["mission"] }),
        queryClient.invalidateQueries({ queryKey: ["goal", "weekly"] }),
        queryClient.invalidateQueries({ queryKey: ["user", "mypage"] }),
      ]);
    },
  });
  const reportMutation = useMutation({
    mutationFn: generateReport,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["wellness", "prescriptions"],
      });
      void queryClient.invalidateQueries({ queryKey: ["user", "mypage"] });
      if (!shouldHandleReportResultRef.current) return;
      setStep("intensity");
    },
    onSettled: () => {
      reportGenerationLockRef.current = false;
    },
  });
  const skinMutation = useMutation({
    mutationFn: async (image: {
      uri: string;
      fileName?: string | null;
      mimeType?: string;
    }) => {
      const record = await scanSkin(image, "AFTER_RUN");
      if (record.type !== "AFTER_RUN") {
        throw new Error("운동 후 피부 기록 타입이 올바르지 않습니다.");
      }
      return record;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["user", "mypage"] });
      setStep("running");
    },
    onSettled: () => {
      skinUploadLockRef.current = false;
    },
  });
  const isCheck = step === "running" || step === "energy" || step === "sweat";

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
    if (reportMutation.data) {
      shouldHandleReportResultRef.current = true;
      setStep("intensity");
      return;
    }

    if (
      reportGenerationLockRef.current ||
      reportMutation.isPending ||
      !previewQuery.data ||
      !survey.feeling ||
      !survey.energy ||
      !survey.sweat
    )
      return;
    reportGenerationLockRef.current = true;
    shouldHandleReportResultRef.current = true;
    setStep("loading");
    reportMutation.mutate({
      recordDate: previewQuery.data.recordDate,
      activityRecordId: previewQuery.data.activityRecordId,
      survey: survey as ReportSurvey,
      painPartCodes: selectedBodyParts,
    });
  };

  const handleAfterRunImageSubmit = (image: {
    uri: string;
    fileName?: string | null;
    mimeType?: string;
  }) => {
    if (skinUploadLockRef.current || skinMutation.isPending) return;

    skinUploadLockRef.current = true;
    skinMutation.mutate(image);
  };

  const handleSurveySelect = (id: number) => {
    if (step === "running")
      setSurvey((value) => ({
        ...value,
        feeling: ({ 1: "GREAT", 2: "NORMAL", 3: "EXHAUSTED" } as const)[
          id as 1 | 2 | 3
        ],
      }));
    if (step === "energy")
      setSurvey((value) => ({
        ...value,
        energy: ({ 1: "DEPLETED", 2: "TIRED", 3: "ENERGETIC" } as const)[
          id as 1 | 2 | 3
        ],
      }));
    if (step === "sweat")
      setSurvey((value) => ({
        ...value,
        sweat: ({ 1: "LOW", 2: "MODERATE", 3: "HIGH" } as const)[
          id as 1 | 2 | 3
        ],
      }));
  };

  const selectedSurveyId =
    step === "running"
      ? ({ GREAT: 1, NORMAL: 2, EXHAUSTED: 3 } as const)[survey.feeling!]
      : step === "energy"
        ? ({ DEPLETED: 1, TIRED: 2, ENERGETIC: 3 } as const)[survey.energy!]
        : step === "sweat"
          ? ({ LOW: 1, MODERATE: 2, HIGH: 3 } as const)[survey.sweat!]
          : undefined;

  const handleBack = () => {
    if (step === "skin") {
      router.back();
      return;
    }

    if (step === "loading") {
      shouldHandleReportResultRef.current = false;
      setStep("summary");
      return;
    }

    const previousStep: Partial<Record<StepType, StepType>> = {
      running: "skin",
      energy: "running",
      sweat: "energy",
      pain: "sweat",
      summary: "pain",
      intensity: "summary",
      report: "intensity",
    };
    const previous = previousStep[step];

    if (previous) {
      if (step === "summary") reportMutation.reset();
      setStep(previous);
    }
  };

  return (
    <View className="flex-1">
      <StepScreenLayout
        title="사후 관리"
        onBack={handleBack}
        edges={["left", "right"]}
        contentContainerStyle={
          step === "report" ? { paddingBottom: 0 } : undefined
        }
      >
        {isCheck && (
          <CareCheckStepScreen
            step={step}
            onNext={handleNext}
            selectedId={selectedSurveyId}
            onSelect={handleSurveySelect}
          />
        )}
        {step === "pain" && (
          <BodyCheckStep
            selectedParts={selectedBodyParts}
            onChange={setSelectedBodyParts}
            onNext={handleBodyCheckNext}
          />
        )}
        {step === "summary" &&
          (previewQuery.data ? (
            <ManageSummaryScreen
              onNext={startReportLoading}
              onSync={() => activitySyncMutation.mutate()}
              preview={previewQuery.data}
              isSyncing={
                activitySyncMutation.isPending ||
                activityQuery.isFetching ||
                previewQuery.isFetching
              }
              syncError={
                activitySyncMutation.isError
                  ? getApiErrorMessage(
                      activitySyncMutation.error,
                      "활동 기록을 동기화하지 못했습니다.",
                    )
                  : null
              }
            />
          ) : activityQuery.isError || previewQuery.isError ? (
            <LoadingScreen
              title="러닝 기록을 확인하고 있어요."
              subTitle="웰니스 리포트에 사용할 활동을 찾고 있어요."
              text="러닝 기록을 불러오는 중이에요."
              error={
                activityQuery.isError
                  ? getApiErrorMessage(
                      activityQuery.error,
                      "오늘의 러닝 기록이 없습니다.",
                    )
                  : getApiErrorMessage(
                      previewQuery.error,
                      "러닝 기록 상세를 불러오지 못했습니다.",
                    )
              }
              onRetry={() => {
                void activityQuery.refetch().then(() => previewQuery.refetch());
              }}
            />
          ) : (
            <LoadingScreen
              title="러닝 기록을 확인하고 있어요."
              subTitle="웰니스 리포트에 사용할 활동을 찾고 있어요."
              text="러닝 기록을 불러오는 중이에요."
            />
          ))}
        {step === "skin" && (
          <SkinAnalysisScreen
            isLoading={skinMutation.isPending}
            error={
              skinMutation.isError
                ? getApiErrorMessage(
                    skinMutation.error,
                    "피부 이미지를 분석하지 못했어요. 다시 시도해 주세요.",
                  )
                : null
            }
            onSubmit={handleAfterRunImageSubmit}
          />
        )}
        {step === "loading" && (
          <LoadingScreen
            title="입력해 주신 컨디션과 러닝 데이터를 종합하여 맞춤형 회복 리포트를 작성하고 있습니다."
            subTitle="잠시만 기다려주시면 맞춤 리포트가 완성돼요."
            text="고양이가 리포트를 열심히 적고 있어요!"
            error={
              reportMutation.isError
                ? getApiErrorMessage(
                    reportMutation.error,
                    "리포트를 생성하지 못했습니다. 컨디션·활동·운동 후 피부 기록이 모두 있는지 확인해 주세요.",
                  )
                : null
            }
            onRetry={startReportLoading}
          />
        )}
        {step === "intensity" && (
          <RunningIntensityAnalysis
            intensity={reportMutation.data!.intensity}
            onPressReport={() => setStep("report")}
          />
        )}
        {step === "report" && reportMutation.data && (
          <WellnessReport report={reportMutation.data} />
        )}
      </StepScreenLayout>
    </View>
  );
}
