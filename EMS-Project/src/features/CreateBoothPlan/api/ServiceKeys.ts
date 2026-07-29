import type { ServiceFilters } from "./ServiceApi";

export const serviceKeys = {
  all: ["exhibitor-services"] as const,
  list: (filters: ServiceFilters) =>
    [...serviceKeys.all, "list", filters] as const,
};
