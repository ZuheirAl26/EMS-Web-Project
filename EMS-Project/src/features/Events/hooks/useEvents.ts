import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getEvents } from "../api/EventsApi";
import { eventsKeys } from "../api/EventsKeys";

export function useEvents(page: number) {
  return useQuery({
    queryKey: eventsKeys.list(page),
    queryFn: () => getEvents(page),
    placeholderData: keepPreviousData,
  });
}
