import type { BoothFilters } from "./BoothApi";

export const boothKeys = {
  all: ["booths"] as const,
  list: (filters: BoothFilters) =>
    [...boothKeys.all, "list", filters] as const,
};
