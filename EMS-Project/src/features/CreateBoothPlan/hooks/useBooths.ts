import { useQuery } from "@tanstack/react-query";
import { getBooths, type BoothFilters } from "../api/BoothApi";
import { boothKeys } from "../api/BoothKeys";

export function useBooths(filters: BoothFilters) {
  return useQuery({
    queryKey: boothKeys.list(filters),
    queryFn: () => getBooths(filters),
  });
}
