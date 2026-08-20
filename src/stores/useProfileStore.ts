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

    // 루트 레이아웃이 다시 렌더링되어도 같은 앱 실행 중에는 식별자를 유지한다.
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
  // 사용자 식별자는 API 인증에 계속 필요하므로 입력한 프로필 값만 초기화한다.
  resetProfile: () => set({ profile: initialProfile }),
}));
