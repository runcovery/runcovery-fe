import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

const SIZE = 88;
const STROKE_WIDTH = 8;
const CENTER = SIZE / 2;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type AchievementProgressProps = {
  progress?: number;
};

export default function AchievementProgress({
  progress = 80,
}: AchievementProgressProps) {
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  const strokeDashoffset =
    CIRCUMFERENCE * (1 - normalizedProgress / 100);

  return (
    <View
      className="relative items-center justify-center"
      style={{ width: SIZE, height: SIZE }}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="목표 달성률"
      accessibilityValue={{ min: 0, max: 100, now: normalizedProgress }}
    >
      {/* 원형 달성률 그래프 */}
      <Svg width={SIZE} height={SIZE}>
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="#DCDCDD"
          strokeWidth={STROKE_WIDTH}
        />
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="#725AF5"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={[CIRCUMFERENCE, CIRCUMFERENCE]}
          strokeDashoffset={-strokeDashoffset}
          transform={`rotate(-90 ${CENTER} ${CENTER})`}
        />
      </Svg>

      {/* 달성률 수치 */}
      <View className="absolute inset-0 items-center justify-center">
        <Text className="text-[20px] font-semibold text-primary-500">
          {Math.round(normalizedProgress)}%
        </Text>
        <Text className="text-[10px] font-medium text-neutral-300">
          목표 달성률
        </Text>
      </View>
    </View>
  );
}
