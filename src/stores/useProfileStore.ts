import { create } from "zustand";

export interface Profile {
  nickname: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
}

type ProfileField = keyof Profile;

interface ProfileStore {
  profile: Profile;
  setProfileField: (field: ProfileField, value: string) => void;
  resetProfile: () => void;
}

const initialProfile: Profile = {
  nickname: "",
  age: "",
  gender: "",
  height: "",
  weight: "",
};

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: initialProfile,
  setProfileField: (field, value) =>
    set((state) => ({
      profile: {
        ...state.profile,
        [field]: value,
      },
    })),
  resetProfile: () => set({ profile: initialProfile }),
}));
