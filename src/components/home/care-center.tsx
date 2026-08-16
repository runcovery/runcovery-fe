import { Text, View } from "react-native";

export default function CareCenterCard() {
  return (
    <View className="flex-1 min-w-0 aspect-square border rounded-lg relative">
      <View className="gap-1 absolute bottom-3 inset-x-3">
        <Text className="text-[16px] font-semibold text-white">
          웰니스 서울
        </Text>
        <Text className="text-[10px] font-semibold text-white">
          장소 상세 주소
        </Text>
      </View>
    </View>
  );
}
