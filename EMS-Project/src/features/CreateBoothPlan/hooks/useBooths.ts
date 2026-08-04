import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getBoothQueryOptions } from "../api/BoothQueryOptions";
import type { BoothFilters } from "../types/boothType";

export function useBooths(filters: BoothFilters) {
  return useQuery({
    ...getBoothQueryOptions(filters),
    placeholderData: keepPreviousData,
  });
}
