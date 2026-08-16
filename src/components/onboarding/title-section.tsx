import { Text, View } from "react-native";

export default function TitleSection({
  title,
  subTitle,
}: {
  title: string;
  subTitle: string;
}) {
  return (
    <View className="w-full gap-1">
      <Text className="text-[24px] font-semibold text-black whitespace-pre-wrap">
        {title}
      </Text>
      <Text className="text-neutral-300 will-change-variable text-[14px] font-medium whitespace-pre-wrap">
        {subTitle}
      </Text>
    </View>
  );
}
