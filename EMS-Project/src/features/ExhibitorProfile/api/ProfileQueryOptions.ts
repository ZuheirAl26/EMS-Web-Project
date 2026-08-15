import { queryOptions } from "@tanstack/react-query";
import {
  getCompanyLookup,
  getCompanyProfile,
  getExhibitorProfile,
} from "./ProfileApi";
import { profileKeys } from "./ProfileKeys";
import { isValidCompanyId } from "../utils/validation";
import type { ProfileCompanyOption } from "../types/profileType";
import {
  readCachedExhibitorProfile,
  writeCachedExhibitorProfile,
} from "../utils/profileCache";

const FIVE_MINUTES = 5 * 60 * 1000;
const THIRTY_MINUTES = 30 * 60 * 1000;

export function getExhibitorProfileQueryOptions() {
  return queryOptions({
    queryKey: profileKeys.exhibitor,
    queryFn: async () => {
      const response = await getExhibitorProfile();
      writeCachedExhibitorProfile(response.data);
      return response;
    },
    initialData: () => {
      const cached = readCachedExhibitorProfile();
      return cached
        ? { status: true, message: "cached", data: cached }
        : undefined;
    },
    initialDataUpdatedAt: 0,
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

export function getCompanyLookupQueryOptions() {
  return queryOptions({
    queryKey: profileKeys.companyLookup,
    queryFn: getCompanyLookup,
    staleTime: FIVE_MINUTES,
    gcTime: THIRTY_MINUTES,
    select: (
      response,
    ): { status: boolean; message: string; data: ProfileCompanyOption[] } => ({
      status: response.status,
      message: response.message,
      data: response.data.map((option) => ({
        id: option.id,
        name:
          option.name?.trim() ||
          option.label?.trim() ||
          String(option.id),
      })),
    }),
  });
}
