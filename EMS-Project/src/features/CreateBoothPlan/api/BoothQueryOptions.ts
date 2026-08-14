import { queryOptions } from "@tanstack/react-query";
import type { BoothFilters } from "../types/boothType";
import { getBooths } from "./BoothApi";
import { boothKeys } from "./BoothKeys";

const TWO_MINUTES = 2 * 60 * 1000;
const FIVE_MINUTES = 5 * 60 * 1000;

export function getBoothQueryOptions(filters: BoothFilters) {
  return queryOptions({
    queryKey: boothKeys.list(filters),
    queryFn: ({ signal }) => getBooths(filters, signal),
    staleTime: TWO_MINUTES,
    gcTime: FIVE_MINUTES,
    retry: 1,
  });
}
