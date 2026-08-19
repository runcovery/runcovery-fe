import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { getHome } from "@/apis/home";
import { syncActivity } from "@/apis/activity";
import { createDemoActivitySyncPayload } from "@/lib/activity-sync";
import { useProfileStore } from "@/stores/useProfileStore";
import type { HomeResponse } from "@/types/home";

// Location access is disabled. Keep location-based API contracts working with
// a fixed fallback until the permission feature is restored.
const DEFAULT_LOCATION = {
  lat: 37.5665,
  lon: 126.978,
};

export const useHomeData = () => {
  const isReady = useProfileStore((state) => state.isUserIdInitialized);
  const queryClient = useQueryClient();
  const [data, setData] = useState<HomeResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadHome = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      await syncActivity(createDemoActivitySyncPayload());
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["activity"] }),
        queryClient.invalidateQueries({ queryKey: ["mission"] }),
        queryClient.invalidateQueries({ queryKey: ["goal", "weekly"] }),
        queryClient.invalidateQueries({ queryKey: ["user", "mypage"] }),
      ]);
      const response = await getHome(DEFAULT_LOCATION);
      setData(response.data.data);
    } catch (error) {
      console.error("Failed to load home data.", error);
      setErrorMessage("홈 정보를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [queryClient]);

  useFocusEffect(
    useCallback(() => {
      if (!isReady) return;
      void loadHome();
    }, [isReady, loadHome]),
  );

  return {
    data,
    errorMessage,
    isLoading,
    reload: loadHome,
  };
};
