import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";

import { getHome } from "@/apis/home";
import type { HomeResponse } from "@/types/home";

export const useHomeData = () => {
  const [data, setData] = useState<HomeResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadHome = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== Location.PermissionStatus.GRANTED) {
        setErrorMessage("홈 정보를 불러오려면 위치 권한이 필요합니다.");
        return;
      }

      const isLocationEnabled = await Location.hasServicesEnabledAsync();

      if (!isLocationEnabled) {
        setErrorMessage("기기의 위치 서비스를 켜주세요.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const response = await getHome({
        lat: location.coords.latitude,
        lon: location.coords.longitude,
      });

      setData(response.data.data);
    } catch (error) {
      console.error("Failed to load home data.", error);
      setErrorMessage("홈 정보를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHome();
  }, [loadHome]);

  return {
    data,
    errorMessage,
    isLoading,
    reload: loadHome,
  };
};
