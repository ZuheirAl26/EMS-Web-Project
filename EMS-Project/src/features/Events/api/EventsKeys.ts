import type { EventFilterStatus } from "../types/eventType";

export const eventsKeys = {
  all: ["exhibitor", "events"] as const,
  list: (page: number, status: EventFilterStatus | null) =>
    [...eventsKeys.all, "list", status ?? "all", page] as const,
  statistics: () => [...eventsKeys.all, "statistics"] as const,
};
