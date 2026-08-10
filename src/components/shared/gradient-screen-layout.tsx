import { styled } from "nativewind";
import GradientBackground from "../gradient-background";

import { SafeAreaView } from "react-native-safe-area-context";

const StyledSafeAreaView = styled(SafeAreaView);

export default function GradientScreenLayout({
  children,
  offsetY = 0,
}: {
  children: React.ReactNode;
  offsetY?: number;
}) {
  return (
    <>
      <GradientBackground offsetY={offsetY} />
      <StyledSafeAreaView className="flex-1">{children}</StyledSafeAreaView>
    </>
  );
}
