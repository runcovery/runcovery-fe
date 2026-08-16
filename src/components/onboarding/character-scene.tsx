import { Image, useWindowDimensions, View } from "react-native";

export default function CharacterScene() {
  const { width } = useWindowDimensions();
  const scale = Math.min(1, (width - 64) / 347);

  return (
    <View
      className="mt-8 justify-end w-full items-end"
      style={{ height: 298 * scale, paddingRight: 32 * scale }}
    >
      <Image
        source={require("../../../assets/images/character/green-cat.png")}
        className="absolute"
        style={{
          width: 347 * scale,
          height: 346 * scale,
          left: -44 * scale,
          top: -40 * scale,
        }}
        resizeMode="contain"
      />
      <Image
        source={require("../../../assets/images/character/lying-puple-cat-boarding.png")}
        style={{ width: 129 * scale, height: 78 * scale }}
        resizeMode="contain"
      />
    </View>
  );
}
