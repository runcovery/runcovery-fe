import SelectCard from "@/components/onboarding/select-card";
import TitleSection from "@/components/onboarding/title-section";
import StepScreenLayout from "@/components/shared/step-screen-layout";
import Button from "@/components/ui/Button";
import { useOnboardingRegistration } from "@/hooks/onboarding/useOnboardingRegistration";
import { useProfileStore } from "@/stores/useProfileStore";
import { CardData } from "@/types/onboarding/cardData";
import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";

const RUNNING_DATA: CardData[] = [
  {
    id: 1,
    title: "거의 안 해봤어요.",
    content: "한 번도 뛰어본 적이 없거나 \n한두 번 뛰어본 정도예요.",
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
  const { errorMessage, isSubmitting, profile, registerUser } =
    useOnboardingRegistration();
  const setProfileField = useProfileStore((state) => state.setProfileField);
  const { nickname, runningExperience } = profile;

  const handleNext = async () => {
    const isRegistered = await registerUser();

    if (isRegistered) {
      router.push("/onboarding/goal/setup");
    }
  };

  return (
    <View className="flex-1">
      <StepScreenLayout>
        <ScrollView
          className="flex-1 w-full"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-start justify-center flex-1 w-full">
            {/* 타이틀 */}
            <View className="items-start w-full mt-3">
              <TitleSection
                title={`${nickname}님에 대해서 자세히 알아볼게요!`}
                subTitle="러닝을 얼마나 해보셨나요?"
              />
            </View>

            {/* 리스트 */}
            <View className="gap-4 w-full mt-5">
              {RUNNING_DATA.map((item) => (
                <SelectCard
                  key={item.id}
                  item={item}
                  onPress={() =>
                    setProfileField(
                      "runningExperience",
                      runningExperience === item.title ? "" : item.title,
                    )
                  }
                  selected={runningExperience === item.title}
                />
              ))}
            </View>

            {/* 버튼 */}
            <View className="w-full mt-7">
              {errorMessage ? (
                <Text className="mb-3 text-center text-error">{errorMessage}</Text>
              ) : null}
              <Button
                disabled={!runningExperience}
                isLoading={isSubmitting}
                onPress={handleNext}
              >
                다음
              </Button>
            </View>
          </View>
        </ScrollView>
      </StepScreenLayout>
    </View>
  );
}
