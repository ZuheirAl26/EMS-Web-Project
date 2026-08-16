import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getEvents, getEventStatistics } from "./EventsApi";
import { eventsKeys } from "./EventsKeys";
import type { EventFilterStatus } from "../types/eventType";

const EVENTS_STALE_TIME = 30_000;
const EVENTS_GC_TIME = 5 * 60_000;
const EVENT_STATISTICS_GC_TIME = 10 * 60_000;

export function eventsListQueryOptions(
  page: number,
  status: EventFilterStatus | null,
) {
  return queryOptions({
    queryKey: eventsKeys.list(page, status),
    queryFn: () => getEvents(page, status),
    placeholderData: keepPreviousData,
    staleTime: EVENTS_STALE_TIME,
    gcTime: EVENTS_GC_TIME,
    refetchOnWindowFocus: false,
    retry: 2,
  });
}

export function eventStatisticsQueryOptions() {
  return queryOptions({
    queryKey: eventsKeys.statistics(),
    queryFn: getEventStatistics,
    staleTime: EVENTS_STALE_TIME,
    gcTime: EVENT_STATISTICS_GC_TIME,
    refetchOnWindowFocus: false,
    retry: 2,
  });
}
