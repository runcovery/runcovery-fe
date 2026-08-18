import { ScrollView, Text, View } from "react-native";
import { useProfileStore } from "@/stores/useProfileStore";
import TitleSection from "../onboarding/title-section";
import Button from "../ui/Button";
import WeatherPreviewCard from "./weather-preview-card";

interface MetricInterface {
  label: string;
  value: string;
}

const GOAL_METRICS: MetricInterface[] = [
  { label: "총 거리", value: "5km" },
  { label: "러닝 시간", value: "30분" },
  { label: "평균 페이스", value: "6'00\"/km" },
  { label: "평균 케이던스", value: "165spm" },
];

const MetricCard = ({ label, value }: MetricInterface) => {
  return (
    <View className="rounded-[18px] border border-neutral-100 bg-white py-4 pl-6 gap-2">
      <Text className="text-[16px] font-semibold text-black">{label}</Text>
      <Text
        className="text-[30px] font-semibold text-primary-500"
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
      >
        {value}
      </Text>
    </View>
  );
};

export default function ManageSummaryScreen({
  onNext,
}: {
  onNext: () => void;
}) {
  const nickname = useProfileStore((state) => state.profile.nickname);

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
      showsVerticalScrollIndicator={false}
    >
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
          <WeatherPreviewCard />
        </View>

        {/* 세부 목표 리스트 */}
        <View className="mt-8 flex-row flex-wrap gap-4">
          {GOAL_METRICS.map((item) => (
            <View key={item.label} className="min-w-30 flex-1 basis-[45%]">
              <MetricCard label={item.label} value={item.value} />
            </View>
          ))}
        </View>
      </View>

      {/* 버튼 */}
      <View className="w-full gap-4">
        <Button onPress={onNext}>웰니스 리포트 받기</Button>
        <Button isWhite={true} onPress={onNext}>
          기록 동기화
        </Button>
      </View>
    </ScrollView>
  );
}
