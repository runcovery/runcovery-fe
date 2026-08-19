import DailyGoalCard from "@/components/mission/daily-goal-card";
import WeeklyGoalCard from "@/components/mission/weekly-goal-card";
import GradientScreenLayout from "@/components/shared/gradient-screen-layout";
import LoadingScreen from "@/components/shared/loading";
import Button from "@/components/ui/Button";
import { useProfileStore } from "@/stores/useProfileStore";
import { ScrollView, Text, View } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createMissions, getMissions } from "@/apis/mission";
import { generateWeeklyGoal, getCurrentWeeklyGoal } from "@/apis/goal";
import { getConditions } from "@/apis/condition";
import { getApiErrorMessage } from "@/apis";
import { router } from "expo-router";
import { useRef } from "react";

const DEFAULT_LOCATION = {
  lat: 37.5665,
  lon: 126.978,
};

export default function MissionScreen() {
  const nickname = useProfileStore((state) => state.profile.nickname);
  const isReady = useProfileStore((state) => state.isUserIdInitialized);
  const queryClient = useQueryClient();
  const generationLockRef = useRef(false);
  const conditionQuery = useQuery({
    queryKey: ["condition", "latest"],
    queryFn: getConditions,
    enabled: isReady,
    retry: false,
  });
  const missionQuery = useQuery({
    queryKey: ["mission", "today"],
    queryFn: getMissions,
    enabled: isReady,
  });
  const weeklyQuery = useQuery({
    queryKey: ["goal", "weekly", "current"],
    queryFn: getCurrentWeeklyGoal,
    enabled: isReady,
  });
  const generateMutation = useMutation({
    mutationFn: async () => {
      const [mission, weeklyGoal] = await Promise.all([
        missionQuery.data
          ? Promise.resolve(missionQuery.data)
          : createMissions(DEFAULT_LOCATION),
        weeklyQuery.data
          ? Promise.resolve(weeklyQuery.data)
          : generateWeeklyGoal(),
      ]);
      return { mission, weeklyGoal };
    },
    onSuccess: ({ mission, weeklyGoal }) => {
      queryClient.setQueryData(["mission", "today"], mission);
      queryClient.setQueryData(["goal", "weekly", "current"], weeklyGoal);
    },
    onError: async () => {
      await Promise.all([missionQuery.refetch(), weeklyQuery.refetch()]);
    },
    onSettled: () => {
      generationLockRef.current = false;
    },
  });

  const hasCondition = Boolean(conditionQuery.data);
  const hasMission = Boolean(missionQuery.data && weeklyQuery.data);
  const generateErrorMessage = generateMutation.isError
    ? getApiErrorMessage(generateMutation.error, "미션을 생성하지 못했습니다.")
    : null;
  const isDuplicateServerData = generateErrorMessage
    ?.toLowerCase()
    .includes("query did not return a unique result");

  const handlePrimaryAction = () => {
    if (!hasCondition) {
      router.push("/condition-check");
      return;
    }
    if (hasMission) return;
    if (generationLockRef.current || generateMutation.isPending) return;

    generationLockRef.current = true;
    generateMutation.mutate();
  };

  if (
    !isReady ||
    conditionQuery.isLoading ||
    missionQuery.isLoading ||
    weeklyQuery.isLoading
  ) {
    return (
      <View className="flex-1 px-8 pt-16">
        <LoadingScreen
          title="미션을 준비하고 있어요."
          subTitle="목표와 현재 상황에 맞는 계획을 확인하고 있어요."
          text="이번 주 미션을 불러오는 중이에요."
        />
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center">
      <GradientScreenLayout offsetY={120} edges={["left", "right"]}>
        <ScrollView
          className="flex-1 w-full"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 32,
            paddingVertical: 64,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-[16px] font-semibold text-black w-full text-center">
            미션
          </Text>
          <View className="mt-3">
            <View className="w-full gap-1">
              <Text className="text-[18px] font-semibold text-black whitespace-pre-wrap">
                {nickname}님의 목표와 현재 상황을 {"\n"}고려하여 러닝 플랜을 만들었어요!
              </Text>
              <Text className="text-neutral-300 will-change-variable text-[14px] font-medium whitespace-pre-wrap">
                미션 부여 전에 몸 상태를 확인할게요.
              </Text>
            </View>
          </View>
          <View className="mt-4 gap-5 w-full">
            <WeeklyGoalCard goal={weeklyQuery.data} />
            <DailyGoalCard mission={missionQuery.data} />
          </View>
          {generateMutation.isError && (
            <Text className="mt-5 text-center text-error">
              {isDuplicateServerData
                ? "서버에 같은 날짜의 데이터가 중복 저장되어 있어요. 관리자에게 중복 데이터 정리가 필요합니다."
                : generateErrorMessage}
            </Text>
          )}
          <View className="mt-9 w-full">
            <Button
              disabled={hasCondition && hasMission}
              isLoading={generateMutation.isPending}
              onPress={handlePrimaryAction}
            >
              {!hasCondition
                ? "컨디션 체크하기"
                : hasMission
                  ? "오늘의 미션 생성 완료"
                  : "오늘의 미션 생성하기"}
            </Button>
          </View>
        </ScrollView>
      </GradientScreenLayout>
    </View>
  );
}
