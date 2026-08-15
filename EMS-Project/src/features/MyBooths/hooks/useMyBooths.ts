import { useQuery } from "@tanstack/react-query";
import { getMyBooths } from "../api/MyBoothsApi";
import { myBoothsKeys } from "../api/MyBoothsKeys";
import type { MyBoothStatus } from "../types/myBoothsType";

const TEN_MINUTES = 10 * 60 * 1000;
const THIRTY_MINUTES = 30 * 60 * 1000;

export function useMyBooths(
  page: number,
  status: MyBoothStatus | null = null,
) {
  return useQuery({
    queryKey: myBoothsKeys.list(page, status),
    queryFn: () => getMyBooths(page, status),
    staleTime: TEN_MINUTES,
    gcTime: THIRTY_MINUTES,
  });
}
