import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import AchievementProgress from "./achievement-progress";

// const RenderImg = []

export default function ConditionOverviewCard() {
  const progress = 100;
  const renderImg =
    progress > 50
      ? require("../../../assets/images/home/overview-main.png")
      : require("../../../assets/images/home/overview-under-50.png");

  return (
    <View className="border border-primary-500 rounded-[18px] px-5 py-3 bg-white">
      <View className="bg-primary-500 rounded-lg max-w-18 items-center justify-center py-1">
        <Text className="text-white text-[10px] font-semibold">미래의 나</Text>
      </View>

      <View className="flex flex-row justify-between mt-4">
        <View className="gap-2">
          <Text className="text-[18px] font-semibold text-black whitespace-pre-wrap">
            16층을 걸어도 지치지 {"\n"}않는 나 💪
          </Text>
          <Text className="text-[12px] font-medium text-neutral-300">
            체력이 좋아져 하루가 가벼운 모습
          </Text>
          <Image
            source={
              progress === 100
                ? require("../../../assets/images/home/overview-100.png")
                : renderImg
            }
            className="w-50 h-40 mt-4"
            resizeMode="contain"
          />
        </View>
        <View className="items-end">
          <AchievementProgress progress={progress} />
          <Text className="text-[16px] font-bold text-neutral-300 mt-5">
            26°C
          </Text>
          <Text className="text-[48px] font-bold text-primary-500 -mt-2">
            D-4
          </Text>
          <Text className="text-[10px] font-medium text-neutral-300">
            목표 달성까지 남은 시간
          </Text>
          <Pressable onPress={() => router.navigate("/onboarding/goal/detail")}>
            <Text className="text-[10px] font-medium text-primary-440 mt-1">
              목표 변경하기 {">"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
