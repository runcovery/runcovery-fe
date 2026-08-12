import { Text, View } from "react-native";

export default function Label({ text, bg }: { text: string; bg: string }) {
  return (
    <View className={`${bg} rounded-lg items-center justify-center py-1 w-20`}>
      <Text className="text-[10px] font-semibold text-white">{text}</Text>
    </View>
  );
}
