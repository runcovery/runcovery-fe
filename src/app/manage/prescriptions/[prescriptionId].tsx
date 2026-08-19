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
import StatProgressBar from "@/components/manage/stat-progress-bar";
import LoadingScreen from "@/components/shared/loading";
import StepScreenLayout from "@/components/shared/step-screen-layout";
import Button from "@/components/ui/Button";
import type {
  PrescriptionCategory,
  SkinDetail,
  StretchingDetail,
} from "@/types/wellness";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { isAxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { Image, Linking, ScrollView, Text, View } from "react-native";

const SKIN_METRICS: Array<{ key: keyof SkinDetail; label: string }> = [
  { key: "redness", label: "홍조" },
  { key: "oiliness", label: "유분" },
  { key: "texture", label: "피부결" },
  { key: "pores", label: "모공" },
  { key: "blemishes", label: "잡티" },
  { key: "hydration", label: "보습" },
  { key: "pigment", label: "색소침착" },
];

const getYoutubeThumbnail = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&/]+)/);
  return match?.[1] ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
};

function SkinContent({ detail }: { detail: SkinDetail }) {
  return (
    <View>
      <Text className="mt-3 text-[20px] font-semibold text-neutral-950">
        데일리 피부 진단
      </Text>
      <Text className="mt-2 text-[13px] font-medium text-neutral-300">
        {detail.description}
      </Text>
      <View className="mt-7 gap-6">
        {SKIN_METRICS.map(({ key, label }) => {
          const score = Number(detail[key]);
          return (
            <View key={key}>
              <Text className="text-[14px] font-medium text-neutral-500">
                {label}
              </Text>
              <View className="mt-3">
                <StatProgressBar progress={score} accessibilityLabel={`${label} ${score}점`} />
              </View>
              <Text className="mt-2 self-end text-[12px] font-medium text-neutral-500">
                {score}점
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function StretchingContent({ detail }: { detail: StretchingDetail }) {
  const video = detail.recoveryVideos?.[0];
  const videoUrl = video?.videoUrl || detail.recommendedLink;
  const thumbnail = videoUrl ? getYoutubeThumbnail(videoUrl) : null;

  return (
    <View>
      <Text className="mt-3 text-[20px] font-semibold leading-8 text-neutral-950">
        {video?.title ?? "오늘 무리한 근육을 위한 회복 스트레칭"}
      </Text>
      {thumbnail ? (
        <View className="mt-5 overflow-hidden rounded-[22px] bg-neutral-100">
          <Image source={{ uri: thumbnail }} className="h-55 w-full" resizeMode="cover" />
        </View>
      ) : null}
      {videoUrl ? (
        <View className="mt-4">
          <Button isWhite onPress={() => Linking.openURL(videoUrl)}>
            추천 영상 재생하기
          </Button>
        </View>
      ) : null}
      <Text className="mt-7 text-[18px] font-semibold text-neutral-950">
        AI 영상 추천
      </Text>
      <View className="mt-4 rounded-[20px] border border-primary-440 bg-white px-5 py-5">
        <Text className="text-[13px] font-medium leading-6 text-neutral-500">
          {detail.description}
        </Text>
        {detail.steps?.map((step, index) => (
          <View key={`${step.label}-${index}`} className="mt-5">
            <View className="self-start rounded-lg bg-primary-200 px-3 py-1">
              <Text className="text-[10px] font-semibold text-white">
                {step.label}
              </Text>
            </View>
            <Text className="mt-2 text-[13px] font-medium leading-6 text-neutral-500">
              {step.description}
            </Text>
          </View>
        ))}
        {video?.recommendationReason ? (
          <Text className="mt-5 text-[13px] font-medium leading-6 text-neutral-500">
            {video.recommendationReason}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

export default function PrescriptionDetailScreen() {
  const params = useLocalSearchParams<{ prescriptionId: string }>();
  const prescriptionId = Number(params.prescriptionId);
  const queryClient = useQueryClient();
  const [isAfterCareScan, setIsAfterCareScan] = useState(false);
  const afterCareUploadLockRef = useRef(false);
  const completionStartedRef = useRef(false);
  const detailQuery = useQuery({
    queryKey: ["wellness", "prescription", prescriptionId],
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
        queryClient.invalidateQueries({ queryKey: ["wellness", "prescriptions"] }),
        queryClient.invalidateQueries({ queryKey: ["user", "mypage"] }),
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
      void queryClient.invalidateQueries({ queryKey: ["user", "mypage"] });
    },
    onSettled: () => {
      afterCareUploadLockRef.current = false;
    },
  });
  const afterCareDate = afterCareMutation.data?.measuredDate;
  const comparisonQuery = useQuery({
    queryKey: ["wellness", "skin", "comparison", afterCareDate],
    queryFn: () => getSkinComparison(afterCareDate!),
    enabled: Boolean(afterCareDate),
  });
  const isComparisonNotFound =
    (comparisonQuery.error instanceof ApiError &&
      comparisonQuery.error.status === 404) ||
    (isAxiosError(comparisonQuery.error) &&
      comparisonQuery.error.response?.status === 404);

  const detail = detailQuery.data;
  const completedSkinResult =
    comparisonQuery.data?.type === "AFTER_CARE"
      ? comparisonQuery.data
      : isComparisonNotFound
        ? afterCareMutation.data
        : null;

  useEffect(() => {
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
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ paddingBottom: 28 }}
              showsVerticalScrollIndicator={false}
            >
              {detail.category === "SKIN" && detail.skinDetail ? (
                <SkinContent detail={detail.skinDetail} />
              ) : detail.category === "STRETCH" && detail.stretchingDetail ? (
                <StretchingContent detail={detail.stretchingDetail} />
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
