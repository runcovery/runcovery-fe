import DailyGoalCard from "@/components/mission/daily-goal-card";
import WeeklyGoalCard from "@/components/mission/weekly-goal-card";
import GradientScreenLayout from "@/components/shared/gradient-screen-layout";
import Button from "@/components/ui/Button";
import { ScrollView, Text, View } from "react-native";

export default function MissionScreen() {
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
                00님의 목표와 현재 상황을 {"\n"}고려하여 러닝 플랜을 만들었어요!
              </Text>
              <Text className="text-neutral-300 will-change-variable text-[14px] font-medium whitespace-pre-wrap">
                미션 부여 전에 몸 상태를 확인할게요.
              </Text>
            </View>
          </View>
          <View className="mt-4 gap-5 w-full">
            <WeeklyGoalCard />
            <DailyGoalCard />
          </View>
          <View className="mt-9 w-full">
            <Button>컨디션 체크하기</Button>
          </View>
        </ScrollView>
      </GradientScreenLayout>
    </View>
  );
}
