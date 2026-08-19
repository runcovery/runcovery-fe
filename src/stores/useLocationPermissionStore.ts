import { create } from "zustand";

interface LocationPermissionState {
  isInitialized: boolean;
  isInitializing: boolean;
  status: null;
  initializePermission: () => Promise<void>;
}

export const useLocationPermissionStore = create<LocationPermissionState>(
  (set) => ({
    isInitialized: true,
    isInitializing: false,
    status: null,
    initializePermission: async () => {
      set({ isInitialized: true, isInitializing: false, status: null });
    },
  }),
);
