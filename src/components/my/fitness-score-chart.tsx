import { useMemo } from "react";
import { Text, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  FeGaussianBlur,
  FeOffset,
  Filter,
  Line,
  Path,
  Text as SvgText,
} from "react-native-svg";
import type { SkinScore } from "@/types/user";

const CHART_WIDTH = 330;
const CHART_HEIGHT = 184;
const PLOT_LEFT = 44;
const PLOT_RIGHT = 310;
const PLOT_TOP = 18;
const PLOT_BOTTOM = 146;
const CURVE_TENSION = 0.16;
const AXIS_LEVEL_COUNT = 5;

const clampScore = (score: number) => Math.min(100, Math.max(0, score));

export default function FitnessScoreChart({ scores }: { scores: SkinScore[] }) {
  const normalizedScores = useMemo(() => {
    const scoreByDay = new Map<number, SkinScore>();

    // 같은 날짜의 중복 응답은 마지막 값으로 합치고 차트 범위를 0~100점으로 제한한다.
    scores.forEach(({ day, score }) => {
      if (Number.isFinite(day) && Number.isFinite(score)) {
        scoreByDay.set(day, { day, score: clampScore(score) });
      }
    });

    return [...scoreByDay.values()].sort((a, b) => a.day - b.day);
  }, [scores]);

  if (normalizedScores.length === 0) {
    return (
      <View
        className="h-[184px] w-full items-center justify-center rounded-[22px] bg-white px-6 shadow-[0_4px_10px_rgba(0,0,0,0.08)]"
        accessible
        accessibilityRole="text"
        accessibilityLabel="이번 달 피부 측정 기록이 없습니다."
      >
        <Text className="text-center text-[14px] text-[#676D76]">
          이번 달 피부 측정 기록이 없어요.
        </Text>
      </View>
    );
  }

  // 실제 점수 주변에 5점 여백을 두되 지나치게 좁은 Y축이 되지 않도록 기본 범위를 보장한다.
  const observedMin = Math.min(...normalizedScores.map(({ score }) => score));
  const observedMax = Math.max(...normalizedScores.map(({ score }) => score));
  const axisMin = Math.max(0, Math.min(50, Math.floor((observedMin - 5) / 5) * 5));
  const axisMax = Math.min(100, Math.max(80, Math.ceil((observedMax + 5) / 5) * 5));
  const axisRange = Math.max(axisMax - axisMin, 1);
  const levels = Array.from({ length: AXIS_LEVEL_COUNT }, (_, index) =>
    Math.round(axisMax - (axisRange * index) / (AXIS_LEVEL_COUNT - 1)),
  );
  const getY = (score: number) =>
    PLOT_BOTTOM -
    ((Math.min(axisMax, Math.max(axisMin, score)) - axisMin) / axisRange) *
      (PLOT_BOTTOM - PLOT_TOP);
  const getX = (index: number) =>
    normalizedScores.length === 1
      ? (PLOT_LEFT + PLOT_RIGHT) / 2
      : PLOT_LEFT +
        (index * (PLOT_RIGHT - PLOT_LEFT)) / (normalizedScores.length - 1);
  const points = normalizedScores.map(({ score }, index) => ({
    x: getX(index),
    y: getY(score),
  }));
  // 인접 점을 제어점으로 삼은 Catmull-Rom 형태의 베지어 곡선을 만든다.
  const linePath = points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;

    const previousPoint = points[index - 1];
    const previousPreviousPoint = points[index - 2] ?? previousPoint;
    const nextPoint = points[index + 1] ?? point;
    const c1x =
      previousPoint.x + (point.x - previousPreviousPoint.x) * CURVE_TENSION;
    const c1y =
      previousPoint.y + (point.y - previousPreviousPoint.y) * CURVE_TENSION;
    const c2x = point.x - (nextPoint.x - previousPoint.x) * CURVE_TENSION;
    const c2y = point.y - (nextPoint.y - previousPoint.y) * CURVE_TENSION;

    return `${path} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${point.x} ${point.y}`;
  }, "");
  // 데이터가 많아도 X축 라벨은 최대 7개 안팎만 보여 겹침을 방지한다.
  const labelInterval = Math.max(1, Math.ceil(normalizedScores.length / 7));
  const first = normalizedScores[0];
  const last = normalizedScores[normalizedScores.length - 1];

  return (
    <View
      className="w-full overflow-hidden rounded-[22px] bg-white px-2 py-2 shadow-[0_4px_10px_rgba(0,0,0,0.08)]"
      accessible
      accessibilityRole="image"
      accessibilityLabel={`이번 달 피부 점수 그래프입니다. ${first.day}일 ${first.score}점에서 ${last.day}일 ${last.score}점입니다.`}
    >
      <Svg
        width="100%"
        height={CHART_HEIGHT}
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      >
        <Defs>
          <Filter
            id="lineShadow"
            x="-20%"
            y="-20%"
            width="140%"
            height="160%"
          >
            <FeGaussianBlur stdDeviation={4} />
            <FeOffset dx={0} dy={6} />
          </Filter>
        </Defs>

        {levels.map((level) => {
          const y = getY(level);

          return (
            <Line
              key={level}
              x1={PLOT_LEFT}
              x2={PLOT_RIGHT}
              y1={y}
              y2={y}
              stroke="#9FA3A8"
              strokeWidth={1}
              strokeDasharray="3 4"
            />
          );
        })}

        {levels.map((level) => (
          <SvgText
            key={`label-${level}`}
            x={12}
            y={getY(level) + 4}
            fill="#676D76"
            fontSize={11}
          >
            {level}
          </SvgText>
        ))}

        <Path
          d={linePath}
          fill="none"
          stroke="#787878"
          strokeWidth={5}
          strokeLinecap="round"
          opacity={0.28}
          filter="url(#lineShadow)"
        />

        <Path
          d={linePath}
          fill="none"
          stroke="#725AF5"
          strokeWidth={4}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {normalizedScores.map(({ day, score }, index) => {
          const isLast = index === normalizedScores.length - 1;

          return (
            <Circle
              key={day}
              cx={getX(index)}
              cy={getY(score)}
              r={isLast ? 6 : 3}
              fill={isLast ? "#725AF5" : "#FFFFFF"}
              stroke="#725AF5"
              strokeWidth={isLast ? 2 : 2.5}
            />
          );
        })}

        {normalizedScores.map(({ day }, index) => {
          const shouldShowLabel =
            index % labelInterval === 0 || index === normalizedScores.length - 1;

          if (!shouldShowLabel) return null;

          return (
            <SvgText
              key={`day-${day}`}
              x={getX(index)}
              y={166}
              fill="#676D76"
              fontSize={10}
              textAnchor="middle"
            >
              {day}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}
