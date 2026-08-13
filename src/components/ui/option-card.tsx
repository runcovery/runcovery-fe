import { Text, View } from "react-native";

export default function OptionCard({
  py = "py-4",
  content,
}: {
  py?: string;
  content: string;
}) {
  return (
    <View
      className={`${py} border border-primary-440 rounded-2xl bg-white px-6`}
    >
      <Text className="text-black text-[14px] font-semibold">{content}</Text>
    </View>
  );
}
