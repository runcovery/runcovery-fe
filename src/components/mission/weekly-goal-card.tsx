import { Image, Text, View } from "react-native";
import OutlineCard from "../shared/outline-card";
import Label from "../ui/label";
import type { WeeklyGoalResponse } from "@/types/mission";

const GoalItem = ({ children }: { children: string }) => {
  return (
    <View className="flex flex-row items-center gap-2">
      <Image
        source={require("../../../assets/images/mission/w-calendar.png")}
        className="w-6 h-6"
      />
      <Text className="text-[12px] font-medium text-neutral-600">
        {children}
      </Text>
    </View>
  );
};

export default function WeeklyGoalCard({ goal }: { goal?: WeeklyGoalResponse }) {
  return (
    <View>
      <Text className="text-[14px] font-semibold text-black ml-4">
        주간 목표
      </Text>
      <View className="mt-3">
        <OutlineCard py="py-5">
          <View>
            <Label text="주간 목표" bg="bg-[#298DFF]" />
            <Text className="text-[14px] font-semibold text-black ml-2 mt-2">
              {goal ? `${goal.expectedCalories.toLocaleString()} 칼로리 · ${goal.weeklyGoalDistance}km\n${goal.weeklyGoal}` : "아직 생성된 주간 목표가 없어요."}
            </Text>
          </View>
          <View className="mt-3">
            <Label text="스케줄 구성" bg="bg-primary-310" />
            <View className="gap-6 mt-4">
              {goal?.schedules.map((schedule) => (
                <GoalItem key={schedule.trainingId}>{schedule.trainingContent}</GoalItem>
              ))}
            </View>
          </View>
        </OutlineCard>
      </View>
    </View>
  );
}
