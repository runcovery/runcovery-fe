import { View } from "react-native";

type StatProgressBarProps = {
  progress: number;
  accessibilityLabel?: string;
};

export default function StatProgressBar({
  progress,
  accessibilityLabel = "능력치 진행도",
}: StatProgressBarProps) {
  const normalizedProgress = Math.min(100, Math.max(0, progress));

  return (
    <View
      className="h-3.75 w-full overflow-hidden rounded-full bg-[#C6C6C6]"
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: normalizedProgress }}
    >
      <View
        className="h-full rounded-full bg-primary-500"
        style={{ width: `${normalizedProgress}%` }}
      />
    </View>
  );
}
