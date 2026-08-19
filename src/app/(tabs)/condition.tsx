import { getApiErrorMessage } from "@/apis";
import { getConditions } from "@/apis/condition";
import TitleSection from "@/components/onboarding/title-section";
import GradientScreenLayout from "@/components/shared/gradient-screen-layout";
import LoadingScreen from "@/components/shared/loading";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/label";
import { useProfileStore } from "@/stores/useProfileStore";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";

const ConditionBox = ({ feedback }: { feedback: string[] }) => {
  return (
    <View className="bg-white rounded-[22px] border w-full mt-3 border-primary-440 shadow-[0_2px_4px_rgba(0,0,0,0.08)] py-5 px-7">
      <Label text="오늘의 컨디션" bg="bg-[#298DFF]" />

      <View className="gap-4 mt-5">
        {feedback.map((item) => (
          <CheckItem key={item} text={item} />
        ))}
      </View>
    </View>
  );
};

const CheckItem = ({ text }: { text: string }) => {
  return (
    <View className="flex-row items-center gap-2">
      <Image
        source={require("../../../assets/images/condition/check.png")}
        className="w-7 h-7 shrink-0"
        resizeMode="contain"
      />
      <View className="min-w-0 flex-1 min-h-9.5 justify-center">
        <Text className="text-[12px] font-medium text-black whitespace-pre-wrap">
          {text}
        </Text>
      </View>
    </View>
  );
};

export default function ConditionScreen() {
  const isReady = useProfileStore((state) => state.isUserIdInitialized);
  const conditionQuery = useQuery({
    queryKey: ["condition", "latest"],
    queryFn: getConditions,
    enabled: isReady,
  });
  const hasCondition = Boolean(conditionQuery.data);

  if (!isReady || conditionQuery.isLoading) {
    return (
      <View className="flex-1 px-8 pt-16">
        <LoadingScreen
          title="컨디션을 확인하고 있어요."
          subTitle="오늘 기록한 몸 상태를 분석하고 있어요."
          text="컨디션 결과를 불러오는 중이에요."
        />
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center">
      <GradientScreenLayout offsetY={120} edges={["left", "right"]}>
        <ScrollView
          className="flex-1 w-full"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-between",
            paddingHorizontal: 32,
            paddingVertical: 64,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full">
            <Text className="text-[16px] font-semibold text-black w-full text-center">
              내 컨디션
            </Text>
            <View className="mt-3 gap-3">
              <View>
                <TitleSection
                  title={
                    conditionQuery.data?.conditionTitle ??
                    "오늘의 컨디션을 확인해 보세요!"
                  }
                  subTitle={
                    conditionQuery.data?.conditionDate ??
                    "아직 저장된 컨디션이 없어요."
                  }
                />
              </View>
              {conditionQuery.isError ? (
                <Text className="mt-6 text-center text-error">
                  {getApiErrorMessage(
                    conditionQuery.error,
                    "컨디션을 불러오지 못했습니다.",
                  )}
                </Text>
              ) : conditionQuery.data ? (
                <ConditionBox
                  feedback={conditionQuery.data.conditionFeedback}
                />
              ) : null}
            </View>
          </View>
          <Button
            onPress={() =>
              hasCondition
                ? router.navigate("/(tabs)/mission")
                : router.push("/condition-check")
            }
          >
            {hasCondition ? "미션 받기" : "컨디션 확인하기"}
          </Button>
        </ScrollView>
      </GradientScreenLayout>
    </View>
  );
}
