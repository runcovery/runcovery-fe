import { ApiError, getApiErrorMessage } from "@/apis";
import {
  getSkinComparison,
  getPrescriptionDetail,
  scanSkin,
  updatePrescriptionCompletion,
} from "@/apis/wellness";
import SkinAnalysisScreen, {
  type SelectedImage,
} from "@/components/manage/skin-analysis";
import SkinResultScreen from "@/components/manage/skin-result";
import {
  SkinPrescriptionContent,
  StretchingPrescriptionContent,
} from "@/components/manage/prescription-detail-content";
import LoadingScreen from "@/components/shared/loading";
import StepScreenLayout from "@/components/shared/step-screen-layout";
import Button from "@/components/ui/Button";
import type {
  PrescriptionCategory,
} from "@/types/wellness";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { queryKeys } from "@/lib/query-keys";

export default function PrescriptionDetailScreen() {
  const params = useLocalSearchParams<{ prescriptionId: string }>();
  const prescriptionId = Number(params.prescriptionId);
  const queryClient = useQueryClient();
  const [isAfterCareScan, setIsAfterCareScan] = useState(false);
  const afterCareUploadLockRef = useRef(false);
  const completionStartedRef = useRef(false);
  const detailQuery = useQuery({
    queryKey: queryKeys.wellness.prescription(prescriptionId),
    queryFn: () => getPrescriptionDetail(prescriptionId),
    enabled: Number.isInteger(prescriptionId) && prescriptionId > 0,
  });
  const completionMutation = useMutation({
    mutationFn: ({
      category,
      reportId,
    }: {
      category: Extract<PrescriptionCategory, "SKIN" | "STRETCH">;
      reportId: number;
    }) =>
      updatePrescriptionCompletion({
        category,
        reportId,
        isCompleted: true,
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.wellness.prescriptions }),
        queryClient.invalidateQueries({ queryKey: queryKeys.user.all }),
      ]);
    },
  });
  const afterCareMutation = useMutation({
    mutationFn: async (image: SelectedImage) => {
      const record = await scanSkin(image, "AFTER_CARE");
      if (record.type !== "AFTER_CARE") {
        throw new Error("관리 후 피부 기록 타입이 올바르지 않습니다.");
      }
      return record;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
    },
    onSettled: () => {
      afterCareUploadLockRef.current = false;
    },
  });
  const afterCareDate = afterCareMutation.data?.measuredDate;
  const comparisonQuery = useQuery({
    queryKey: queryKeys.wellness.skinComparison(afterCareDate),
    queryFn: () => {
      if (!afterCareDate) {
        throw new Error("After-care date has not been loaded.");
      }
      return getSkinComparison(afterCareDate);
    },
    enabled: Boolean(afterCareDate),
  });
  const isComparisonNotFound =
    comparisonQuery.error instanceof ApiError &&
    comparisonQuery.error.status === 404;

  const detail = detailQuery.data;
  const completedSkinResult =
    // 비교할 전날 기록이 없는 404는 실패가 아니라 오늘 측정값만 보여주는 정상 분기다.
    comparisonQuery.data?.type === "AFTER_CARE"
      ? comparisonQuery.data
      : isComparisonNotFound
        ? afterCareMutation.data
        : null;

  useEffect(() => {
    // 관리 후 분석 결과가 화면에 준비된 시점에 피부 처방 완료를 한 번만 저장한다.
    if (
      !detail ||
      detail.category !== "SKIN" ||
      !isAfterCareScan ||
      !completedSkinResult ||
      detail.isCompleted ||
      completionStartedRef.current
    ) {
      return;
    }

    completionStartedRef.current = true;
    completionMutation.mutate(
      { category: "SKIN", reportId: detail.reportId },
      {
        onError: () => {
          completionStartedRef.current = false;
        },
      },
    );
  }, [completedSkinResult, detail, isAfterCareScan]);

  const completeCare = () => {
    // 피부 처방은 완료 전에 AFTER_CARE 측정이 필수이고, 스트레칭은 즉시 완료할 수 있다.
    if (!detail?.completionSupported || detail.category === "NUTRITION") {
      router.back();
      return;
    }
    if (detail.category === "SKIN" && !isAfterCareScan) {
      setIsAfterCareScan(true);
      return;
    }
    completionMutation.mutate(
      {
        category: detail.category,
        reportId: detail.reportId,
      },
      {
        onSuccess: () => {
          if (detail.category === "STRETCH") router.back();
        },
      },
    );
  };

  const submitAfterCareImage = (image: SelectedImage) => {
    // mutation의 isPending 반영 전 연속 탭까지 ref 잠금으로 방어한다.
    if (afterCareUploadLockRef.current || afterCareMutation.isPending) return;

    afterCareUploadLockRef.current = true;
    afterCareMutation.mutate(image);
  };

  const handleBack = () => {
    if (isAfterCareScan) {
      setIsAfterCareScan(false);
      afterCareMutation.reset();
      completionStartedRef.current = false;
      return;
    }

    router.back();
  };

  return (
    <View className="flex-1">
      <StepScreenLayout
        title="사후 관리"
        onBack={handleBack}
        edges={["left", "right"]}
      >
        {/* 처방전 로딩·오류 상태 */}
        {detailQuery.isLoading ? (
          <LoadingScreen
            title="맞춤 처방전을 준비하고 있어요."
            subTitle="러닝 후 상태에 맞는 관리 방법을 확인하고 있어요."
            text="처방전 상세 내용을 불러오는 중이에요."
          />
        ) : detailQuery.isError || !detail ? (
          <View className="flex-1 items-center justify-center gap-5">
            <Text className="text-center text-error">
              {getApiErrorMessage(detailQuery.error, "처방전을 불러오지 못했습니다.")}
            </Text>
            <Button
              isLoading={detailQuery.isFetching}
              onPress={() => detailQuery.refetch()}
            >
              다시 시도
            </Button>
          </View>
        ) : detail.category === "SKIN" && isAfterCareScan ? (
          /* 관리 후 피부 측정 및 비교 결과 */
          completedSkinResult ? (
            <SkinResultScreen result={completedSkinResult} />
          ) : afterCareDate ? (
            <View className="flex-1 items-center justify-center gap-5">
              {comparisonQuery.isError ? (
                <>
                  <Text className="text-center text-error">
                    {getApiErrorMessage(
                      comparisonQuery.error,
                      "전날 관리 후 기록과 비교하지 못했습니다.",
                    )}
                  </Text>
                  <Button
                    isLoading={comparisonQuery.isFetching}
                    onPress={() => comparisonQuery.refetch()}
                  >
                    비교 결과 다시 불러오기
                  </Button>
                </>
              ) : (
                <LoadingScreen
                  title="피부 변화를 확인하고 있어요."
                  subTitle="관리 전후 피부 점수를 비교하고 있어요."
                  text="피부 분석 결과를 정리하는 중이에요."
                />
              )}
            </View>
          ) : (
            <SkinAnalysisScreen
              isLoading={afterCareMutation.isPending}
              error={
                afterCareMutation.isError
                  ? getApiErrorMessage(
                      afterCareMutation.error,
                      "관리 후 피부 이미지를 분석하지 못했어요.",
                    )
                  : null
              }
              onSubmit={submitAfterCareImage}
            />
          )
        ) : (
          <View className="flex-1">
            {/* 카테고리별 처방 상세 */}
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ paddingBottom: 28 }}
              showsVerticalScrollIndicator={false}
            >
              {detail.category === "SKIN" && detail.skinDetail ? (
                <SkinPrescriptionContent detail={detail.skinDetail} />
              ) : detail.category === "STRETCH" && detail.stretchingDetail ? (
                <StretchingPrescriptionContent detail={detail.stretchingDetail} />
              ) : (
                <View>
                  <Text className="mt-3 text-[20px] font-semibold text-neutral-950">
                    {detail.title}
                  </Text>
                  <Text className="mt-3 text-[14px] font-medium leading-7 text-neutral-500">
                    {detail.nutritionDetail?.description ?? detail.summary}
                  </Text>
                  {detail.nutritionDetail ? (
                    <View className="mt-7 flex-row gap-4">
                      <View className="flex-1 rounded-[18px] border border-neutral-100 bg-white p-5">
                        <Text className="text-[12px] text-neutral-300">러닝 시간</Text>
                        <Text className="mt-2 text-[24px] font-semibold text-primary-500">
                          {Math.round(detail.nutritionDetail.runningDurationSeconds / 60)}분
                        </Text>
                      </View>
                      <View className="flex-1 rounded-[18px] border border-neutral-100 bg-white p-5">
                        <Text className="text-[12px] text-neutral-300">소모 칼로리</Text>
                        <Text className="mt-2 text-[24px] font-semibold text-primary-500">
                          {detail.nutritionDetail.caloriesBurned}kcal
                        </Text>
                      </View>
                    </View>
                  ) : null}
                </View>
              )}
            </ScrollView>

            {/* 처방 완료 버튼 */}
            {completionMutation.isError ? (
              <Text className="mb-3 text-center text-[12px] text-error">
                {getApiErrorMessage(completionMutation.error, "완료 상태를 저장하지 못했습니다.")}
              </Text>
            ) : null}
            <Button
              disabled={detail.isCompleted}
              isLoading={completionMutation.isPending}
              onPress={completeCare}
            >
              {detail.isCompleted ? "관리 완료됨" : "관리 완료"}
            </Button>
          </View>
        )}
      </StepScreenLayout>
    </View>
  );
}
