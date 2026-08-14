import { useQuery } from "@tanstack/react-query";
import { getEventHalls } from "../api/EventsApi";
import { eventsKeys } from "../api/EventsKeys";

export function useEventHalls() {
  return useQuery({
    queryKey: eventsKeys.halls(),
    queryFn: getEventHalls,
    staleTime: 5 * 60 * 1000,
  });
}
