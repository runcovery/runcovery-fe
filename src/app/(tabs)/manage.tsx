// import BodyCheckScreen from "@/components/manage/body-check";
// import ComparisonResultScreen from "@/components/manage/comparison-result";
// import SkinAnalysisScreen from "@/components/manage/skin-analysis";
import CareCheckStepScreen from "@/components/manage/care-check-step";
import GradientScreenLayout from "@/components/shared/gradient-screen-layout";
import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

export default function ManageScreen() {
  return (
    <View className="flex-1 justify-between">
      <GradientScreenLayout offsetY={120} edges={["left", "right"]}>
        <View className="items-start justify-start flex-1 py-16 w-full px-8">
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
              {/* 사후 관리 운동 후 */}
            </Text>
          </View>

          <CareCheckStepScreen />
          {/* <BodyCheckScreen /> */}
          {/* <SkinAnalysisScreen /> */}
          {/* <ComparisonResultScreen /> */}
        </View>
      </GradientScreenLayout>
    </View>
  );
}
