import { LinearGradient } from "expo-linear-gradient";
import {
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface CareCenterCardProps {
  title: string;
  subTitle: string;
  img: ImageSourcePropType;
}

export default function CareCenterCard({
  title,
  subTitle,
  img,
}: CareCenterCardProps) {
  return (
    <ImageBackground
      source={img}
      resizeMode="cover"
      className="h-40 w-40 overflow-hidden rounded-2xl"
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.02)", "rgba(0,0,0,0.68)"]}
        locations={[0.35, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View className="absolute inset-x-4 bottom-4 gap-1.5">
        <Text className="text-[18px] font-semibold text-white" numberOfLines={1}>
          {title}
        </Text>
        <Text className="text-[12px] font-medium text-white" numberOfLines={1}>
          {subTitle}
        </Text>
      </View>
    </ImageBackground>
  );
}
