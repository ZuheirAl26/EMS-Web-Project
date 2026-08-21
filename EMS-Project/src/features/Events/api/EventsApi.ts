import { apiClient } from "../../../api/ApiClient";
import type {
  EventHallsResponse,
  EventRequestPayload,
  EventRequestResponse,
  EventFilterStatus,
  EventsResponse,
  EventStatisticsResponse,
  NearestEventsResponse,
} from "../types/eventType";

export async function getEvents(
  page: number,
  status: EventFilterStatus | null,
): Promise<EventsResponse> {
  const response = await apiClient.get<EventsResponse>("/v1/exhibitor/events", {
    params: status ? { page, "filter[status]": status } : { page },
  });
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

export async function getEventHalls(): Promise<EventHallsResponse> {
  const response = await apiClient.get<EventHallsResponse>(
    "/v1/exhibitor/eventHall",
  );
  if (!response.data.status) {
    throw new Error(
      response.data.message || "The event halls could not be retrieved.",
    );
  }
  return response.data;
}

export async function requestEvent(
  payload: EventRequestPayload,
): Promise<EventRequestResponse> {
  const formData = new FormData();
  formData.append("event_hall_id", String(payload.event_hall_id));
  if (payload.company_id) {
    formData.append("company_id", payload.company_id);
  }
  formData.append("type", payload.type);
  formData.append("title", payload.title);
  formData.append("description", payload.description);
  formData.append("start_at", payload.start_at);
  formData.append("duration", String(payload.duration));
  payload.speakers.forEach((speaker, index) => {
    formData.append(`speakers[${index}][name]`, speaker.name);
  });
  if (payload.logo) {
    formData.append("logo", payload.logo, payload.logo.name);
  }

  const response = await apiClient.post<EventRequestResponse>(
    "/v1/exhibitor/events",
    formData,
    {
      headers: {
        "Content-Type": undefined,
      },
    },
  );
  if (!response.data.status) {
    throw new Error(
      response.data.message || "The event request could not be submitted.",
    );
  }
  return response.data;
}

export async function getNearestEvents(): Promise<NearestEventsResponse> {
  const response = await apiClient.get<NearestEventsResponse>(
    "/v1/exhibitor/events/nearest",
  );
  if (!response.data.status) {
    throw new Error(
      response.data.message || "The nearest events could not be retrieved.",
    );
  }
  return response.data;
}
