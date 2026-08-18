import { useState } from "react";

import { createUser } from "@/apis/user";
import { ENABLE_ONBOARDING_API } from "@/constants/featureFlags";
import { useProfileStore } from "@/stores/useProfileStore";

export const useOnboardingRegistration = () => {
  const profile = useProfileStore((state) => state.profile);
  const userId = useProfileStore((state) => state.userId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const registerUser = async () => {
    if (!ENABLE_ONBOARDING_API) return true;
    if (!userId || !profile.gender) return false;

    try {
      setIsSubmitting(true);
      await createUser({
        payload: {
          ...profile,
          gender: profile.gender,
          userId,
        },
      });

      return true;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    profile,
    registerUser,
  };
};
