import { useQuery } from "@tanstack/react-query";
import { eventStatisticsQueryOptions } from "../api/EventsQueryOptions";

export function useEventStatistics() {
  return useQuery(eventStatisticsQueryOptions());
}
