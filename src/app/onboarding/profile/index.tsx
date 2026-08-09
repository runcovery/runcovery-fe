import GradientBackground from "@/components/gradient-background";
import TitleSection from "@/components/onboarding/title-section";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/input-field";
import { useProfileStore } from "@/stores/useProfileStore";
import { router } from "expo-router";
import { styled } from "nativewind";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const StyledSafeAreaView = styled(SafeAreaView);

export default function ProfileSetupScreen() {
  const profile = useProfileStore((state) => state.profile);
  const setProfileField = useProfileStore((state) => state.setProfileField);

  return (
    <View className="justify-center flex-1 px-8">
      <GradientBackground offsetY={120} />
      <StyledSafeAreaView className="flex-1">
        <View className="items-center justify-between flex-1 py-16 ">
          <TitleSection
            title="사용자님에 대해서 알려주세요."
            subTitle="자세한 작성은 사용자에게 더 좋은 관리르 제공합니다."
          />

          <View className="w-full gap-5 flex-1 mt-5 ">
            <InputField
              label="닉네임"
              placeholder="닉네임을 입력해주세요."
              value={profile.nickname}
              onChangeText={(value) => setProfileField("nickname", value)}
            />
            <InputField
              label="나이"
              placeholder="나이를 입력해주세요."
              value={profile.age}
              onChangeText={(value) => setProfileField("age", value)}
              keyboardType="number-pad"
            />
            <InputField
              label="성별"
              placeholder="성별을 입력해주세요."
              value={profile.gender}
              onChangeText={(value) => setProfileField("gender", value)}
            />
            <InputField
              label="키"
              placeholder="키를 입력해주세요."
              value={profile.height}
              onChangeText={(value) => setProfileField("height", value)}
              keyboardType="decimal-pad"
            />
            <InputField
              label="몸무게"
              placeholder="몸무게를 입력해주세요."
              value={profile.weight}
              onChangeText={(value) => setProfileField("weight", value)}
              keyboardType="decimal-pad"
            />
          </View>
          <Button onPress={() => router.push("/onboarding/experience")}>
            다음
          </Button>
        </View>
      </StyledSafeAreaView>
    </View>
  );
}
