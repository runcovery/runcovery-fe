import { Image, View } from "react-native";

export default function CharacterScene() {
  return (
    <View className="h-74.5 mt-30 justify-end w-full items-end pr-8">
      <Image
        source={require("../../../assets/images/character/green-cat.png")}
        className="w-86.75 h-86.5 absolute left-4 -top-10"
      />
      <Image
        source={require("../../../assets/images/character/lying-puple-cat-boarding.png")}
        className="w-32.25 h-19.5"
      />
    </View>
  );
}
