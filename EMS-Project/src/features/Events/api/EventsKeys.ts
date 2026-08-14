export const eventsKeys = {
  all: ["exhibitor", "events"] as const,
  list: (page: number) => [...eventsKeys.all, "list", page] as const,
  statistics: () => [...eventsKeys.all, "statistics"] as const,
  halls: () => [...eventsKeys.all, "event-halls"] as const,
};
