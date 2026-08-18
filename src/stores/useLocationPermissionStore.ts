import * as Location from "expo-location";
import { create } from "zustand";

interface LocationPermissionState {
  isInitialized: boolean;
  isInitializing: boolean;
  status: Location.PermissionStatus | null;
  initializePermission: () => Promise<void>;
}

export const useLocationPermissionStore =
  create<LocationPermissionState>((set, get) => ({
    isInitialized: false,
    isInitializing: false,
    status: null,
    initializePermission: async () => {
      if (get().isInitialized || get().isInitializing) return;

      set({ isInitializing: true });

      try {
        const permission = await Location.requestForegroundPermissionsAsync();

        set({
          isInitialized: true,
          isInitializing: false,
          status: permission.status,
        });
      } catch (error) {
        console.error("Failed to initialize location permission.", error);
        set({ isInitialized: true, isInitializing: false, status: null });
      }
    },
  }));
