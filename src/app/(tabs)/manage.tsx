import StatItem from "@/components/manage/stat-item";
import TitleSection from "@/components/onboarding/title-section";
import GradientScreenLayout from "@/components/shared/gradient-screen-layout";
import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

export default function ManageScreen() {
  return (
    <View className="flex-1 justify-center">
      <GradientScreenLayout offsetY={120}>
        <View className="items-start justify-center flex-1 py-16 w-full px-8">
          {/* 이전 버튼 */}
          <View className="flex flex-row items-center">
            <Pressable
              onPress={() => router.back()}
              className="h-10 w-10 -ml-3"
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="뒤로 가기"
            >
              <Image
                source={require("../../../assets/images/shared/prev.png")}
                className="h-full w-full"
              />
            </Pressable>
            <Text className="text-[16px] font-semibold text-black ml-32">
              사후 관리
            </Text>
          </View>

          {/* 타이틀 */}
          <View className="items-start w-full mt-3">
            <TitleSection
              title="관리 후 비교한 피부 상태"
              subTitle="전체적으로 좋아졌어요!"
            />
          </View>

          {/* 리스트 */}
          <View className="mt-5 w-full">
            <StatItem />
            <StatItem />
            <StatItem />
            <StatItem />
            <StatItem />
            <StatItem />
            <StatItem />
          </View>
        </View>
      </GradientScreenLayout>
    </View>
  );
}
