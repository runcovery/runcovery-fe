import { Text, View } from "react-native";

const CARE_STATUS = [
  { label: "컨디션 체크", progress: 100 },
  { label: "피부상태 관리", progress: 70 },
  { label: "스트레칭 관리", progress: 70 },
] as const;

export default function CareStatusSection() {
  return (
    <View>
      <Text className="text-[16px] font-semibold text-neutral-400">
        이번 주 사후 관리 현황
      </Text>

      <View className="mt-4 flex-row gap-3">
        {CARE_STATUS.map(({ label, progress }) => (
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

      <View className="mt-5 flex-row items-center rounded-2xl border border-primary-500 bg-white px-5 py-4 shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
        <Text className="mr-2 text-[14px]">✨</Text>
        <Text className="text-[14px] font-semibold text-neutral-500">
          사후 관리에 대한 피드백 작성입니다.
        </Text>
      </View>
    </View>
  );
}
