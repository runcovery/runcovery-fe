import { BlurView } from "expo-blur";
import { styled } from "nativewind";
import { StyleSheet, View } from "react-native";
import Svg, {
  Defs,
  Path,
  Rect,
  Stop,
  LinearGradient as SvgLinearGradient,
} from "react-native-svg";

const StyledSvg = styled(Svg);

interface GradientBackgroundProps {
  offsetY?: number;
}

export default function GradientBackground({
  offsetY = 0,
}: GradientBackgroundProps) {
  return (
    <View className="absolute inset-0 bg-white" pointerEvents="none">
      {/* 화면 비율과 관계없이 늘어나는 곡선형 그라데이션 */}
      <StyledSvg
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 390 844"
      >
        <Defs>
          <SvgLinearGradient
            id="shapeGradient"
            x1="195"
            x2="195"
            y1="80"
            y2="844"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0" stopColor="#F3F0FF" stopOpacity="0.45" />
            <Stop offset="0.48" stopColor="#C9C3FF" stopOpacity="1" />
            <Stop offset="1" stopColor="#7F88EF" stopOpacity="1" />
          </SvgLinearGradient>
        </Defs>

        <Rect width="390" height="844" fill="#FFFFFF" />
        <Path
          d="M -54 -32 C -8 54 18 273 126 326 C 214 369 289 131 438 82 C 440 292 408 610 360 790 C 300 900 94 900 25 790 C -20 586 -58 226 -54 -32 Z"
          fill="url(#shapeGradient)"
          transform={`translate(0 ${offsetY})`}
        />
      </StyledSvg>

      {/* SVG 경계를 부드럽게 섞어 배경의 색상 전환을 완화한다. */}
      <BlurView
        experimentalBlurMethod="dimezisBlurView"
        blurReductionFactor={1}
        intensity={100}
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}
