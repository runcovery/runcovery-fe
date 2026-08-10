import TitleSection from "@/components/onboarding/title-section";
import GradientScreenLayout from "@/components/shared/gradient-screen-layout";
import Button from "@/components/ui/Button";
import { Image, Text, View } from "react-native";

const ConditionBox = () => {
  return (
    <View className="bg-white rounded-[22px] border w-full mt-3 border-primary-440 shadow-[0_2px_4px_rgba(0,0,0,0.08)] py-5 px-7">
      <View className="bg-[#298DFF] rounded-lg w-20 py-1 items-center justify-center">
        <Text className="text-[10px] font-semibold text-white">
          오늘의 컨디션
        </Text>
      </View>
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
      <Text className="text-[12px] font-medium text-black h-9 w-67.5 justify-center whitespace-pre-wrap">
        수면 h시간 mm분, 충분
      </Text>
    </View>
  );
};

export default function ConditionScreen() {
  return (
    <View className="flex-1 justify-center">
      <GradientScreenLayout offsetY={120}>
        <Text className="text-[16px]  font-semibold text-black w-full text-center">
          내 컨디션
        </Text>
        <View className="items-start justify-between flex-1 py-16 w-full px-8">
          <View>
            <View>
              <TitleSection
                title="오늘의 컨디션이에요!"
                subTitle="어제의 내 컨디션이에요."
              />
            </View>
            <ConditionBox />
          </View>
          <Button>컨디션 확인하기</Button>
        </View>
      </GradientScreenLayout>
    </View>
  );
}
