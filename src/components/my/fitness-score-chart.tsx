import { View } from "react-native";
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

const SCORES = [63, 66, 71, 68, 70, 78, 80, 82, 86, 84, 89] as const;
const DAYS = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31] as const;
const LEVELS = [95, 85, 75, 65, 55] as const;

const CHART_WIDTH = 330;
const CHART_HEIGHT = 184;
const PLOT_LEFT = 44;
const PLOT_RIGHT = 310;
const PLOT_TOP = 18;
const PLOT_BOTTOM = 146;

const getX = (index: number) =>
  PLOT_LEFT +
  (index * (PLOT_RIGHT - PLOT_LEFT)) / Math.max(SCORES.length - 1, 1);

const getY = (score: number) =>
  PLOT_BOTTOM - ((score - 55) / (95 - 55)) * (PLOT_BOTTOM - PLOT_TOP);

const POINTS = SCORES.map((score, index) => ({
  x: getX(index),
  y: getY(score),
}));

const CURVE_TENSION = 0.16;

const linePath = POINTS.reduce((path, point, index) => {
  if (index === 0) {
    return `M ${point.x} ${point.y}`;
  }

  const previousPoint = POINTS[index - 1];
  const previousPreviousPoint = POINTS[index - 2] ?? previousPoint;
  const nextPoint = POINTS[index + 1] ?? point;
  const controlPoint1 = {
    x:
      previousPoint.x +
      (point.x - previousPreviousPoint.x) * CURVE_TENSION,
    y:
      previousPoint.y +
      (point.y - previousPreviousPoint.y) * CURVE_TENSION,
  };
  const controlPoint2 = {
    x: point.x - (nextPoint.x - previousPoint.x) * CURVE_TENSION,
    y: point.y - (nextPoint.y - previousPoint.y) * CURVE_TENSION,
  };

  return `${path} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${point.x} ${point.y}`;
}, "");

export default function FitnessScoreChart() {
  return (
    <View
      className="w-full overflow-hidden rounded-[22px] bg-white px-2 py-2 shadow-[0_4px_10px_rgba(0,0,0,0.08)]"
      accessible
      accessibilityRole="image"
      accessibilityLabel="이번 달 내 피부 점수 그래프. 1일 63점에서 31일 89점으로 상승했습니다."
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

        {LEVELS.map((level) => {
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

        {LEVELS.map((level) => (
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

        {SCORES.map((score, index) => {
          const isLast = index === SCORES.length - 1;

          return (
            <Circle
              key={`${DAYS[index]}-${score}`}
              cx={getX(index)}
              cy={getY(score)}
              r={isLast ? 6 : 3}
              fill={isLast ? "#725AF5" : "#FFFFFF"}
              stroke="#725AF5"
              strokeWidth={isLast ? 2 : 2.5}
            />
          );
        })}

        {DAYS.map((day, index) => (
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
        ))}
      </Svg>
    </View>
  );
}
