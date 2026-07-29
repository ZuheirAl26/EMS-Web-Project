import { useQuery } from "@tanstack/react-query";
import { getServices } from "../api/ServiceApi";
import { serviceKeys } from "../api/ServiceKeys";
import type { ServiceFilters } from "../types/serviceType";

export function useServices(filters: ServiceFilters, enabled = true) {
  return useQuery({
    queryKey: serviceKeys.list(filters),
    queryFn: () => getServices(filters),
    enabled,
  });
}
