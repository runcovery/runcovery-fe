import Button from "@/components/ui/Button";
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

function IntensityGauge() {
  const { width: screenWidth } = useWindowDimensions();
  const gaugeWidth = Math.min(320, screenWidth - 64);
  const gaugeHeight = (gaugeWidth / 320) * 205;

  return (
    <View
      className="relative w-full items-center"
      style={{ height: gaugeHeight + 30 }}
      accessibilityLabel="오늘의 러닝 강도: 고강도"
    >
      <Image
        source={require("../../../assets/images/character/lying-pink-cat.png")}
        className="absolute z-10 h-14 w-23"
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
        고강도
      </Text>
    </View>
  );
}

export default function RunningIntensityAnalysis({
  onPressReport,
}: RunningIntensityAnalysisProps) {
  return (
    <ScrollView
      className="flex-1 w-full"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 8 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 justify-between gap-8">
        <View>
          <Text className="mt-3 text-[20px] font-semibold text-neutral-950">
            오늘의 러닝 강도 분석
          </Text>

          <View className="mt-6">
            <IntensityGauge />
          </View>

          <View className="mt-7 flex-row gap-3 rounded-[20px] border border-primary-440 bg-white px-4 py-5 shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
            <View className="pt-0.5">
              <WarningIcon />
            </View>
            <Text className="min-w-0 flex-1 text-[13px] font-medium leading-6 text-neutral-700">
              <Text className="font-semibold text-primary-500">
                오버트레이닝 경고 :
              </Text>{" "}
              어제 수면이 부족한 상태에서 평균 심박수 150 이상의 고강도
              훈련을 강행했습니다. 현재 신체 피로도와 안면 열감이 극심한
              상태입니다.
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

        <Button onPress={onPressReport}>웰니스 리포트 받기</Button>
      </View>
    </ScrollView>
  );
}
