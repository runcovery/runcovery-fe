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

      // 화면의 단계별 뒤로가기 규칙을 Android 하드웨어 버튼에도 동일하게 적용한다.
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
        {/* 공통 헤더 */}
        <ScreenHeader title={title} onBack={onBack} />
        {/* 단계별 화면 콘텐츠 */}
        {children}
      </ScreenContainer>
    </GradientScreenLayout>
  );
}
