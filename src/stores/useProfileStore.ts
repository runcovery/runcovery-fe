import { create } from "zustand";

import type { UserProfile } from "@/types/user";
import { createRandomUuid } from "@/utils/createRandomUuid";

type ProfileField = keyof UserProfile;

interface ProfileStore {
  userId: string | null;
  isUserIdInitialized: boolean;
  profile: UserProfile;
  initializeUserId: () => string;
  setProfileField: <Field extends ProfileField>(
    field: Field,
    value: UserProfile[Field],
  ) => void;
  resetProfile: () => void;
}

const initialProfile: UserProfile = {
  runningExperience: "",
  nickname: "",
  age: 0,
  gender: "",
  height: 0,
  weight: 0,
};

export const useProfileStore = create<ProfileStore>((set, get) => ({
  userId: null,
  isUserIdInitialized: false,
  profile: initialProfile,
  initializeUserId: () => {
    const existingUserId = get().userId;

    if (get().isUserIdInitialized && existingUserId) {
      return existingUserId;
    }

    const userId = createRandomUuid();

    set({ userId, isUserIdInitialized: true });

    return userId;
  },
  setProfileField: (field, value) =>
    set((state) => ({
      profile: {
        ...state.profile,
        [field]: value,
      },
    })),
  resetProfile: () => set({ profile: initialProfile }),
}));
