import { useQuery } from "@tanstack/react-query";
import { getMyBooths } from "../api/MyBoothsApi";
import { myBoothsKeys } from "../api/MyBoothsKeys";
const TEN_MINUTES = 10 * 60 * 1000;
const THIRTY_MINUTES = 30 * 60 * 1000;

export function useMyBooths(page: number) {
  return useQuery({
    queryKey: myBoothsKeys.list(page),
    queryFn: () => getMyBooths(page),
    staleTime: TEN_MINUTES,
    gcTime: THIRTY_MINUTES,
  });
}
