import { queryOptions } from "@tanstack/react-query";
import type { BoothFilters } from "../types/boothType";
import { getBooths } from "./BoothApi";
import { boothKeys } from "./BoothKeys";

const TEN_MINUTES = 10 * 60 * 1000;
const THIRTY_MINUTES = 30 * 60 * 1000;

export function getBoothQueryOptions(filters: BoothFilters) {
  return queryOptions({
    queryKey: boothKeys.list(filters),
    queryFn: ({ signal }) => getBooths(filters, signal),
    staleTime: TEN_MINUTES,
    gcTime: THIRTY_MINUTES,
    retry: 1,
  });
}
