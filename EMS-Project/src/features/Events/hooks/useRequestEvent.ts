import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestEvent } from "../api/EventsApi";
import { eventsKeys } from "../api/EventsKeys";
import type { EventRequestPayload } from "../types/eventType";

export function useRequestEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EventRequestPayload) => requestEvent(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: eventsKeys.all }),
        queryClient.invalidateQueries({ queryKey: eventsKeys.halls() }),
      ]);
    },
  });
}
