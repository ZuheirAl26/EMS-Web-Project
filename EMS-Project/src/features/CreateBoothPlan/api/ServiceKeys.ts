import type { ServiceFilters } from "../types/serviceType";

export const serviceKeys = {
  all: ["exhibitor-services"] as const,
  list: (filters: ServiceFilters) =>
    [...serviceKeys.all, "list", filters] as const,
};
