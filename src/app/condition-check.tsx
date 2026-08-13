import TitleSection from "@/components/onboarding/title-section";
import GradientScreenLayout from "@/components/shared/gradient-screen-layout";
import Button from "@/components/ui/Button";
import OptionCard from "@/components/ui/option-card";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

type checkType = "body" | "sleep";

const CHECK_DATA = {
  body: {
    title: "지금 00님의 몸상태는 어떤가요?",
    subTitle: "미션 부여 전에 몸상태를 확인할게요.",
    list: ["완전 방전이에요.", "적당히 지쳤어요.", "좋아요. 에너지가 넘쳐요!"],
  },
  sleep: {
    title: "어젯밤 수면은 충분하셨나요?",
    subTitle: "충분한 수면은 몸 컨디션 유지에 좋습니다.",
    list: [
      "푹 자서 개운해요. (7시간 이상)",
      "그럭저럭 잤어요. (7시간 이하)",
      "자꾸 뒤척이거나 부족했어요. (수면 부족)",
    ],
  },
} as const;

export default function ConditionCheckScreen() {
  const [step, setStep] = useState<checkType>("body");

  return (
    <View className="flex-1 justify-between">
      <GradientScreenLayout offsetY={120} edges={["left", "right", "bottom"]}>
        <View className="items-start justify-start flex-1 py-16 w-full px-8">
          <View className="flex flex-row items-center">
            <Pressable
              onPress={() => router.back()}
              className="h-10 w-10 -ml-3"
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="뒤로 가기"
            >
              <Image
                source={require("../../assets/images/shared/prev.png")}
                className="h-full w-full"
              />
            </Pressable>
            <Text className="text-[16px] font-semibold text-black ml-32">
              내 컨디션
            </Text>
          </View>
          <View className="mt-3 w-full justify-between flex-1">
            <View>
              <TitleSection
                title={CHECK_DATA[step].title}
                subTitle={CHECK_DATA[step].subTitle}
              />

              <View className="gap-9 mt-7">
                {CHECK_DATA[step].list.map((item) => (
                  <OptionCard py="py-6" content={item} />
                ))}
              </View>
            </View>

            <View>
              <Button
                onPress={() => {
                  if (step === "body") setStep("sleep");
                  else router.push("/shared/body-check");
                }}
              >
                다음
              </Button>
            </View>
          </View>
        </View>
      </GradientScreenLayout>
    </View>
  );
}
