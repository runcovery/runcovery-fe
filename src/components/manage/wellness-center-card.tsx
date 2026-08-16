import wellnessCenterImage from "@/assets/images/manage/wellness-center.png";
import { ImageBackground, Text, View } from "react-native";
import type { WellnessCenter } from "./wellness-report.types";

interface WellnessCenterCardProps {
  center: WellnessCenter;
}

export default function WellnessCenterCard({
  center,
}: WellnessCenterCardProps) {
  return (
    <ImageBackground
      source={wellnessCenterImage}
      className="h-43 w-43 overflow-hidden rounded-xl"
      imageStyle={{ borderRadius: 12 }}
      resizeMode="cover"
    >
      <View className="absolute inset-0 bg-black/25" />
      <View className="flex-1 justify-end p-4">
        <Text className="text-[17px] font-semibold leading-6 text-white">
          {center.name}
        </Text>
        <Text className="mt-1 text-[11px] font-medium text-white">
          {center.description}
        </Text>
      </View>
    </ImageBackground>
  );
}
