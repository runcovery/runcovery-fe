import Button from "@/components/ui/Button";
import type { RunningIntensity } from "@/types/wellness";
import {
  Image,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Svg, { Circle, Line, Path, Polygon } from "react-native-svg";

const GAUGE_SEGMENTS = [
  { d: "M30 160 A130 130 0 0 1 95 47.4", color: "#E2DDFB" },
  { d: "M95 47.4 A130 130 0 0 1 225 47.4", color: "#A495F6" },
  { d: "M225 47.4 A130 130 0 0 1 290 160", color: "#725AF5" },
] as const;

const LEVEL_POSITION: Record<RunningIntensity["level"], number> = {
  LOW: 0.18,
  MODERATE: 0.5,
  HIGH: 0.82,
};

const LEVEL_LABEL: Record<RunningIntensity["level"], string> = {
  LOW: "저강도",
  MODERATE: "중강도",
  HIGH: "고강도",
};

interface RunningIntensityAnalysisProps {
  onPressReport: () => void;
}

function WarningIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22">
      <Polygon points="11,1.5 21,20 1,20" fill="#725AF5" />
      <Line
        x1="11"
        y1="7"
        x2="11"
        y2="13"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Circle cx="11" cy="16.5" r="1.2" fill="#FFFFFF" />
    </Svg>
  );
}

function IntensityGauge({ intensity }: { intensity: RunningIntensity }) {
  const { width: screenWidth } = useWindowDimensions();
  const gaugeWidth = Math.min(320, screenWidth - 64);
  const gaugeHeight = (gaugeWidth / 320) * 205;
  const contentWidth = screenWidth - 64;
  const gaugeOffset = Math.max(0, (contentWidth - gaugeWidth) / 2);
  const catWidth = 92;
  const catLeft =
    gaugeOffset + gaugeWidth * LEVEL_POSITION[intensity.level] - catWidth / 2;

  return (
    <View
      className="relative w-full items-center"
      style={{ height: gaugeHeight + 30 }}
      accessibilityLabel={`오늘의 러닝 강도: ${LEVEL_LABEL[intensity.level]}, ${intensity.score}점`}
    >
      {/* 강도 구간에 맞춰 고양이 위치를 이동한다. */}
      <Image
        source={require("../../../assets/images/character/lying-pink-cat.png")}
        className="absolute z-10 h-14 w-23"
        style={{ left: catLeft }}
        resizeMode="contain"
      />
      <Svg
        width={gaugeWidth}
        height={gaugeHeight}
        viewBox="0 0 320 205"
        style={{ marginTop: 18 }}
      >
        {GAUGE_SEGMENTS.map((segment) => (
          <Path
            key={segment.color}
            d={segment.d}
            fill="none"
            stroke={segment.color}
            strokeWidth={54}
            strokeLinecap="butt"
          />
        ))}
      </Svg>
      <Text className="absolute bottom-8 text-[20px] font-semibold text-neutral-950">
        {LEVEL_LABEL[intensity.level]} · {intensity.score}점
      </Text>
    </View>
  );
}

export default function RunningIntensityAnalysis({
  onPressReport,
  intensity,
}: RunningIntensityAnalysisProps & { intensity: RunningIntensity }) {
  return (
    <ScrollView
      className="flex-1 w-full"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 8 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 justify-between gap-8">
        <View>
          {/* 타이틀 */}
          <Text className="mt-3 text-[20px] font-semibold text-neutral-950">
            오늘의 러닝 강도 분석
          </Text>

          {/* 러닝 강도 게이지 */}
          <View className="mt-6">
            <IntensityGauge intensity={intensity} />
          </View>

          {/* 강도 분석 피드백 */}
          <View className="mt-7 flex-row gap-3 rounded-[20px] border border-primary-440 bg-white px-4 py-5 shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
            <View className="pt-0.5">
              <WarningIcon />
            </View>
            <Text className="min-w-0 flex-1 text-[13px] font-medium leading-6 text-neutral-700">
              <Text className="font-semibold text-primary-500">
                러닝 분석 :
              </Text>{" "}
              {intensity.comment}
            </Text>
          </View>

          <View className="mt-10 items-end pr-6">
            <Image
              source={require("../../../assets/images/character/lying-puple-cat-manage.png")}
              className="h-16 w-30"
              resizeMode="contain"
            />
          </View>
        </View>

        {/* 버튼 */}
        <Button onPress={onPressReport}>웰니스 리포트 받기</Button>
      </View>
    </ScrollView>
  );
}
