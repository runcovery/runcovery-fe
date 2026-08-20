import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import OutlineCard from "../shared/outline-card";
import Label from "../ui/label";
import AchievementProgress from "./achievement-progress";

const getOverviewImage = (progress: number) => {
  if (progress >= 100) {
    return require("../../../assets/images/home/overview-100.png");
  }
  if (progress >= 80) {
    return require("../../../assets/images/home/overview-over-50.png");
  }
  if (progress >= 50) {
    return require("../../../assets/images/home/overview-over-50-under-80.png");
  }
  return require("../../../assets/images/home/overview-under-50.png");
};

interface ConditionOverviewCardProps {
  achievementRate: number;
  daysRemaining: number;
  scene: string;
  temp: number;
}

export default function ConditionOverviewCard({
  achievementRate,
  daysRemaining,
  scene,
  temp,
}: ConditionOverviewCardProps) {
  const progress = Math.min(100, Math.max(0, achievementRate));
  const overviewImage = getOverviewImage(progress);

  return (
    <OutlineCard>
      {/* 미래 목표 라벨 */}
      <Label text="미래의 나" bg="bg-primary-500" />
      <View className="flex-row justify-between gap-3 mt-4">
        {/* 목표 장면과 달성률별 캐릭터 */}
        <View className="flex-1 min-w-0 gap-2">
          <Text className="text-[18px] font-semibold text-black whitespace-pre-wrap">
            {scene}
          </Text>
          <Text className="text-[12px] font-medium text-neutral-300">
            체력이 좋아져 하루가 가벼운 모습
          </Text>
          <Image
            source={overviewImage}
            className="w-full max-w-50 h-40 mt-4"
            resizeMode="contain"
          />
        </View>
        {/* 목표 달성률과 남은 기간 */}
        <View className="shrink-0 items-end">
          <AchievementProgress progress={progress} />
          <Text className="text-[16px] font-bold text-neutral-300 mt-5">
            {temp}°C
          </Text>
          <Text className="text-[48px] font-bold text-primary-500 -mt-2">
            {daysRemaining > 0 ? `D-${daysRemaining}` : "D-Day"}
          </Text>
          <Text className="text-[10px] font-medium text-neutral-300">
            목표 달성까지 남은 시간
          </Text>
          <Pressable onPress={() => router.navigate("/onboarding/goal/detail")}>
            <Text className="text-[10px] font-medium text-primary-440 mt-1">
              목표 변경하기 {">"}
            </Text>
          </Pressable>
        </View>
      </View>
    </OutlineCard>
  );
}
