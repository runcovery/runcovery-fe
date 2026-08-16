import { BodyCheckStep, BodyPartId } from "@/components/body-check";
import TitleSection from "@/components/onboarding/title-section";
import StepScreenLayout from "@/components/shared/step-screen-layout";
import Button from "@/components/ui/Button";
import OptionCard from "@/components/ui/option-card";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import LoadingScreen from "../components/shared/loading";

type StepType = "body" | "sleep" | "pain" | "loading";

const CHECK_DATA = {
  body: {
    title: "지금 00님의 몸 상태는 어떤가요?",
    subTitle: "미션 부여 전에 몸 상태를 확인할게요.",
    list: [
      { id: 1, content: "완전 방전이에요." },
      { id: 2, content: "적당히 지쳤어요." },
      { id: 3, content: "좋아요. 에너지가 넘쳐요!" },
    ],
  },
  sleep: {
    title: "어젯밤 수면은 충분하셨나요?",
    subTitle: "충분한 수면은 몸 컨디션 유지에 좋습니다.",
    list: [
      { id: 1, content: "푹 자서 개운해요. (7시간 이상)" },
      { id: 2, content: "그럭저럭 잤어요. (7시간 이하)" },
      { id: 3, content: "자꾸 뒤척이거나 부족했어요. (수면 부족)" },
    ],
  },
} as const;

export default function ConditionCheckScreen() {
  const [step, setStep] = useState<StepType>("body");
  const [selectedBodyParts, setSelectedBodyParts] = useState<BodyPartId[]>([]);

  const isCheck = step !== "pain" && step !== "loading";

  const handleBodyCheckNext = (parts: BodyPartId[]) => {
    setSelectedBodyParts(parts);
    setStep("loading");
  };

  return (
    <View className="flex-1">
      <StepScreenLayout
        title="내 컨디션"
        edges={["left", "right", "bottom"]}
      >
        {isCheck && (
          <ScrollView
            className="mt-3 w-full flex-1"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "space-between",
            }}
            showsVerticalScrollIndicator={false}
          >
            <View>
              <TitleSection
                title={CHECK_DATA[step].title}
                subTitle={CHECK_DATA[step].subTitle}
              />

              <View className="gap-9 mt-7">
                {CHECK_DATA[step].list.map((item) => (
                  <OptionCard
                    key={item.id}
                    py="py-6"
                    content={item.content}
                  />
                ))}
              </View>
            </View>

            <View>
              <Button
                onPress={() => {
                  if (step === "body") setStep("sleep");
                  else setStep("pain");
                }}
              >
                다음
              </Button>
            </View>
          </ScrollView>
        )}
        {step === "pain" && (
          <BodyCheckStep
            selectedParts={selectedBodyParts}
            onChange={setSelectedBodyParts}
            onNext={handleBodyCheckNext}
          />
        )}
        {step === "loading" && (
          <LoadingScreen
            title="컨디션을 분석하고 있어요."
            subTitle="잠시만 기다려주시면 맞춤 리포트가 완성돼요."
            text="건강 데이터를 수집하는 중.."
          />
        )}
      </StepScreenLayout>
    </View>
  );
}
