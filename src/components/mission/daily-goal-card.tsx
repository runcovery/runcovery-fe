import { Image, Text, View } from "react-native";
import OutlineCard from "../shared/outline-card";
import Label from "../ui/label";

const GoalItem = () => {
  return (
    <View className="flex flex-row items-center gap-2">
      <Image
        source={require("../../../assets/images/mission/d-calendar.png")}
        className="w-6 h-6"
      />
      <Text className="text-[12px] font-medium text-neutral-600">
        숨이 약간 찰 정도, 짧은 대답만 가능
      </Text>
    </View>
  );
};

export default function DailyGoalCard() {
  return (
    <View>
      <Text className="text-[14px] font-semibold text-black ml-4">
        일일 목표
      </Text>
      <View className="mt-3">
        <OutlineCard py="py-5">
          <Label text="일일 미션" bg="bg-secondary-400" />
          {/* <Text className="py-10 text-[14px] font-medium text-center text-black whitespace-pre-wrap">
            오늘의 미션을 받으려면 컨디션 체크를{"\n"} 받아야해요.
          </Text> */}
          <Text className="text-[14px] font-semibold text-black mt-2 ml-4">
            중 · 고강도 러닝
          </Text>
          <View className="mt-3 gap-3">
            <GoalItem />
            <GoalItem />
          </View>
        </OutlineCard>
      </View>
    </View>
  );
}
