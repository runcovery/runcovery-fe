import { create } from "zustand";

interface CameraPermissionState {
  isInitialized: boolean;
  isInitializing: boolean;
  status: null;
  initializePermission: () => Promise<void>;
}

export const useCameraPermissionStore = create<CameraPermissionState>(
  (set) => ({
    isInitialized: true,
    isInitializing: false,
    status: null,
    initializePermission: async () => {
      set({ isInitialized: true, isInitializing: false, status: null });
    },
  }),
);
