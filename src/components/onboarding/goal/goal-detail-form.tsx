import Button from "@/components/ui/Button";
import { useProfileStore } from "@/stores/useProfileStore";
import type { GoalPlanPayload } from "@/types/goal";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import TitleSection from "../title-section";
import FormInputField from "./form-input-field";

export default function GoalDetailFormScreen({
  isLoading,
  onChange,
  onNext,
}: {
  isLoading: boolean;
  onChange: (goalPlan: GoalPlanPayload) => void;
  onNext: () => void;
}) {
  const [goalDetails, setGoalDetails] = useState({
    distance: "",
    duration: "",
    weeklyCount: "",
    availableTime: "",
  });
  const nickname = useProfileStore((state) => state.profile.nickname);

  const handleChange = (field: keyof typeof goalDetails, value: string) => {
    const next = {
      ...goalDetails,
      [field]: value,
    };

    setGoalDetails(next);
    onChange({
      targetDistance: Number(next.distance),
      targetPeriod: Number(next.duration),
      weeklyFrequency: Number(next.weeklyCount),
      availableTime: Number(next.availableTime),
    });
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 justify-between gap-7">
        <View>
          {/* 타이틀 */}
          <View className="mt-3">
            <TitleSection
              title="목표를 입력해 주세요."
              subTitle={`${nickname}님이 목표를 직접 설정해 주세요!`}
            />
          </View>

          {/* 리스트 */}
          <View className="mt-5 gap-6">
            <FormInputField
              label="목표 거리"
              placeholder="크루와 나란히 달리며 쳐지지 않는 나"
              value={goalDetails.distance}
              onChangeText={(value) => handleChange("distance", value)}
              keyboardType="decimal-pad"
              suffix="km"
            />
            <FormInputField
              label="목표 기간"
              placeholder="크루와 나란히 달리며 쳐지지 않는 나"
              value={goalDetails.duration}
              onChangeText={(value) => handleChange("duration", value)}
              keyboardType="number-pad"
              suffix="개월"
            />
            <FormInputField
              label="주 목표 횟수"
              placeholder="크루와 나란히 달리며 쳐지지 않는 나"
              value={goalDetails.weeklyCount}
              onChangeText={(value) => handleChange("weeklyCount", value)}
              keyboardType="number-pad"
              prefix="주 "
              suffix="회"
            />
            <FormInputField
              label="가능한 시간"
              placeholder="크루와 나란히 달리며 쳐지지 않는 나"
              value={goalDetails.availableTime}
              onChangeText={(value) => handleChange("availableTime", value)}
              keyboardType="number-pad"
              suffix="분"
            />
          </View>
        </View>

        {/* 버튼 */}
        <Button isLoading={isLoading} onPress={onNext}>다음</Button>
      </View>
    </ScrollView>
  );
}
