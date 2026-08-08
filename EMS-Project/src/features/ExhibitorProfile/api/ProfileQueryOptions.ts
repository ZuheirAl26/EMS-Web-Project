import { queryOptions } from "@tanstack/react-query";
import { getCompanyProfile, getExhibitorProfile } from "./ProfileApi";
import { profileKeys } from "./ProfileKeys";
import { isValidCompanyId } from "../utils/validation";

const FIVE_MINUTES = 5 * 60 * 1000;
const THIRTY_MINUTES = 30 * 60 * 1000;

export function getExhibitorProfileQueryOptions() {
  return queryOptions({
    queryKey: profileKeys.exhibitor,
    queryFn: getExhibitorProfile,
    staleTime: FIVE_MINUTES,
    gcTime: THIRTY_MINUTES,
  });
}

export function getCompanyProfileQueryOptions(companyId: number | null) {
  return queryOptions({
    queryKey: profileKeys.company(companyId ?? 0),
    queryFn: () => getCompanyProfile(companyId as number),
    enabled: isValidCompanyId(companyId),
    staleTime: FIVE_MINUTES,
    gcTime: THIRTY_MINUTES,
  });
}
