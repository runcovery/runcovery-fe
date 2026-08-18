import { useEffect, type ComponentType } from "react";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { G, Path, type GProps, type SvgProps } from "react-native-svg";

type MatrixGroupProps = GProps & { matrix?: number[] };
const MatrixGroup = G as ComponentType<MatrixGroupProps>;
const AnimatedGroup = Animated.createAnimatedComponent(MatrixGroup);

const BODY_COLOR = "#FF7CD1";
const VIEWBOX_WIDTH = 190;
const VIEWBOX_HEIGHT = 204;
const TAIL_ORIGIN_X = 117.5;
const TAIL_ORIGIN_Y = 150;

export interface AnimatedPinkCatProps
  extends Omit<SvgProps, "width" | "height" | "viewBox"> {
  /** Rendered width. Height is calculated from the original aspect ratio. */
  width?: number;
  /** Whether the tail should wag. */
  animated?: boolean;
  /** Time in milliseconds for one side of the wag. */
  wagDuration?: number;
}

export default function AnimatedPinkCat({
  width = VIEWBOX_WIDTH,
  animated = true,
  wagDuration = 550,
  ...svgProps
}: AnimatedPinkCatProps) {
  const reduceMotion = useReducedMotion();
  const tailRotation = useSharedValue(-10);

  useEffect(() => {
    cancelAnimation(tailRotation);

    if (!animated || reduceMotion) {
      tailRotation.value = 0;
      return;
    }

    tailRotation.value = -10;
    tailRotation.value = withRepeat(
      withTiming(0, {
        duration: wagDuration,
        easing: Easing.inOut(Easing.cubic),
      }),
      -1,
      true,
    );

    return () => cancelAnimation(tailRotation);
  }, [animated, reduceMotion, tailRotation, wagDuration]);

  const animatedTailProps = useAnimatedProps(() => {
    const radians = (tailRotation.value * Math.PI) / 180;
    const cosine = Math.cos(radians);
    const sine = Math.sin(radians);

    return {
      // react-native-svg accepts a six-value affine matrix. Supplying it as a
      // native SVG prop avoids Reanimated's React Native transform processor.
      matrix: [
        cosine,
        sine,
        -sine,
        cosine,
        TAIL_ORIGIN_X - cosine * TAIL_ORIGIN_X + sine * TAIL_ORIGIN_Y,
        TAIL_ORIGIN_Y - sine * TAIL_ORIGIN_X - cosine * TAIL_ORIGIN_Y,
      ],
    };
  });

  return (
    <Svg
      width={width}
      height={(width * VIEWBOX_HEIGHT) / VIEWBOX_WIDTH}
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      accessible
      accessibilityLabel="꼬리를 흔드는 분홍 고양이"
      {...svgProps}
    >
      {/* Keep the tail behind the body so the joint stays hidden while rotating. */}
      <AnimatedGroup animatedProps={animatedTailProps}>
        <Path
          d="M117 168L117.509 148.005C122.801 148.805 130.231 144.34 133.284 142.007C139.9 136.508 143.123 130.343 143.971 127.011C145.192 122.612 147.194 120.179 148.042 119.513C154.555 114.314 161.612 116.014 164.326 117.513C169.924 120.013 171.323 126.511 170.941 129.51C168.906 145.506 156.693 154.504 150.586 159.502C141.977 166.55 125.142 168 117 168Z"
          fill={BODY_COLOR}
        />
        <Path
          d="M172.5 116.5C174.5 117.167 178.4 119.9 178 125.5"
          fill="none"
          stroke={BODY_COLOR}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <Path
          d="M178.5 109.5C181.756 110.686 188.105 115.545 187.454 125.5"
          fill="none"
          stroke={BODY_COLOR}
          strokeWidth={3}
          strokeLinecap="round"
        />
      </AnimatedGroup>

      <Path
        d="M118.515 190.875L119.874 150.432C119.901 139.868 118.226 130.149 115.138 120.676C123.718 116.737 130.788 111.911 136.581 105.218C154.674 83.9133 153.137 56.1472 133.176 36.6959C129.332 25.7503 125.228 15.4045 119.256 5.48116C115.783 -0.29834 107.752 -1.94768 102.59 2.72772C96.3989 8.34365 91.3608 14.8183 85.7186 21.1567C78.278 20.407 71.1257 20.5978 63.8362 21.2248C58.1528 14.6956 53.0872 8.28913 46.8272 2.70046C41.6655 -1.90679 33.5934 -0.380125 30.1203 5.46753C24.1898 15.4862 19.9478 25.9139 15.9393 36.8867C9.40474 43.3478 4.51758 50.8584 1.99164 59.7049C-5.90195 85.958 10.5716 111.066 35.4604 121.058C32.1795 137.21 31.5068 153.186 31.7676 169.515L32.0971 190.889C32.9482 198.413 39.167 203.606 46.786 203.961C54.3639 204.315 61.8319 199.203 62.3124 191.475L63.4106 173.727L86.8717 173.387L88.2857 192.279C89.6036 199.912 97.3324 204.52 104.622 203.933C111.912 203.347 118.158 198.181 118.515 190.875Z"
        fill={BODY_COLOR}
      />
      <Path d="M74.96 93.9275C79.9707 94.241 79.7648 89.5519 82.3182 90.547C83.3203 90.9423 83.6498 92.2236 83.0458 93.3141C81.4945 96.0811 78.4057 97.5396 75.413 97.5124C72.4203 97.4851 69.3315 96.0948 67.7665 93.3004C67.2449 92.3735 67.3959 91.2558 68.1509 90.7242C70.4298 89.1021 71.1848 93.6957 74.96 93.9275Z" fill="#050304" />
      <Path d="M137.779 80.2147H131.011C129.652 80.2147 129.02 79.4378 128.993 78.3337C128.966 77.2296 129.666 76.2345 131.121 76.2618L138.191 76.4117C139.179 76.439 139.852 77.6521 139.824 78.32C139.797 79.1788 139.097 80.2147 137.779 80.2147Z" fill="#060607" />
      <Path d="M20.007 80.133L13.2803 80.242C12.0173 80.2693 11.0563 79.4651 11.0014 78.3201C10.9602 77.5159 11.8251 76.3163 12.9782 76.3027L19.705 76.2346C20.8993 76.2346 21.6681 76.9706 21.7916 77.8703C21.9152 78.7699 21.3935 80.1057 20.007 80.133Z" fill="#060405" />
      <Path d="M134.98 89.7155L129.694 88.3251C128.582 88.0389 128.116 87.1665 128.184 86.3078C128.28 85.2173 129.186 84.2631 130.491 84.6039L135.941 86.0761C137.039 86.3759 137.492 87.2347 137.382 88.1343C137.272 89.1294 136.394 90.0835 134.98 89.7155Z" fill="#07070A" />
      <Path d="M16.2865 89.7018C14.9824 90.0835 14.0763 89.3338 13.8018 88.6114C13.4449 87.6299 13.9116 86.5258 14.9961 86.1987L20.3912 84.6039C21.5306 84.2631 22.519 84.9992 22.8073 85.8307C23.2192 87.0302 22.423 87.9298 21.1051 88.3115L16.2865 89.7018Z" fill="#07070A" />
      <Path d="M101.111 88.884C112.203 88.884 121.195 79.9557 121.195 68.942C121.195 57.9283 112.203 49 101.111 49C90.0193 49 81.0273 57.9283 81.0273 68.942C81.0273 79.9557 90.0193 88.884 101.111 88.884Z" fill="white" />
      <Path d="M101.126 84.8902C109.982 84.8902 117.16 77.7621 117.16 68.9693C117.16 60.1764 109.982 53.0484 101.126 53.0484C92.2706 53.0484 85.0918 60.1764 85.0918 68.9693C85.0918 77.7621 92.2706 84.8902 101.126 84.8902Z" fill="#060303" />
      <Path d="M50.004 88.9385C61.1037 88.9385 70.1018 80.0041 70.1018 68.9829C70.1018 57.9617 61.1037 49.0273 50.004 49.0273C38.9043 49.0273 29.9062 57.9617 29.9062 68.9829C29.9062 80.0041 38.9043 88.9385 50.004 88.9385Z" fill="#FDFDFD" />
      <Path d="M50.0031 84.931C58.8662 84.931 66.0511 77.7969 66.0511 68.9965C66.0511 60.1961 58.8662 53.062 50.0031 53.062C41.14 53.062 33.9551 60.1961 33.9551 68.9965C33.9551 77.7969 41.14 84.931 50.0031 84.931Z" fill="#060304" />
      <Path d="M49.7554 64.0349L50.8673 67.4154H54.4503C54.8622 67.4154 55.0269 67.9333 54.6974 68.1787L51.8008 70.2779L52.9128 73.6583C53.0364 74.04 52.5971 74.3671 52.2539 74.1354L49.3573 72.0362L46.4606 74.1354C46.1312 74.3808 45.6782 74.0536 45.8017 73.6583L46.9137 70.2779L44.0171 68.1787C43.6876 67.9333 43.8523 67.4154 44.2642 67.4154H47.8472L48.9591 64.0349C49.0827 63.6532 49.6455 63.6532 49.7691 64.0349H49.7554Z" fill="white" />
      <Path d="M101.539 63.5987L102.651 66.9791H106.234C106.645 66.9791 106.81 67.4971 106.481 67.7425L103.584 69.8416L104.696 73.2221C104.82 73.6038 104.38 73.9309 104.037 73.6992L101.14 71.6L98.2438 73.6992C97.9144 73.9445 97.4614 73.6174 97.5849 73.2221L98.6969 69.8416L95.8003 67.7425C95.4708 67.4971 95.6355 66.9791 96.0474 66.9791H99.6304L100.742 63.5987C100.866 63.217 101.429 63.217 101.552 63.5987H101.539Z" fill="white" />
    </Svg>
  );
}
