import { useQuery } from "@tanstack/react-query";
import { getServices, type ServiceFilters } from "../api/ServiceApi";
import { serviceKeys } from "../api/ServiceKeys";

export function useServices(filters: ServiceFilters, enabled = true) {
  return useQuery({
    queryKey: serviceKeys.list(filters),
    queryFn: () => getServices(filters),
    enabled,
  });
}
