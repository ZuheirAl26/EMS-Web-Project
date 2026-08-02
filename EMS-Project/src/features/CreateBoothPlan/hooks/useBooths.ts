import { useQuery } from "@tanstack/react-query";
import { getBooths } from "../api/BoothApi";
import { boothKeys } from "../api/BoothKeys";
import type { BoothFilters } from "../types/boothType";

export function useBooths(filters: BoothFilters) {
  return useQuery({
    queryKey: boothKeys.list(filters),
    queryFn: () => getBooths(filters),
  });
}
