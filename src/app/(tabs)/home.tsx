import CareCenterCard from "@/components/home/care-center";
import CareTipCard from "@/components/home/care-tip";
import ConditionOverviewCard from "@/components/home/condition-overview";
import GradientScreenLayout from "@/components/shared/gradient-screen-layout";
import Button from "@/components/ui/Button";
import { useHomeData } from "@/hooks/home/useHomeData";
import { useProfileStore } from "@/stores/useProfileStore";
import { ActivityIndicator, Text, View } from "react-native";

export default function HomeScreen() {
  const storedNickname = useProfileStore((state) => state.profile.nickname);
  const { data, errorMessage, isLoading, reload } = useHomeData();
  const nickname = data?.nickname ?? storedNickname;

  if (isLoading && !data) {
    return (
      <View className="flex-1 items-center justify-center gap-3">
        <ActivityIndicator color="#725AF5" size="large" />
        <Text className="text-[14px] text-neutral-300">
          현재 위치와 홈 정보를 불러오고 있어요.
        </Text>
      </View>
    );
  }

  if (errorMessage && !data) {
    return (
      <View className="flex-1 items-center justify-center px-8 gap-5">
        <Text className="text-[14px] text-neutral-700 text-center">
          {errorMessage}
        </Text>
        <Button onPress={reload}>다시 시도</Button>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <GradientScreenLayout offsetY={120} edges={["left", "right"]}>
        <View className="flex-1 px-8 pt-16">
          {/* 타이틀 */}
          <View>
            <Text className="text-[22px] font-semibold text-black">
              {nickname}님의 현재 상태입니다.
            </Text>
            <Text className="text-[10px] font-medium text-neutral-300">
              오늘도 나를 위한 작은 습관을 이어나가요.
            </Text>
          </View>

          {/* 카드 컨텐츠 */}
          <View className="mt-5 gap-5">
            <ConditionOverviewCard
              achievementRate={data?.achievementRate ?? 0}
              daysRemaining={data?.daysRemaining ?? 0}
              scene={data?.scene ?? "설정된 미래 목표가 없습니다."}
              temp={data?.temp ?? 0}
            />
            <CareTipCard tip={data?.wellnessTip ?? "오늘도 가볍게 시작해보세요."} />
          </View>

          {/* 매장 */}
          <View className="mt-5">
            <Text className="text-[16px] font-semibold text-black">
              오프라인에서도 관리할 수 있어요!
            </Text>
            <View className="flex-row gap-3 mt-5">
              <CareCenterCard />
              <CareCenterCard />
              <CareCenterCard />
            </View>
          </View>
        </View>
      </GradientScreenLayout>
    </View>
  );
}
