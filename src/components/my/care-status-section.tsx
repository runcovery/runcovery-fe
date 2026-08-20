import { Text, View } from "react-native";

export default function CareStatusSection({ conditionRate, skinRate, stretchRate, feedback }: { conditionRate: number; skinRate: number; stretchRate: number; feedback: string }) {
  const normalizeRate = (value: number) =>
    Math.round(Math.min(100, Math.max(0, value)));
  const careStatus = [
    { label: "컨디션 체크", progress: normalizeRate(conditionRate) },
    { label: "피부상태 관리", progress: normalizeRate(skinRate) },
    { label: "스트레칭 관리", progress: normalizeRate(stretchRate) },
  ];
  return (
    <View>
      {/* 섹션 타이틀 */}
      <Text className="text-[16px] font-semibold text-neutral-400">
        이번 주 사후 관리 현황
      </Text>

      {/* 관리 항목별 달성률 */}
      <View className="mt-4 flex-row gap-3">
        {careStatus.map(({ label, progress }) => (
          <View
            key={label}
            className="h-24 flex-1 justify-between rounded-[18px] border border-neutral-100 bg-white px-4 py-4 shadow-[0_3px_5px_rgba(0,0,0,0.1)]"
            accessible
            accessibilityLabel={`${label} ${progress}%`}
          >
            <Text className="text-[12px] font-semibold text-neutral-500">
              {label}
            </Text>
            <Text className="self-end text-[24px] font-semibold text-primary-500">
              {progress}%
            </Text>
          </View>
        ))}
      </View>

      {/* 주간 관리 피드백 */}
      <View className="mt-5 flex-row items-center rounded-2xl border border-primary-500 bg-white px-5 py-4 shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
        <Text className="mr-2 text-[14px]">✨</Text>
        <Text className="flex-1 text-[14px] font-semibold leading-6 text-neutral-500">
          {feedback}
        </Text>
      </View>
    </View>
  );
}
