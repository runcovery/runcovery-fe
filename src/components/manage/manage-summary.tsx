import { ScrollView, Text, View } from "react-native";
import { useProfileStore } from "@/stores/useProfileStore";
import TitleSection from "../onboarding/title-section";
import Button from "../ui/Button";
import WeatherPreviewCard from "./weather-preview-card";
import type { ReportPreview } from "@/types/wellness";

interface MetricInterface {
  label: string;
  value: string;
}

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
  onSync,
  preview,
  isSyncing,
  syncError,
}: {
  onNext: () => void;
  onSync: () => void;
  preview: ReportPreview;
  isSyncing: boolean;
  syncError?: string | null;
}) {
  const nickname = useProfileStore((state) => state.profile.nickname);
  const minutes = Math.floor(preview.activity.runningDuration / 60);
  const paceMinutes = Math.floor(preview.activity.avgPace / 60);
  const paceSeconds = String(preview.activity.avgPace % 60).padStart(2, "0");
  const goalMetrics: MetricInterface[] = [
    { label: "총 거리", value: `${(preview.activity.distanceM / 1000).toFixed(2)}km` },
    { label: "러닝 시간", value: `${minutes}분` },
    { label: "평균 페이스", value: `${paceMinutes}'${paceSeconds}\"/km` },
    { label: "평균 케이던스", value: `${preview.activity.cadence}spm` },
  ];

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
            title={`${preview.nickname || nickname}님의 러닝 기록이에요.`}
            subTitle={`${preview.recordDate} 기록과 당시 날씨를 확인해 주세요.`}
          />
        </View>

        {/* 카드 프리뷰 */}
        <View className="mt-5">
          <WeatherPreviewCard weather={preview.weather} />
        </View>

        {/* 세부 목표 리스트 */}
        <View className="mt-8 flex-row flex-wrap gap-4">
          {goalMetrics.map((item) => (
            <View key={item.label} className="min-w-30 flex-1 basis-[45%]">
              <MetricCard label={item.label} value={item.value} />
            </View>
          ))}
        </View>
      </View>

      {/* 버튼 */}
      <View className="w-full gap-4">
        {syncError ? (
          <Text className="text-center text-[12px] text-error">
            {syncError}
          </Text>
        ) : null}
        <Button onPress={onNext}>웰니스 리포트 받기</Button>
        <Button isWhite={true} isLoading={isSyncing} onPress={onSync}>
          기록 동기화
        </Button>
      </View>
    </ScrollView>
  );
}
