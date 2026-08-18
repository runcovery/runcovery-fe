import { FlatList, Text, View } from "react-native";
import { useProfileStore } from "@/stores/useProfileStore";
import type { GoalPlanPayload, RecommendedScene } from "@/types/goal";
import Button from "../../../components/ui/Button";
import TitleSection from "../title-section";
import PreviewCard from "./preview-card";

interface MetricInterface {
  label: string;
  value: string;
}

const MetricCard = ({ label, value }: MetricInterface) => {
  return (
    <View className="rounded-[18px] border border-neutral-100 bg-white py-4 pl-6 gap-2">
      <Text className="text-[16px] font-semibold text-black">{label}</Text>
      <Text className="text-[30px] font-semibold text-primary-500">
        {value}
      </Text>
    </View>
  );
};

export default function GoalSummaryScreen({
  disabled,
  goal,
  onSubmit,
  scene,
}: {
  disabled: boolean;
  goal: GoalPlanPayload;
  onSubmit: () => void;
  scene: RecommendedScene | null;
}) {
  const nickname = useProfileStore((state) => state.profile.nickname);
  const goalMetrics: MetricInterface[] = [
    { label: "최종 목표 거리", value: `${goal.targetDistance}km` },
    { label: "기간", value: `${goal.targetPeriod}개월` },
    {
      label: "최종 주간 목표 횟수",
      value: `${goal.weeklyFrequency}회`,
    },
    { label: "시간", value: `${goal.availableTime}분` },
  ];

  return (
    <View className="flex-1 justify-between">
      <View>
        {/* 타이틀 */}
        <View className="mt-3">
          <TitleSection
            title={`${nickname}님의 미래가 설계되었어요.`}
            subTitle="선택한 장면에 맞는 미래를 설계했어요."
          />
        </View>

        {/* 카드 프리뷰 */}
        <View className="mt-5">
          <PreviewCard scene={scene} />
        </View>

        {/* 세부 목표 리스트 */}
        <FlatList
          className="mt-8"
          data={goalMetrics}
          numColumns={2}
          scrollEnabled={false}
          keyExtractor={(item) => item.label}
          columnWrapperStyle={{ gap: 16 }}
          contentContainerStyle={{ gap: 16 }}
          renderItem={({ item }) => (
            <View className="flex-1">
              <MetricCard label={item.label} value={item.value} />
            </View>
          )}
        />
      </View>

      {/* 버튼 */}
      <Button disabled={disabled} onPress={onSubmit}>시작하기</Button>
    </View>
  );
}
