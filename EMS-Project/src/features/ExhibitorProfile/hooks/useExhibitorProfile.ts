import { useQuery } from "@tanstack/react-query";
import { getExhibitorProfileQueryOptions } from "../api/ProfileQueryOptions";

export function useExhibitorProfile() {
  return useQuery(getExhibitorProfileQueryOptions());
}
