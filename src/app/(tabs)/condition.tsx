import TitleSection from "@/components/onboarding/title-section";
import GradientScreenLayout from "@/components/shared/gradient-screen-layout";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/label";
import { router } from "expo-router";
import { Image, Text, View } from "react-native";

const ConditionBox = () => {
  return (
    <View className="bg-white rounded-[22px] border w-full mt-3 border-primary-440 shadow-[0_2px_4px_rgba(0,0,0,0.08)] py-5 px-7">
      <Label text="오늘의 컨디션" bg="bg-[#298DFF]" />

      <View className="gap-4 mt-5">
        <CheckItem />
        <CheckItem />
        <CheckItem />
      </View>
    </View>
  );
};

const CheckItem = () => {
  return (
    <View className="flex flex-row items-center">
      <Image
        source={require("../../../assets/images/condition/check.png")}
        className="*w-7 h-7"
        resizeMode="contain"
      />
      <View className="h-9.5 w-67.5 justify-center">
        <Text className="text-[12px] font-medium text-black whitespace-pre-wrap">
          수면 h시간 mm분, 충분
        </Text>
      </View>
    </View>
  );
};

export default function ConditionScreen() {
  return (
    <View className="flex-1 justify-center">
      <GradientScreenLayout offsetY={120} edges={["left", "right"]}>
        <View className="items-start justify-between flex-1 py-16 w-full px-8">
          <View className="w-full">
            <Text className="text-[16px] font-semibold text-black w-full text-center">
              내 컨디션
            </Text>
            <View className="mt-3 gap-3">
              <View>
                <TitleSection
                  title="오늘의 컨디션이에요!"
                  subTitle="어제의 내 컨디션이에요."
                />
              </View>
              <ConditionBox />
            </View>
          </View>
          <Button onPress={() => router.push("/condition-check")}>
            컨디션 확인하기
          </Button>
        </View>
      </GradientScreenLayout>
    </View>
  );
}
