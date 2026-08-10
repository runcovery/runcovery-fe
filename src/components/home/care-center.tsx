import { Text, View } from "react-native";

export default function CareCenterCard() {
  return (
    <View className="w-40 h-40 border rounded-lg relative">
      <View className="gap-2 absolute bottom-4 left-4">
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
