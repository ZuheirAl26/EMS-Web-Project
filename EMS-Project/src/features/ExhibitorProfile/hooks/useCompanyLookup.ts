import { useQuery } from "@tanstack/react-query";
import { getCompanyLookupQueryOptions } from "../api/ProfileQueryOptions";

export function useCompanyLookup() {
  return useQuery(getCompanyLookupQueryOptions());
}
