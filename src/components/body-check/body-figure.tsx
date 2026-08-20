import { Text, View } from "react-native";
import Svg, { Ellipse, G, Path, Polygon } from "react-native-svg";
import {
  BACK_PARTS,
  BODY_COLORS,
  BodyPartId,
  BodyRegion,
  BodySide,
  FRONT_PARTS,
  getBodyPartCode,
} from "./body-part-data";

interface BodyFigureProps {
  side: BodySide;
  width: number;
  selectedParts: ReadonlySet<BodyPartId>;
  onToggle: (part: BodyPartId) => void;
}

export default function BodyFigure({
  side,
  width,
  selectedParts,
  onToggle,
}: BodyFigureProps) {
  const height = (width / 150) * 350;
  const partId = (region: BodyRegion): BodyPartId =>
    getBodyPartCode(side, region);
  const color = (region: BodyRegion, dark = false) =>
    selectedParts.has(partId(region))
      ? BODY_COLORS.selected
      : dark
        ? BODY_COLORS.dark
        : BODY_COLORS.default;
  const toggle = (region: BodyRegion) => () => onToggle(partId(region));
  const parts = side === "front" ? FRONT_PARTS : BACK_PARTS;

  return (
    <View className="flex-1 items-center">
      <Svg width={width} height={height} viewBox="0 0 150 350">
        {/* 머리는 앞·뒤 실루엣이 달라 별도로 렌더링한다. */}
        {side === "front" ? (
          <G>
            <Ellipse
              cx="75"
              cy="18"
              rx="13"
              ry="16"
              fill={color("head", true)}
              pointerEvents="none"
            />
            <Ellipse
              cx="75"
              cy="18"
              rx="18"
              ry="21"
              fill="transparent"
              onPressIn={toggle("head")}
            />
          </G>
        ) : (
          <G>
            <Polygon
              points="64,7 75,3 86,7 90,14 89,27 83,38 67,38 61,27 60,14"
              fill={color("head", true)}
              pointerEvents="none"
            />
            <Polygon
              points="59,4 75,0 91,4 95,14 94,30 86,43 64,43 56,30 55,14"
              fill="transparent"
              onPressIn={toggle("head")}
            />
          </G>
        )}

        {/* 선택 영역과 시각 영역을 분리해 작은 신체 부위도 누르기 쉽게 만든다. */}
        {parts.map((part) => (
          <G key={part.id}>
            <Path
              d={part.d}
              fill={color(part.id, part.dark)}
              stroke={BODY_COLORS.line}
              strokeWidth={side === "front" ? 3 : 2}
              strokeLinejoin="round"
              strokeLinecap="round"
              pointerEvents="none"
            />
            <Path
              d={part.d}
              fill="transparent"
              stroke="transparent"
              strokeWidth={12}
              strokeLinejoin="round"
              strokeLinecap="round"
              onPressIn={toggle(part.id)}
            />
          </G>
        ))}
      </Svg>
      {/* 신체 방향 라벨 */}
      <Text className="mt-10 text-[14px] font-medium text-neutral-950">
        {side === "front" ? "앞" : "뒤"}
      </Text>
    </View>
  );
}
