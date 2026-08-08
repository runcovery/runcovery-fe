import Button from "@/components/ui/Button";
import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <View className="flex-1">
      <LinearGradient
        pointerEvents="none"
        colors={[
          "rgba(167, 187, 251, 0.287)",
          "rgba(163, 125, 245, 0.245)",
          "rgba(112, 125, 242, 0.7)",
        ]}
        locations={[0.3211, 0.5551, 0.8389]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView className="flex-1 items-center justify-center">
        <View
          className="items-center"
          style={{ transform: [{ translateY: -40 }] }}
        >
          <Image
            source={require("../../assets/images/logo.png")}
            className="h-[152px] w-[190px]"
            resizeMode="contain"
          />

          <Image
            source={require("@/assets/images/logo-text.png")}
            className="w-37.5 h-6.75"
          />

          <Button isMid={false}>시작하기</Button>
        </View>
      </SafeAreaView>
    </View>
  );
}
