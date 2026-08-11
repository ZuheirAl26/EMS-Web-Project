import { useQuery } from "@tanstack/react-query";
import { eventsListQueryOptions } from "../api/EventsQueryOptions";

export function useEvents(page: number) {
  return useQuery(eventsListQueryOptions(page));
}
