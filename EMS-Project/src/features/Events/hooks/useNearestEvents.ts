import { useQuery } from "@tanstack/react-query";
import { nearestEventsQueryOptions } from "../api/EventsQueryOptions";

export function useNearestEvents() {
  return useQuery(nearestEventsQueryOptions());
}
