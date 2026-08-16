import { Text, View } from "react-native";
import StatProgressBar from "./stat-progress-bar";

type StatItemProps = {
  label?: string;
  modifier?: number;
  progress?: number;
  score?: number;
};

export default function StatItem({
  label = "홍조",
  modifier = 15,
  progress = 80,
  score = 85,
}: StatItemProps) {
  const modifierText = modifier > 0 ? `+${modifier}` : `${modifier}`;
  const modifierColor =
    modifier > 0
      ? "text-[#298DFF]"
      : modifier < 0
        ? "text-error"
        : "text-neutral-300";

  return (
    <View className="w-full">
      <View className="will-change-variable flex-row items-baseline gap-1">
        <Text className="text-[18px] font-medium text-neutral-500">
          {label}
        </Text>
        <Text className={`text-[18px] font-medium ${modifierColor}`}>
          {modifierText}
        </Text>
      </View>

      <View className="mt-5">
        <StatProgressBar
          progress={progress}
          accessibilityLabel={`${label} 진행도`}
        />
      </View>

      <Text className="mt-3 self-end text-[14px] font-medium text-neutral-500">
        {score}점
      </Text>
    </View>
  );
}
