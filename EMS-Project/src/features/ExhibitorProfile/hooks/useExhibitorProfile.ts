import { useQuery } from "@tanstack/react-query";
import { getExhibitorProfile } from "../api/ProfileApi";
import { profileKeys } from "../api/ProfileKeys";

export function useExhibitorProfile() {
  return useQuery({
    queryKey: profileKeys.exhibitor,
    queryFn: getExhibitorProfile,
  });
}
