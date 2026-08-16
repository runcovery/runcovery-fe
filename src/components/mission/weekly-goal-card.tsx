import { Image, Text, View } from "react-native";
import OutlineCard from "../shared/outline-card";
import Label from "../ui/label";

const GoalItem = () => {
  return (
    <View className="flex flex-row items-center gap-2">
      <Image
        source={require("../../../assets/images/mission/w-calendar.png")}
        className="w-6 h-6"
      />
      <Text className="text-[12px] font-medium text-neutral-600">
        고강도 인터벌 러닝 (트레드밀/평지)
      </Text>
    </View>
  );
};

export default function WeeklyGoalCard() {
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
              1230 칼로리 소모하기{"\n"}
              목표 페이스(5'00") 체감하기 및 기초 체력 향상
            </Text>
          </View>
          <View className="mt-3">
            <Label text="스케줄 구성" bg="bg-primary-310" />
            <View className="gap-6 mt-4">
              <GoalItem />
              <GoalItem />
              <GoalItem />
            </View>
          </View>
        </OutlineCard>
      </View>
    </View>
  );
}
