import { Text, View } from "react-native";
import Label from "../ui/label";

const WText = ({ children }: { children: React.ReactNode }) => {
  return (
    <Text className="text-[18px] font-semibold text-neutral-500 leading-8.5">
      {children}
    </Text>
  );
};

export default function WeatherPreviewCard() {
  return (
    <View className="border border-primary-440 rounded-[22px] bg-primary-50 shadow-[0_2px_4px_rgba(0,0,0,0.08)] px-5 pt-4 pb-8">
      <Label text="달린 날씨" bg="bg-primary-500" />
      <View className="flex-row justify-between mt-4 px-1">
        <View className="flex-row">
          <WText>🌙</WText>
          <WText>UV</WText>
        </View>
        <WText>|</WText>
        <View className="flex-row">
          <WText>🌡️</WText>
          <WText>26°C</WText>
        </View>
        <WText>|</WText>
        <View className="flex-row">
          <WText>💧</WText>
          <WText>습도 60%</WText>
        </View>
      </View>
    </View>
  );
}
