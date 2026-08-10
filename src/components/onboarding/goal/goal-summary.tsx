import { router } from "expo-router";
import { FlatList, Text, View } from "react-native";
import Button from "../../../components/ui/Button";
import TitleSection from "../title-section";
import PreviewCard from "./preview-card";

interface MetricInterface {
  label: string;
  value: string;
}

const GOAL_METRICS: MetricInterface[] = [
  { label: "최종 목표 거리", value: "5km" },
  { label: "기간", value: "3개월" },
  { label: "최종 주간 목표 횟수", value: "2회" },
  { label: "시간", value: "15분" },
];

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

export default function GoalSummaryScreen() {
  return (
    <View className="flex-1 justify-between">
      <View>
        <View className="mt-3">
          <TitleSection
            title="00님의 미래가 설계되었어요."
            subTitle="선택한 장면에 맞는 미래를 설계했어요."
          />
        </View>
        <View className="mt-5">
          <PreviewCard />
        </View>
        <FlatList
          className="mt-8"
          data={GOAL_METRICS}
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
      <Button onPress={() => router.navigate("/home")}>시작하기</Button>
    </View>
  );
}
