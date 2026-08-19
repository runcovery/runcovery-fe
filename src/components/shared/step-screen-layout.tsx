import { ReactNode, useCallback } from "react";
import { BackHandler, type StyleProp, type ViewStyle } from "react-native";
import { Edge } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import GradientScreenLayout from "./gradient-screen-layout";
import ScreenContainer from "./screen-container";
import ScreenHeader from "./screen-header";

interface StepScreenLayoutProps {
  children: ReactNode;
  title?: string;
  onBack?: () => void;
  offsetY?: number;
  edges?: Edge[];
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export default function StepScreenLayout({
  children,
  title,
  onBack,
  offsetY = 120,
  edges,
  contentContainerStyle,
}: StepScreenLayoutProps) {
  useFocusEffect(
    useCallback(() => {
      if (!onBack) return undefined;

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          onBack();
          return true;
        },
      );

      return () => subscription.remove();
    }, [onBack]),
  );

  return (
    <GradientScreenLayout offsetY={offsetY} edges={edges}>
      <ScreenContainer style={contentContainerStyle}>
        <ScreenHeader title={title} onBack={onBack} />
        {children}
      </ScreenContainer>
    </GradientScreenLayout>
  );
}
