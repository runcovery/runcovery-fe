import { useState } from "react";

import { createUser } from "@/apis/user";
import { ENABLE_ONBOARDING_API } from "@/constants/featureFlags";
import { useProfileStore } from "@/stores/useProfileStore";
import { getApiErrorMessage } from "@/apis";

export const useOnboardingRegistration = () => {
  const profile = useProfileStore((state) => state.profile);
  const userId = useProfileStore((state) => state.userId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const registerUser = async () => {
    if (!ENABLE_ONBOARDING_API) return true;
    if (!userId || !profile.gender) return false;

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await createUser({
        payload: {
          ...profile,
          gender: profile.gender,
          userId,
        },
      });

      return true;
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "사용자 정보를 등록하지 못했습니다."));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    errorMessage,
    profile,
    registerUser,
  };
};
