import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getBoothQueryOptions } from "../api/BoothQueryOptions";

export function usePrefetchBooths() {
  const queryClient = useQueryClient();

  return useCallback(() => {
    void queryClient.prefetchQuery(getBoothQueryOptions({}));
  }, [queryClient]);
}
