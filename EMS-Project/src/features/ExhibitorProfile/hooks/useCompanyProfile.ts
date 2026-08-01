import { useQuery } from "@tanstack/react-query";
import { getCompanyProfile } from "../api/ProfileApi";
import { profileKeys } from "../api/ProfileKeys";
import { isValidCompanyId } from "../utils/validation";

export function useCompanyProfile(companyId: number | null) {
  return useQuery({
    queryKey: profileKeys.company(companyId ?? 0),
    queryFn: () => getCompanyProfile(companyId as number),
    enabled: isValidCompanyId(companyId),
  });
}
