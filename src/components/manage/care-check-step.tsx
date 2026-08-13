import { Text, View } from "react-native";
import Button from "../ui/Button";
import OptionCard from "../ui/option-card";

export default function CareCheckStepScreen() {
  return (
    <View className="w-full mt-3 justify-between flex-1">
      <View>
        {/* 타이틀 */}
        <Text className="text-[20px] font-semibold text-neutral-950">
          오늘의 러닝은 어떠셨나요?
        </Text>

        {/* 리스트 */}
        <View className="gap-9 mt-6">
          <OptionCard py="py-6" content="너무 좋았어요!" />
          <OptionCard py="py-6" content="보통이에요." />
          <OptionCard py="py-6" content="너무 힘들었어요." />
        </View>
      </View>

      <Button>다음</Button>
    </View>
  );
}
