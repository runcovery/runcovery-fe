import { Text, View } from "react-native";

export default function ProfileSection({
  nickname,
  burnedCalories,
  totalCalories,
}: {
  nickname: string;
  burnedCalories: number;
  totalCalories: number;
}) {
  const progress = Math.min(
    100,
    Math.max(0, totalCalories > 0 ? (burnedCalories / totalCalories) * 100 : 0),
  );

  return (
    <View className="mt-5 flex-row items-center gap-3">
      <View className="h-9 w-9 items-center justify-center rounded-full bg-primary-160">
        <Text className="text-[21px]">🤪</Text>
      </View>

      <View className="flex-1 gap-2">
        <Text className="text-[14px] font-semibold text-neutral-500">
          {nickname}
        </Text>
        <View className="flex-row items-center gap-3">
          <View
            className="h-2.5 flex-1 overflow-hidden rounded-full bg-neutral-100"
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel="이번 달 칼로리 목표"
            accessibilityValue={{
              min: 0,
              max: totalCalories,
              now: burnedCalories,
            }}
          >
            <View
              className="h-full rounded-full bg-primary-500"
              style={{ width: `${progress}%` }}
            />
          </View>
          <Text className="text-[12px] font-semibold text-neutral-400">
            <Text className="text-primary-500">
              {burnedCalories.toLocaleString()}
            </Text>{" "}
            / {totalCalories.toLocaleString()}kcal
          </Text>
        </View>
      </View>
    </View>
  );
}
