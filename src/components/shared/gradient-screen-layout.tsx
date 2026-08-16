import { styled } from "nativewind";
import GradientBackground from "../gradient-background";

import { Edge, SafeAreaView } from "react-native-safe-area-context";

const StyledSafeAreaView = styled(SafeAreaView);

export default function GradientScreenLayout({
  children,
  offsetY = 0,
  edges = ["top", "right", "bottom", "left"],
}: {
  children: React.ReactNode;
  offsetY?: number;
  edges?: Edge[];
}) {
  return (
    <>
      <GradientBackground offsetY={offsetY} />

      <StyledSafeAreaView edges={edges} className="flex-1">
        {children}
      </StyledSafeAreaView>
    </>
  );
}
