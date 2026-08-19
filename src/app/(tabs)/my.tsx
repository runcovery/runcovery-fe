import CareStatusSection from "@/components/my/care-status-section";
import MonthlySkinScoreSection from "@/components/my/monthly-skin-score-section";
import ProfileSection from "@/components/my/profile-section";
import SectionDivider from "@/components/my/section-divider";
import WeeklyMissionSection from "@/components/my/weekly-mission-section";
import GradientScreenLayout from "@/components/shared/gradient-screen-layout";
import LoadingScreen from "@/components/shared/loading";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getMyStats } from "@/apis/user";
import { useProfileStore } from "@/stores/useProfileStore";
import { getApiErrorMessage } from "@/apis";
import Button from "@/components/ui/Button";

export default function MyScreen() {
  const isReady = useProfileStore((state) => state.isUserIdInitialized);
  const statsQuery = useQuery({
    queryKey: ["user", "mypage", "stats-v2"],
    queryFn: getMyStats,
    enabled: isReady,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnReconnect: "always",
  });

  if (!isReady || statsQuery.isLoading) {
    return (
      <View className="flex-1 px-8 pt-16">
        <LoadingScreen
          title="마이페이지를 준비하고 있어요."
          subTitle="이번 주 활동과 피부 기록을 모으고 있어요."
          text="나의 관리 현황을 불러오는 중이에요."
        />
      </View>
    );
  }

  if (statsQuery.isError || !statsQuery.data) {
    return (
      <View className="flex-1 items-center justify-center gap-5 px-8">
        <Text className="text-center text-error">{getApiErrorMessage(statsQuery.error, "마이페이지를 불러오지 못했습니다.")}</Text>
        <Button
          isLoading={statsQuery.isFetching}
          onPress={() => statsQuery.refetch()}
        >
          다시 시도
        </Button>
      </View>
    );
  }

  const stats = statsQuery.data;
  return (
    <View className="flex-1">
      <GradientScreenLayout offsetY={120} edges={["left", "right"]}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 32,
            paddingTop: 64,
            paddingBottom: 36,
          }}
          refreshControl={
            <RefreshControl
              refreshing={statsQuery.isRefetching}
              onRefresh={() => void statsQuery.refetch()}
              colors={["#725AF5"]}
              tintColor="#725AF5"
            />
          }
          showsVerticalScrollIndicator={false}
        >
          <Text className="w-full text-center text-[16px] font-semibold text-black">
            마이페이지
          </Text>

          <ProfileSection nickname={stats.nickname} burnedCalories={stats.burnedCalories} totalCalories={stats.totalCalories} />
          <SectionDivider />
          <WeeklyMissionSection successCount={stats.weeklyMission.successCount} successDays={stats.weeklyMission.successDays} />
          <SectionDivider />
          <CareStatusSection conditionRate={stats.postCare.conditionRate} skinRate={stats.postCare.skinRate} stretchRate={stats.postCare.stretchRate} feedback={stats.postCare.weeklyFeedback} />
          <SectionDivider />

          <MonthlySkinScoreSection scores={stats.monthlySkinScore} />
        </ScrollView>
      </GradientScreenLayout>
    </View>
  );
}
