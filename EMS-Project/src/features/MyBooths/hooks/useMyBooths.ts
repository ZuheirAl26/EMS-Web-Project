import { useQuery } from "@tanstack/react-query";
import { getMyBooths } from "../api/MyBoothsApi";
import { myBoothsKeys } from "../api/MyBoothsKeys";

export function useMyBooths(page: number) {
  return useQuery({
    queryKey: myBoothsKeys.list(page),
    queryFn: () => getMyBooths(page),
  });
}
