import { useQuery } from "@tanstack/react-query";
import { eventsListQueryOptions } from "../api/EventsQueryOptions";
import type { EventFilterStatus } from "../types/eventType";

export function useEvents(
  page: number,
  status: EventFilterStatus | null = null,
) {
  return useQuery(eventsListQueryOptions(page, status));
}
