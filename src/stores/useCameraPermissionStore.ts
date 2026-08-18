import { Camera, PermissionStatus } from "expo-camera";
import { create } from "zustand";

interface CameraPermissionState {
  isInitialized: boolean;
  isInitializing: boolean;
  status: PermissionStatus | null;
  initializePermission: () => Promise<void>;
}

export const useCameraPermissionStore = create<CameraPermissionState>(
  (set, get) => ({
    isInitialized: false,
    isInitializing: false,
    status: null,
    initializePermission: async () => {
      if (get().isInitialized || get().isInitializing) return;

      set({ isInitializing: true });

      try {
        const permission = await Camera.requestCameraPermissionsAsync();

        set({
          isInitialized: true,
          isInitializing: false,
          status: permission.status,
        });
      } catch (error) {
        console.error("Failed to initialize camera permission.", error);
        set({ isInitialized: true, isInitializing: false, status: null });
      }
    },
  }),
);
