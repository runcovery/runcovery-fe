import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Button from "../../../components/ui/Button";
import TitleSection from "../title-section";
import FormInputField from "./form-input-field";
import PreviewCard from "./preview-card";

export default function GoalAdjustScreen({ onNext }: { onNext: () => void }) {
  const [goalDetails, setGoalDetails] = useState({
    distance: "",
    duration: "",
    weeklyCount: "",
    availableTime: "",
  });

  const handleChange = (field: keyof typeof goalDetails, value: string) => {
    setGoalDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 justify-between gap-6">
        <View>
          <View className="mt-3">
            <TitleSection
              title="00님의 목표를 설정했어요."
              subTitle="선택한 장면에 맞는 목표를 찾았어요."
            />
          </View>
          <View className="mt-5">
            <PreviewCard />
          </View>
          <View className="mt-5">
            <Text className="text-[16px] font-semibold text-black">
              목표 조정이 가능해요
            </Text>
            <View className="gap-3 mt-3">
              <FormInputField
                label="목표 거리"
                placeholder="크루와 나란히 달리며 쳐지지 않는 나"
                value={goalDetails.distance}
                onChangeText={(value) => handleChange("distance", value)}
              />
              <FormInputField
                label="목표 기간"
                placeholder="크루와 나란히 달리며 쳐지지 않는 나"
                value={goalDetails.duration}
                onChangeText={(value) => handleChange("duration", value)}
              />
              <FormInputField
                label="주 목표 횟수"
                placeholder="크루와 나란히 달리며 쳐지지 않는 나"
                value={goalDetails.weeklyCount}
                onChangeText={(value) => handleChange("weeklyCount", value)}
              />
              <FormInputField
                label="가능한 시간"
                placeholder="크루와 나란히 달리며 쳐지지 않는 나"
                value={goalDetails.availableTime}
                onChangeText={(value) => handleChange("availableTime", value)}
              />
            </View>
          </View>
        </View>
        <View className="mt-7">
          <Button onPress={onNext}>다음</Button>
        </View>
      </View>
    </ScrollView>
  );
}
