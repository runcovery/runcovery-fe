import { useEffect, useRef, useState } from "react";
import { useProfileStore } from "@/stores/useProfileStore";
import type {
  GoalPayload,
  GoalPlanPayload,
  RecommendedScene,
} from "@/types/goal";
import type { FocusEvent } from "react-native";
import {
  Keyboard,
  ScrollView,
  Text,
  View,
} from "react-native";
import Button from "../../../components/ui/Button";
import TitleSection from "../title-section";
import FormInputField from "./form-input-field";
import PreviewCard from "./preview-card";

export default function GoalAdjustScreen({
  goal,
  onChange,
  onNext,
  scene,
}: {
  goal: GoalPayload;
  onChange: (goalPlan: GoalPlanPayload) => void;
  onNext: () => void;
  scene: RecommendedScene | null;
}) {
  const scrollViewRef = useRef<ScrollView>(null);
  const focusedInputHandleRef = useRef<number | null>(null);
  const [goalDetails, setGoalDetails] = useState({
    distance: goal.targetDistance ? String(goal.targetDistance) : "",
    duration: goal.targetPeriod ? String(goal.targetPeriod) : "",
    weeklyCount: goal.weeklyFrequency ? String(goal.weeklyFrequency) : "",
    availableTime: goal.availableTime ? String(goal.availableTime) : "",
  });
  const nickname = useProfileStore((state) => state.profile.nickname);

  const scrollInputAboveKeyboard = (nodeHandle: number) => {
    setTimeout(() => {
      scrollViewRef.current?.scrollResponderScrollNativeHandleToKeyboard(
        nodeHandle,
        120,
        true,
      );
    }, 100);
  };

  const handleInputFocus = (event: FocusEvent) => {
    const nodeHandle = event.nativeEvent.target;
    focusedInputHandleRef.current = nodeHandle;
    scrollInputAboveKeyboard(nodeHandle);
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      const nodeHandle = focusedInputHandleRef.current;

      if (nodeHandle !== null) {
        scrollInputAboveKeyboard(nodeHandle);
      }
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      focusedInputHandleRef.current = null;
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

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
      ref={scrollViewRef}
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 160 }}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 justify-between gap-6">
        <View>
          {/* 타이틀 */}
          <View className="mt-3">
            <TitleSection
              title={`${nickname}님의 목표를 설정했어요.`}
              subTitle="선택한 장면에 맞는 목표를 찾았어요."
            />
          </View>

          {/* 카드 프리뷰 */}
          <View className="mt-5">
            <PreviewCard scene={scene} />
          </View>

          {/* 리스트 폼 */}
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
                keyboardType="decimal-pad"
                suffix="km"
                onFocus={handleInputFocus}
              />
              <FormInputField
                label="목표 기간"
                placeholder="크루와 나란히 달리며 쳐지지 않는 나"
                value={goalDetails.duration}
                onChangeText={(value) => handleChange("duration", value)}
                keyboardType="number-pad"
                suffix="개월"
                onFocus={handleInputFocus}
              />
              <FormInputField
                label="주 목표 횟수"
                placeholder="크루와 나란히 달리며 쳐지지 않는 나"
                value={goalDetails.weeklyCount}
                onChangeText={(value) => handleChange("weeklyCount", value)}
                keyboardType="number-pad"
                prefix="주 "
                suffix="회"
                onFocus={handleInputFocus}
              />
              <FormInputField
                label="가능한 시간"
                placeholder="크루와 나란히 달리며 쳐지지 않는 나"
                value={goalDetails.availableTime}
                onChangeText={(value) => handleChange("availableTime", value)}
                keyboardType="number-pad"
                suffix="분"
                onFocus={handleInputFocus}
              />
            </View>
          </View>
        </View>

        {/* 버튼 */}
        <View className="mt-7">
          <Button onPress={onNext}>다음</Button>
        </View>
      </View>
    </ScrollView>
  );
}
