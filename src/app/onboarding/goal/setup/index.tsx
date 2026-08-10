import TitleSection from "@/components/onboarding/title-section";
import GradientScreenLayout from "@/components/shared/gradient-screen-layout";
import Button from "@/components/ui/Button";
import { router } from "expo-router";
import { Image, View } from "react-native";

export default function GoalSetupScreen() {
  return (
    <View className="justify-center flex-1 px-8">
      <GradientScreenLayout offsetY={120}>
        <View className="items-start justify-between flex-1 py-16 w-full">
          {/* 타이틀 */}
          <TitleSection
            title={
              "나의 정보는 입력 완료했어요. \n이제 목표 설정하러 가볼까요?"
            }
            subTitle={
              "오늘의 컨디션을 분석하고, 러닝부터 회복까지 \n관리해보세요!"
            }
          />
          {/* 센터 캐릭터 */}
          <View className=" items-center w-full">
            <Image
              source={require("../../../../../assets/images/character/goal-pink-cat.png")}
              className="w-47.75 h-51"
            />
          </View>

          {/* 버튼 */}
          <View className="flex-row gap-6 justify-center items-center ">
            <View className="flex-1">
              <Button isWhite={true} onPress={() => router.navigate("/home")}>
                다음에 입력하기
              </Button>
            </View>
            <View className="flex-1">
              <Button onPress={() => router.push("/onboarding/goal/detail")}>
                목표 설정하기
              </Button>
            </View>
          </View>
        </View>
      </GradientScreenLayout>
    </View>
  );
}
