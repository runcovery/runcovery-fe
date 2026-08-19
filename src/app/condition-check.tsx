import { BodyCheckStep, BodyPartId } from "@/components/body-check";
import TitleSection from "@/components/onboarding/title-section";
import StepScreenLayout from "@/components/shared/step-screen-layout";
import Button from "@/components/ui/Button";
import OptionCard from "@/components/ui/option-card";
import { useProfileStore } from "@/stores/useProfileStore";
import { useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import LoadingScreen from "../components/shared/loading";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { analyzeCondition } from "@/apis/condition";
import { getApiErrorMessage } from "@/apis";
import type { BodyCondition, SleepQuality } from "@/types/condition";
import { router } from "expo-router";

type StepType = "body" | "sleep" | "pain" | "loading";

const getCheckData = (nickname: string) => ({
  body: {
    title: `지금 ${nickname}님의 몸 상태는 어떤가요?`,
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
}) as const;

export default function ConditionCheckScreen() {
  const [step, setStep] = useState<StepType>("body");
  const [selectedBodyParts, setSelectedBodyParts] = useState<BodyPartId[]>([]);
  const [bodyCondition, setBodyCondition] = useState<BodyCondition | null>(null);
  const [sleepQuality, setSleepQuality] = useState<SleepQuality | null>(null);
  const nickname = useProfileStore((state) => state.profile.nickname);
  const queryClient = useQueryClient();
  const submitLockRef = useRef(false);
  const shouldHandleMutationResultRef = useRef(true);
  const checkData = getCheckData(nickname);

  const conditionMutation = useMutation({
    mutationFn: analyzeCondition,
    onSuccess: (condition) => {
      queryClient.setQueryData(["condition", "latest"], condition);
      void queryClient.invalidateQueries({ queryKey: ["mission"] });
      void queryClient.invalidateQueries({ queryKey: ["user", "mypage"] });
      if (!shouldHandleMutationResultRef.current) return;
      router.replace("/(tabs)/condition");
    },
    onSettled: () => {
      submitLockRef.current = false;
    },
  });

  const isCheck = step !== "pain" && step !== "loading";

  const handleBodyCheckNext = (parts: BodyPartId[]) => {
    if (!bodyCondition || !sleepQuality || submitLockRef.current) return;

    submitLockRef.current = true;
    shouldHandleMutationResultRef.current = true;
    setSelectedBodyParts(parts);
    setStep("loading");
    conditionMutation.mutate({
      bodyCondition,
      sleepQuality,
      painAreas: parts,
    });
  };

  const selectedValue = step === "body" ? bodyCondition : sleepQuality;
  const selectValue = (id: number) => {
    if (step === "body") {
      setBodyCondition(({ 1: "EXHAUSTED", 2: "FAIR", 3: "GOOD" } as const)[id as 1 | 2 | 3]);
    } else {
      setSleepQuality(({ 1: "GOOD", 2: "FAIR", 3: "POOR" } as const)[id as 1 | 2 | 3]);
    }
  };

  const handleBack = () => {
    if (step === "body") {
      router.back();
      return;
    }

    if (step === "loading") {
      shouldHandleMutationResultRef.current = false;
      setStep("pain");
      return;
    }

    setStep(step === "pain" ? "sleep" : "body");
  };

  return (
    <View className="flex-1">
      <StepScreenLayout
        title="내 컨디션"
        onBack={handleBack}
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
                title={checkData[step].title}
                subTitle={checkData[step].subTitle}
              />

              <View className="gap-9 mt-7">
                {checkData[step].list.map((item) => (
                  <OptionCard
                    key={item.id}
                    py="py-6"
                    content={item.content}
                    selected={selectedValue === (step === "body"
                      ? ({ 1: "EXHAUSTED", 2: "FAIR", 3: "GOOD" } as const)[item.id]
                      : ({ 1: "GOOD", 2: "FAIR", 3: "POOR" } as const)[item.id])}
                    onPress={() => selectValue(item.id)}
                  />
                ))}
              </View>
            </View>

            <View>
              <Button
                disabled={!selectedValue}
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
            error={conditionMutation.isError ? getApiErrorMessage(conditionMutation.error, "컨디션을 저장하지 못했습니다.") : null}
            onRetry={() => handleBodyCheckNext(selectedBodyParts)}
          />
        )}
      </StepScreenLayout>
    </View>
  );
}
