import CareStatusSection from "@/components/my/care-status-section";
import MonthlySkinScoreSection from "@/components/my/monthly-skin-score-section";
import ProfileSection from "@/components/my/profile-section";
import SectionDivider from "@/components/my/section-divider";
import WeeklyMissionSection from "@/components/my/weekly-mission-section";
import GradientScreenLayout from "@/components/shared/gradient-screen-layout";
import { ScrollView, Text, View } from "react-native";

export default function MyScreen() {
  return (
    <View className="flex-1">
      <GradientScreenLayout offsetY={120} edges={["left", "right"]}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 32,
            paddingTop: 64,
            paddingBottom: 36,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="w-full text-center text-[16px] font-semibold text-black">
            마이페이지
          </Text>

          <ProfileSection />
          <SectionDivider />
          <WeeklyMissionSection />
          <SectionDivider />
          <CareStatusSection />
          <SectionDivider />

          <MonthlySkinScoreSection />
        </ScrollView>
      </GradientScreenLayout>
    </View>
  );
}
