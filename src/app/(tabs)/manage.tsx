import { getApiErrorMessage } from "@/apis";
import { getTodayActivity, syncActivity } from "@/apis/activity";
import { generateReport, getReportPreview, scanSkin } from "@/apis/wellness";
import { BodyCheckStep } from "@/components/body-check";
import CareCheckStepScreen from "@/components/manage/care-check-step";
import ManageSummaryScreen from "@/components/manage/manage-summary";
import RunningIntensityAnalysis from "@/components/manage/running-intensity-analysis";
import SkinAnalysisScreen from "@/components/manage/skin-analysis";
import WellnessReport from "@/components/manage/wellness-report";
import StepScreenLayout from "@/components/shared/step-screen-layout";
import { useProfileStore } from "@/stores/useProfileStore";
import { createDemoActivitySyncPayload } from "@/lib/activity-sync";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useRef } from "react";
import { View } from "react-native";
import LoadingScreen from "../../components/shared/loading";
import { queryKeys } from "@/lib/query-keys";
import {
  isCompleteReportSurvey,
  PREVIOUS_CARE_STEP,
  useManageFlow,
} from "@/hooks/manage/useManageFlow";

export default function ManageScreen() {
  const {
    handleBodyCheckNext,
    handleSurveyNext,
    handleSurveySelect,
    selectedBodyParts,
    selectedSurveyId,
    setSelectedBodyParts,
    setStep,
    step,
    survey,
  } = useManageFlow();
  const isReady = useProfileStore((state) => state.isUserIdInitialized);
  const queryClient = useQueryClient();
  const skinUploadLockRef = useRef(false);
  const reportGenerationLockRef = useRef(false);
  const shouldHandleReportResultRef = useRef(true);

  const activityQuery = useQuery({
    queryKey: queryKeys.activity.today,
    queryFn: getTodayActivity,
    enabled: isReady && step === "summary",
  });
  const activityRecordId = activityQuery.data?.recordId;
  const previewQuery = useQuery({
    queryKey: queryKeys.wellness.preview(activityRecordId),
    queryFn: () => {
      if (!activityRecordId) {
        throw new Error("Activity record ID has not been loaded.");
      }
      return getReportPreview(activityRecordId);
    },
    enabled: step === "summary" && Boolean(activityRecordId),
  });
  const activitySyncMutation = useMutation({
    mutationFn: async () => {
      // 활동 동기화 직후 서버 기준의 활동과 리포트 미리보기를 함께 다시 받는다.
      const synced = await syncActivity(createDemoActivitySyncPayload());
      const [activity, preview] = await Promise.all([
        getTodayActivity(),
        getReportPreview(synced.recordId),
      ]);
      return { activity, preview };
    },
    onSuccess: async ({ activity, preview }) => {
      // 같은 기록을 사용하는 화면들이 추가 요청 없이 최신 값을 읽도록 캐시를 맞춘다.
      queryClient.setQueryData(queryKeys.activity.today, activity);
      queryClient.setQueryData(
        queryKeys.wellness.preview(activity.recordId),
        preview,
      );
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.mission.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.goal.weekly }),
        queryClient.invalidateQueries({ queryKey: queryKeys.user.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.home.all }),
      ]);
    },
  });
  const reportMutation = useMutation({
    mutationFn: generateReport,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.wellness.prescriptions,
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.home.all });
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
      void queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
      setStep("running");
    },
    onSettled: () => {
      skinUploadLockRef.current = false;
    },
  });
  const isCheck = step === "running" || step === "energy" || step === "sweat";

  const startReportLoading = () => {
    // 이미 생성된 결과가 있으면 뒤로 갔다 돌아와도 리포트를 중복 생성하지 않는다.
    if (reportMutation.data) {
      shouldHandleReportResultRef.current = true;
      setStep("intensity");
      return;
    }

    if (
      reportGenerationLockRef.current ||
      reportMutation.isPending ||
      !previewQuery.data ||
      !isCompleteReportSurvey(survey)
    )
      return;
    // mutation 상태가 갱신되기 전의 짧은 구간도 ref 잠금으로 중복 탭을 차단한다.
    reportGenerationLockRef.current = true;
    shouldHandleReportResultRef.current = true;
    setStep("loading");
    reportMutation.mutate({
      recordDate: previewQuery.data.recordDate,
      activityRecordId: previewQuery.data.activityRecordId,
      survey,
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

  const handleBack = () => {
    if (step === "skin") {
      router.back();
      return;
    }

    if (step === "loading") {
      // 생성 요청은 취소하지 않고, 완료 후 강제 화면 전환만 막는다.
      shouldHandleReportResultRef.current = false;
      setStep("summary");
      return;
    }

    const previous = PREVIOUS_CARE_STEP[step];

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
        {/* 러닝 만족도·에너지·땀 설문 */}
        {isCheck && (
          <CareCheckStepScreen
            step={step}
            onNext={handleSurveyNext}
            selectedId={selectedSurveyId}
            onSelect={handleSurveySelect}
          />
        )}
        {/* 통증 부위 선택 */}
        {step === "pain" && (
          <BodyCheckStep
            selectedParts={selectedBodyParts}
            onChange={setSelectedBodyParts}
            onNext={handleBodyCheckNext}
          />
        )}
        {/* 활동 기록 요약 */}
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
        {/* 러닝 직후 피부 분석 */}
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
        {/* 웰니스 리포트 생성 로딩 */}
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
        {/* 러닝 강도 분석 */}
        {step === "intensity" && reportMutation.data && (
          <RunningIntensityAnalysis
            intensity={reportMutation.data.intensity}
            onPressReport={() => setStep("report")}
          />
        )}
        {/* 최종 웰니스 처방전 */}
        {step === "report" && reportMutation.data && (
          <WellnessReport report={reportMutation.data} />
        )}
      </StepScreenLayout>
    </View>
  );
}
