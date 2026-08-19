import TitleSection from "@/components/onboarding/title-section";
import GradientScreenLayout from "@/components/shared/gradient-screen-layout";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/input-field";
import { useProfileStore } from "@/stores/useProfileStore";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";

export default function ProfileSetupScreen() {
  const profile = useProfileStore((state) => state.profile);
  const setProfileField = useProfileStore((state) => state.setProfileField);
  const scrollViewRef = useRef<ScrollView>(null);
  const focusedBottomFieldRef = useRef<"height" | "weight" | null>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [genderInput, setGenderInput] = useState(
    profile.gender === "male" ? "남" : profile.gender === "female" ? "여" : "",
  );

  const handleGenderChange = (value: string) => {
    const normalizedValue = value.trim().toLowerCase();

    setGenderInput(value);

    if (
      normalizedValue === "남" ||
      normalizedValue === "남성" ||
      normalizedValue === "남자" ||
      normalizedValue === "male"
    ) {
      setProfileField("gender", "male");
    } else if (
      normalizedValue === "여" ||
      normalizedValue === "여성" ||
      normalizedValue === "여자" ||
      normalizedValue === "female"
    ) {
      setProfileField("gender", "female");
    } else {
      setProfileField("gender", "");
    }
  };

  const isProfileComplete =
    profile.nickname.trim().length > 0 &&
    profile.age > 0 &&
    profile.gender !== "" &&
    profile.height > 0 &&
    profile.weight > 0;

  const scrollToBottomFields = (field: "height" | "weight") => {
    focusedBottomFieldRef.current = field;

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardVisible(true);

      if (focusedBottomFieldRef.current) {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 50);
      }
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      focusedBottomFieldRef.current = null;
      setIsKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <GradientScreenLayout offsetY={120}>
        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 32,
            paddingTop: 64,
            paddingBottom: isKeyboardVisible ? 420 : 120,
          }}
          automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => {
            if (
              isKeyboardVisible &&
              focusedBottomFieldRef.current === "weight"
            ) {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1">
            <View className="items-center gap-6">
            {/* 타이틀 */}
            <TitleSection
              title="사용자님에 대해서 알려주세요."
              subTitle="자세한 작성은 사용자에게 더 좋은 관리를 제공합니다."
            />

            {/* 인풋 폼 */}
            <View className="w-full gap-5">
              <InputField
                label="닉네임"
                placeholder="닉네임을 입력해 주세요."
                value={profile.nickname}
                onChangeText={(value) => setProfileField("nickname", value)}
              />
              <InputField
                label="나이"
                placeholder="나이를 입력해 주세요."
                value={profile.age > 0 ? String(profile.age) : ""}
                onChangeText={(value) =>
                  setProfileField("age", Number(value) || 0)
                }
                keyboardType="number-pad"
              />
              <InputField
                label="성별"
                placeholder="성별을 입력해 주세요."
                value={genderInput}
                onChangeText={handleGenderChange}
              />
              <InputField
                label="키"
                placeholder="키를 입력해 주세요."
                value={profile.height > 0 ? String(profile.height) : ""}
                onChangeText={(value) =>
                  setProfileField("height", Number(value) || 0)
                }
                keyboardType="decimal-pad"
                onFocus={() => scrollToBottomFields("height")}
              />
              <InputField
                label="몸무게"
                placeholder="몸무게를 입력해 주세요."
                value={profile.weight > 0 ? String(profile.weight) : ""}
                onChangeText={(value) =>
                  setProfileField("weight", Number(value) || 0)
                }
                keyboardType="decimal-pad"
                onFocus={() => scrollToBottomFields("weight")}
              />
            </View>

            {/* 버튼 */}
            <Button
              disabled={!isProfileComplete}
              onPress={() => router.push("/onboarding/experience")}
            >
              다음
            </Button>
            </View>
          </View>
        </ScrollView>
      </GradientScreenLayout>
    </KeyboardAvoidingView>
  );
}
