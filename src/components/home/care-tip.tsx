import { Text, View } from "react-native";
import OutlineCard from "../shared/outline-card";

export default function CareTipCard({ tip }: { tip: string }) {
  return (
    <OutlineCard py="py-5">
      <View className="flex flex-row gap-3">
        <Text className="text-[16px] font-semibold text-black">
          사후 관리 팁
        </Text>
        <View className="bg-primary-280 w-12 justify-center items-center rounded-lg">
          <Text className="font-semibold text-[10px] text-white">New</Text>
        </View>
      </View>
      <View className="gap-2 mt-3">
        <Text className="text-[12px] font-semibold text-neutral-700">
          {tip}
        </Text>
        <Text className="text-[10px] font-medium text-neutral-300">
          수분 보충은 회복의 시작이에요.
        </Text>
      </View>
    </OutlineCard>
  );
}
