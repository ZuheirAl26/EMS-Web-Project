import { useQuery } from "@tanstack/react-query";
import { getCompanyProfileQueryOptions } from "../api/ProfileQueryOptions";

export function useCompanyProfile(companyId: number | null) {
  return useQuery(getCompanyProfileQueryOptions(companyId));
}
