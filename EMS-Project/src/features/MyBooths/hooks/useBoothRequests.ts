import { useQuery } from "@tanstack/react-query";
import { getBoothRequests } from "../api/MyBoothsApi";
import { myBoothsKeys } from "../api/MyBoothsKeys";
import type { BoothRequestStatus } from "../types/myBoothsType";

const TEN_MINUTES = 10 * 60 * 1000;
const THIRTY_MINUTES = 30 * 60 * 1000;

export function useBoothRequests(
  page: number,
  status: BoothRequestStatus | null,
) {
  return useQuery({
    queryKey: myBoothsKeys.requests(page, status ?? "pending"),
    queryFn: () => getBoothRequests(page, status ?? "pending"),
    enabled: status !== null,
    staleTime: TEN_MINUTES,
    gcTime: THIRTY_MINUTES,
  });
}