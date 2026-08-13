import { Image, Text, View } from "react-native";

export default function SkinAnalysisScreen() {
  return (
    <View className="flex-1 w-full px-8 items-center mt-10">
      {/* 타이틀 */}
      <View className="gap-3">
        <Text className="text-[20px] font-semibold text-black">
          원에 맞춰 얼굴을 가져다주세요.
        </Text>
        <Text className="text-[14px] font-medium text-neutral-300 text-center">
          메이크업을 지우고 밝은 조명에서 {"\n"}촬영하면 더 정확합니다!
        </Text>
      </View>

      <View className="my-10 h-108 w-75 rounded-[50%] bg-neutral-100 shadow-[0_4px_4px_rgba(0,0,0,0.12)]" />

      <Text className="text-[14px] font-medium text-neutral-500">
        피부 상태를 측정중이에요.
      </Text>

      {/* 하단 캐릭터 */}
      <View className="w-full items-end mt-6">
        <Image
          source={require("../../../assets/images/character/lying-puple-cat-manage.png")}
          className="w-30 h-16 ml-2"
        />
      </View>
    </View>
  );
}
