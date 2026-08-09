import Button from "@/components/ui/Button";
import { useState } from "react";
import { View } from "react-native";
import TitleSection from "../title-section";
import FormInputField from "./form-input-field";

export default function GoalDetailFormScreen({
  onNext,
}: {
  onNext: () => void;
}) {
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
    <View className="flex-1 justify-between">
      <View>
        <View className="mt-3">
          <TitleSection
            title="목표를 입력주세요."
            subTitle="00님이 목표를 집적 설정해주세요!"
          />
        </View>
        <View className="mt-5 gap-6">
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
      <Button onPress={onNext}>다음</Button>
    </View>
  );
}
