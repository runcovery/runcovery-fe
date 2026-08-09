import GradientBackground from "@/components/gradient-background";
import SelectCard from "@/components/onboarding/select-card";
import TitleSection from "@/components/onboarding/title-section";
import Button from "@/components/ui/Button";
import { CardData } from "@/types/onboarding/cardData";
import { router } from "expo-router";
import { styled } from "nativewind";
import { useState } from "react";
import { Image, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const StyledSafeAreaView = styled(SafeAreaView);

const RUNNING_DATA: CardData[] = [
  {
    id: 1,
    title: "거의 안해봤어요.",
    content: "한 번도 뛰어본 적이 없거나 \n한두 번 뛰어본 정도에요.",
  },
  {
    id: 2,
    title: "뛰다가 오래 쉬었어요.",
    content: "예전에는 뛰었지만 \n지금은 쉬고 있어요.",
  },
  {
    id: 3,
    title: "가끔 뛰고 있어요.",
    content: "꾸준하진 않지만 \n종종 달리고 있어요.",
  },
  {
    id: 4,
    title: "꾸준히 뛰고 있어요.",
    content: "정기적으로 자주 러닝을 하고 \n있어요.",
  },
];

export default function RunningExperienceScreen() {
  const [selectedId, setSelectedId] = useState(0);

  return (
    <View className="justify-center flex-1 px-8">
      <GradientBackground offsetY={120} />
      <StyledSafeAreaView className="flex-1">
        <View className="items-start justify-center flex-1 py-16 w-full">
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 -ml-3"
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="뒤로 가기"
          >
            <Image
              source={require("../../../../assets/images/shared/prev.png")}
              className="h-full w-full"
            />
          </Pressable>
          <View className="items-start w-full mt-3">
            <TitleSection
              title={"00님에 대해서 자세히 알아볼게요!"}
              subTitle="러닝을 얼마나 해보셨나요?"
            />
          </View>
          <View className="gap-4 w-full mt-5">
            {RUNNING_DATA.map((item) => (
              <SelectCard
                key={item.id}
                item={item}
                onPress={() =>
                  setSelectedId(selectedId === item.id ? 0 : item.id)
                }
                selected={selectedId === item.id}
              />
            ))}
          </View>
          <View className="w-full mt-7">
            <Button onPress={() => router.push("/onboarding/goal/setup")}>
              다음
            </Button>
          </View>
        </View>
      </StyledSafeAreaView>
    </View>
  );
}
