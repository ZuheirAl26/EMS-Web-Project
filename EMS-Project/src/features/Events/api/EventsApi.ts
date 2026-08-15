import { apiClient } from "../../../api/ApiClient";
import type {
  EventFilterStatus,
  EventsResponse,
  EventStatisticsResponse,
} from "../types/eventType";

export async function getEvents(
  page: number,
  status: EventFilterStatus | null,
): Promise<EventsResponse> {
  const response = await apiClient.get<EventsResponse>(
    "/v1/exhibitor/events",
    {
      params: status ? { page, "filter[status]": status } : { page },
    },
  );

  if (!response.data.status) {
    throw new Error(
      response.data.message || "The events could not be retrieved.",
    );
  }

  return response.data;
}

export async function getEventStatistics(): Promise<EventStatisticsResponse> {
  const response = await apiClient.get<EventStatisticsResponse>(
    "/v1/exhibitor/events/statistics",
  );

  if (!response.data.status) {
    throw new Error(
      response.data.message || "The event statistics could not be retrieved.",
    );
  }

  return response.data;
}
