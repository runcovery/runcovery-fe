import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getApiErrorMessage } from "@/apis";
import { getHome } from "@/apis/home";
import { syncActivity } from "@/apis/activity";
import { DEFAULT_LOCATION } from "@/constants/location";
import { createDemoActivitySyncPayload } from "@/lib/activity-sync";
import { queryKeys } from "@/lib/query-keys";
import { useProfileStore } from "@/stores/useProfileStore";

export const useHomeData = () => {
  const isReady = useProfileStore((state) => state.isUserIdInitialized);
  const queryClient = useQueryClient();
  const homeQuery = useQuery({
    queryKey: queryKeys.home.detail(
      DEFAULT_LOCATION.lat,
      DEFAULT_LOCATION.lon,
    ),
    enabled: isReady,
    queryFn: async () => {
      // 최초 조회와 사용자의 새로고침에서만 활동을 동기화한다.
      await syncActivity(createDemoActivitySyncPayload());
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.activity.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.mission.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.goal.weekly }),
        queryClient.invalidateQueries({ queryKey: queryKeys.user.all }),
      ]);
      return getHome(DEFAULT_LOCATION);
    },
  });

  return {
    data: homeQuery.data ?? null,
    errorMessage: homeQuery.isError
      ? getApiErrorMessage(homeQuery.error, "홈 정보를 불러오지 못했습니다.")
      : null,
    isLoading: !isReady || homeQuery.isFetching,
    reload: () => homeQuery.refetch(),
  };
};
