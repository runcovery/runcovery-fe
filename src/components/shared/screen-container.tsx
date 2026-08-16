import { ReactNode } from "react";
import { View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

interface ScreenContainerProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function ScreenContainer({
  children,
  style,
}: ScreenContainerProps) {
  return (
    <View className="flex-1 w-full px-8 py-16" style={style}>
      {children}
    </View>
  );
}
