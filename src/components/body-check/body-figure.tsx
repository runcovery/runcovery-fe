import { Text, View } from "react-native";
import Svg, { Ellipse, Path, Polygon } from "react-native-svg";
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
        {side === "front" ? (
          <Ellipse
            cx="75"
            cy="18"
            rx="13"
            ry="16"
            fill={color("head", true)}
            onPress={toggle("head")}
          />
        ) : (
          <Polygon
            points="64,7 75,3 86,7 90,14 89,27 83,38 67,38 61,27 60,14"
            fill={color("head", true)}
            onPress={toggle("head")}
          />
        )}

        {parts.map((part) => (
          <Path
            key={part.id}
            d={part.d}
            fill={color(part.id, part.dark)}
            onPress={toggle(part.id)}
            stroke={BODY_COLORS.line}
            strokeWidth={side === "front" ? 3 : 2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}
      </Svg>
      <Text className="mt-10 text-[14px] font-medium text-neutral-950">
        {side === "front" ? "앞" : "뒤"}
      </Text>
    </View>
  );
}
