import GradientScreenLayout from "@/components/shared/gradient-screen-layout";
import Button from "@/components/ui/Button";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import Svg, { Ellipse, Path, Polygon } from "react-native-svg";

const DEFAULT_COLOR = "#DCDDDF";
const DARK_COLOR = "#A4A9AF";
const SELECTED_COLOR = "#725AF5";
const LINE_COLOR = "#FFFFFF";

type BodySide = "front" | "back";
type BodyPart = { id: string; d: string; dark?: boolean };

interface BodyFigureProps {
  side: BodySide;
  selectedParts: Set<string>;
  onToggle: (part: string) => void;
}

const FRONT_PARTS: BodyPart[] = [
  { id: "neck", d: "M67 34 L83 34 L83 45 L75 57 L67 45 Z" },
  {
    id: "left-trapezius",
    d: "M66 43 L75 58 L74 69 L42 68 L49 55 Z",
    dark: true,
  },
  {
    id: "right-trapezius",
    d: "M84 43 L75 58 L76 69 L108 68 L101 55 Z",
    dark: true,
  },
  {
    id: "left-shoulder",
    d: "M42 67 C37 66 33 64 29 65 L23 69 Q20 72 20 77 L21 88 Q22 94 27 98 L34 91 L39 81 Z",
  },
  {
    id: "right-shoulder",
    d: "M108 67 C113 66 117 64 121 65 L127 69 Q130 72 130 77 L129 88 Q128 94 123 98 L116 91 L111 81 Z",
  },
  {
    id: "left-chest",
    d: "M42 71 L74 71 L73 98 L55 105 L41 100 L33 89 Z",
  },
  {
    id: "right-chest",
    d: "M108 71 L76 71 L77 98 L95 105 L109 100 L117 89 Z",
  },
  {
    id: "left-upper-arm",
    d: "M26 96 L36 88 L34 111 L23 132 L14 125 L18 107 Z",
  },
  {
    id: "right-upper-arm",
    d: "M124 96 L114 88 L116 111 L127 132 L136 125 L132 107 Z",
  },
  {
    id: "left-inner-arm",
    d: "M34 88 L42 86 L45 101 L38 121 L24 134 L32 110 Z",
  },
  {
    id: "right-inner-arm",
    d: "M116 88 L108 86 L105 101 L112 121 L126 134 L118 110 Z",
  },
  {
    id: "left-forearm",
    d: "M14 125 L25 132 L20 157 L9 176 Q5 181 0 181 L7 160 Z",
  },
  {
    id: "right-forearm",
    d: "M136 125 L125 132 L130 157 L141 176 Q145 181 150 181 L143 160 Z",
  },
  {
    id: "left-abdomen",
    d: "M41 101 L55 106 L62 103 L61 143 L54 138 L47 132 Z",
  },
  {
    id: "right-abdomen",
    d: "M109 101 L95 106 L88 103 L89 143 L96 138 L103 132 Z",
  },
  {
    id: "abdomen",
    d: "M62 103 L70 99 L80 99 L88 103 L85 162 L78 181 L72 181 L65 162 Z",
  },
  {
    id: "left-inner-thigh",
    d: "M48 159 L62 154 L72 183 L66 218 L56 190 Z",
    dark: true,
  },
  {
    id: "right-inner-thigh",
    d: "M102 159 L88 154 L78 183 L84 218 L94 190 Z",
    dark: true,
  },
  {
    id: "left-thigh",
    d: "M47 160 L57 157 L66 216 L59 239 L51 246 L45 239 L38 247 L36 225 L39 185 Z",
  },
  {
    id: "right-thigh",
    d: "M103 160 L93 157 L84 216 L91 239 L99 246 L105 239 L112 247 L114 225 L111 185 Z",
  },
  {
    id: "left-knee",
    d: "M46 239 L57 238 L60 252 L56 265 L45 265 L41 252 Z",
    dark: true,
  },
  {
    id: "right-knee",
    d: "M104 239 L93 238 L90 252 L94 265 L105 265 L109 252 Z",
    dark: true,
  },
  {
    id: "left-calf",
    d: "M43 262 L59 262 L62 280 L58 304 L52 329 L40 329 L42 309 L38 280 Z",
  },
  {
    id: "right-calf",
    d: "M107 262 L91 262 L88 280 L92 304 L98 329 L110 329 L108 309 L112 280 Z",
  },
  {
    id: "left-foot",
    d: "M40 326 C46 325 52 325 57 326 Q59 327 59 330 L59 344 Q59 348 55 348 L22 348 Q17 348 20 344 C25 339 32 336 41 333 Z",
  },
  {
    id: "right-foot",
    d: "M93 326 C98 325 104 325 110 326 L109 333 C118 336 125 339 130 344 Q133 348 128 348 L95 348 Q91 348 91 344 L91 330 Q91 327 93 326 Z",
  },
];

const BACK_PARTS: BodyPart[] = [
  { id: "neck", d: "M66 40 L84 40 L89 57 L61 57 Z", dark: true },
  {
    id: "left-trapezius",
    d: "M61 58 L75 58 L75 111 L54 94 L46 67 L54 63 Z",
  },
  {
    id: "right-trapezius",
    d: "M89 58 L75 58 L75 111 L96 94 L104 67 L96 63 Z",
  },
  {
    id: "left-shoulder",
    d: "M43 67 L28 73 L20 91 L22 107 L38 99 L49 72 Z",
  },
  {
    id: "right-shoulder",
    d: "M107 67 L122 73 L130 91 L128 107 L112 99 L101 72 Z",
  },
  {
    id: "left-upper-arm",
    d: "M22 105 L35 99 L32 125 L23 145 L15 141 L17 120 Z",
  },
  {
    id: "right-upper-arm",
    d: "M128 105 L115 99 L118 125 L127 145 L135 141 L133 120 Z",
  },
  {
    id: "left-inner-arm",
    d: "M33 99 L43 96 L45 112 L38 133 L24 150 L22 145 L31 125 Z",
  },
  {
    id: "right-inner-arm",
    d: "M117 99 L107 96 L105 112 L112 133 L126 150 L128 145 L119 125 Z",
  },
  {
    id: "left-forearm",
    d: "M15 140 L25 148 L20 166 L7 190 L1 192 L8 169 Z",
  },
  {
    id: "right-forearm",
    d: "M135 140 L125 148 L130 166 L143 190 L149 192 L142 169 Z",
  },
  {
    id: "left-back",
    d: "M54 94 L75 111 L75 127 L45 136 L40 99 Z",
  },
  {
    id: "right-back",
    d: "M96 94 L75 111 L75 127 L105 136 L110 99 Z",
  },
  {
    id: "left-lower-back",
    d: "M51 136 L72 128 L71 153 L64 179 L55 158 Z",
  },
  {
    id: "right-lower-back",
    d: "M99 136 L78 128 L79 153 L86 179 L95 158 Z",
  },
  {
    id: "left-glute",
    d: "M58 181 L71 164 L72 201 L55 209 L47 204 L48 188 Z",
  },
  {
    id: "right-glute",
    d: "M92 181 L79 164 L78 201 L95 209 L103 204 L102 188 Z",
  },
  {
    id: "left-thigh",
    d: "M52 208 L71 201 L70 229 L64 260 L56 245 L48 262 L40 250 L39 214 Z",
    dark: true,
  },
  {
    id: "right-thigh",
    d: "M98 208 L79 201 L80 229 L86 260 L94 245 L102 262 L110 250 L111 214 Z",
    dark: true,
  },
  {
    id: "left-knee",
    d: "M48 260 L56 246 L64 260 L59 276 L50 279 L44 268 Z",
  },
  {
    id: "right-knee",
    d: "M102 260 L94 246 L86 260 L91 276 L100 279 L106 268 Z",
  },
  {
    id: "left-calf",
    d: "M50 277 L59 274 L62 300 L56 319 L48 333 L42 316 L43 292 Z",
  },
  {
    id: "right-calf",
    d: "M100 277 L91 274 L88 300 L94 319 L102 333 L108 316 L107 292 Z",
  },
  {
    id: "left-heel",
    d: "M48 331 L55 318 L60 331 L56 350 L51 340 Z",
    dark: true,
  },
  {
    id: "right-heel",
    d: "M102 331 L95 318 L90 331 L94 350 L99 340 Z",
    dark: true,
  },
];

function BodyFigure({ side, selectedParts, onToggle }: BodyFigureProps) {
  const color = (part: string, dark = false) =>
    selectedParts.has(`${side}-${part}`)
      ? SELECTED_COLOR
      : dark
        ? DARK_COLOR
        : DEFAULT_COLOR;
  const toggle = (part: string) => () => onToggle(`${side}-${part}`);
  const parts = side === "front" ? FRONT_PARTS : BACK_PARTS;

  return (
    <View className="flex-1 items-center">
      <Svg width={145} height={350} viewBox="0 0 150 350">
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
            stroke={LINE_COLOR}
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

export default function BodyCheckScreen() {
  const [selectedParts, setSelectedParts] = useState<Set<string>>(new Set());

  const togglePart = (part: string) => {
    setSelectedParts((current) => {
      const next = new Set(current);
      next.has(part) ? next.delete(part) : next.add(part);
      return next;
    });
  };

  return (
    <View className="flex-1 justify-between">
      <GradientScreenLayout offsetY={120} edges={["left", "right", "bottom"]}>
        <View className="items-start justify-between flex-1 py-16 w-full px-8">
          <View className="gap-3">
            <View className="flex flex-row items-center">
              <Pressable
                onPress={() => router.back()}
                className="h-10 w-10 -ml-3"
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="뒤로 가기"
              >
                <Image
                  source={require("../../../assets/images/shared/prev.png")}
                  className="h-full w-full"
                />
              </Pressable>
              <Text className="text-[16px] font-semibold text-black ml-32">
                내 컨디션
              </Text>
            </View>
            <Text className="text-[20px] font-semibold text-neutral-950">
              러닝 중 불편하거나 아픈 부위가 있었나요?
            </Text>
          </View>

          <View className="h-120 w-full flex-row items-center justify-between">
            <BodyFigure
              side="front"
              selectedParts={selectedParts}
              onToggle={togglePart}
            />
            <BodyFigure
              side="back"
              selectedParts={selectedParts}
              onToggle={togglePart}
            />
          </View>

          <View className="gap-4 w-full">
            <Button>다음</Button>
            <Button isWhite={true}>없었어요</Button>
          </View>
        </View>
      </GradientScreenLayout>
    </View>
  );
}
