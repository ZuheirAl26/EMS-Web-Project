import type { BoothFilters } from "../types/boothType";

export function normalizeFilters(filters: BoothFilters = {}): BoothFilters {
  return Object.fromEntries(
    Object.entries(filters).filter(
      ([_, value]) => value !== "" && value !== undefined && value !== null,
    ),
  );
}

export const boothKeys = {
  all: ["booths"] as const,
  list: (filters: BoothFilters = {}) =>
    [...boothKeys.all, "list", normalizeFilters(filters)] as const,
};
