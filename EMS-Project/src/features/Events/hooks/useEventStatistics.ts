import { useQuery } from "@tanstack/react-query";
import { getEventStatistics } from "../api/EventsApi";
import { eventsKeys } from "../api/EventsKeys";

export function useEventStatistics() {
  return useQuery({
    queryKey: eventsKeys.statistics(),
    queryFn: getEventStatistics,
  });
}
