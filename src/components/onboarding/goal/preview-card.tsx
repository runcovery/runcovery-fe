import Label from "@/components/ui/label";
import { Image, Text, View } from "react-native";

export default function PreviewCard() {
  return (
    <View className="border border-primary-440 rounded-[22px] bg-primary-50 shadow-[0_2px_4px_rgba(0,0,0,0.08)] px-5 py-4">
      <Label text="AI 추천 장면" bg="bg-primary-500" />
      <Text className="text-[18px] font-semibold text-black mt-3">
        계단을 올라도 숨이 차지 않는 나
      </Text>
      <Text className="mt-2 will-change-variable whitespace-pre-wrap text-[12px] font-medium text-neutral-300">
        기본 체력이 아직 부족한 00님에게는 이런 장면을 {"\n"}추천드려요!
      </Text>
      <Image
        source={require("../../../../assets/images/character/pink-cat.png")}
        className="absolute w-13 h-15 bottom-0 right-3"
      />
    </View>
  );
}
