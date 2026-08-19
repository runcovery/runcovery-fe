import type {
  SkinComparisonResponse,
  SkinRecordResponse,
  SkinScoreDifference,
  SkinScores,
} from "@/types/wellness";
import { ScrollView, Text, View } from "react-native";
import StatProgressBar from "./stat-progress-bar";

const SKIN_METRICS: Array<{
  key: keyof SkinScoreDifference;
  label: string;
}> = [
  { key: "redness", label: "홍조" },
  { key: "oiliness", label: "유분" },
  { key: "texture", label: "피부결" },
  { key: "pores", label: "모공" },
  { key: "blemishes", label: "잡티" },
  { key: "hydration", label: "보습" },
  { key: "pigment", label: "색소침착" },
];

type SkinResultProps = {
  result: SkinRecordResponse | SkinComparisonResponse;
};

const isComparisonResult = (
  result: SkinRecordResponse | SkinComparisonResponse,
): result is SkinComparisonResponse =>
  result.type === "AFTER_CARE" && "today" in result;

export default function SkinResultScreen({ result }: SkinResultProps) {
  const isComparison = isComparisonResult(result);
  const comparison = isComparison ? result : null;
  const scores: SkinScores | SkinRecordResponse = isComparison
    ? result.today
    : result;

  return (
    <View className="w-full flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-[20px] font-semibold text-neutral-950">
          {isComparison ? "관리 후 비교한 피부 상태" : "관리 후 피부 상태"}
        </Text>
        <Text className="mt-1 text-[13px] font-medium text-neutral-400">
          {isComparison
            ? "전체적으로 좋아졌어요!"
            : "오늘 측정한 관리 후 피부 상태예요."}
        </Text>

        <View className="mt-6 gap-5">
          {SKIN_METRICS.map(({ key, label }) => {
            const score = Number(scores[key]);
            const difference = comparison?.difference[key];
            const differenceText =
              difference === undefined
                ? null
                : difference > 0
                  ? `+${difference}`
                  : String(difference);
            const differenceColor =
              difference === undefined || difference === 0
                ? "text-neutral-300"
                : difference > 0
                  ? "text-[#298DFF]"
                  : "text-error";

            return (
              <View key={key}>
                <View className="flex-row items-baseline gap-1">
                  <Text className="text-[14px] font-medium text-neutral-500">
                    {label}
                  </Text>
                  {differenceText ? (
                    <Text
                      className={`text-[14px] font-medium ${differenceColor}`}
                    >
                      {differenceText}
                    </Text>
                  ) : null}
                </View>
                <View className="mt-3">
                  <StatProgressBar
                    progress={score}
                    accessibilityLabel={`${label} ${score}점`}
                  />
                </View>
                <Text className="mt-2 self-end text-[12px] font-medium text-neutral-500">
                  {score}점
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
