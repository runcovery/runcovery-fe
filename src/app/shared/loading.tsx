import TitleSection from "@/components/onboarding/title-section";
import { Image, Text, View } from "react-native";

interface LoadingScreenProps {
  title: string;
  subTitle: string;
  text: string;
}

export default function LoadigScreen({
  title,
  subTitle,
  text,
}: LoadingScreenProps) {
  return (
    <View className="flex-1 w-full">
      <View className="mt-3">
        <TitleSection title={title} subTitle={subTitle} />
      </View>
      <View className="w-full items-center gap-21 mt-44">
        <Image
          source={require("../../../assets/images/character/goal-pink-cat.png")}
          className="w-43 h-51"
          resizeMode="contain"
        />
        <Text className="text-[14px] font-medium text-neutral-700">{text}</Text>
      </View>
    </View>
  );
}
