import { View } from "react-native";

export default function OutlineCard({
  children,
  py = "py-3",
}: {
  children: React.ReactNode;
  py?: string;
}) {
  return (
    <View
      className={`border border-primary-500 rounded-[18px] px-5 ${py} bg-white`}
    >
      {children}
    </View>
  );
}
