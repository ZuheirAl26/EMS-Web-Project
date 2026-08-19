import { apiClient } from "../../../api/ApiClient";
import type { LookupEntity, ApiResponse } from "../../Team&Staff/types/teamsType";
import type { ReviewsResponseData } from "../types/reviewsType";

export const getEventsLookupApi = async (): Promise<LookupEntity[]> => {
  const { data } = await apiClient.get<ApiResponse<LookupEntity[]>>(
    "/v1/exhibitor/lookup/events",
  );
  return data.data || [];
};

export const getEventReviewsApi = async (
  eventId: number,
  page = 1,
  rating?: number | null,
): Promise<ReviewsResponseData> => {
  const params: Record<string, unknown> = { page };
  if (rating !== null && rating !== undefined) {
    params["filter[rating]"] = rating;
  }
  const { data } = await apiClient.get<ApiResponse<ReviewsResponseData>>(
    `/v1/exhibitor/reviews/event/${eventId}`,
    { params },
  );
  return data.data;
};

export const getBoothReviewsApi = async (
  boothId: number,
  page = 1,
  rating?: number | null,
): Promise<ReviewsResponseData> => {
  const params: Record<string, unknown> = { page };
  if (rating !== null && rating !== undefined) {
    params["filter[rating]"] = rating;
  }
  const { data } = await apiClient.get<ApiResponse<ReviewsResponseData>>(
    `/v1/exhibitor/reviews/booth/${boothId}`,
    { params },
  );
  return data.data;
};

export const getBoothReviewStatsApi = async (
  boothId: number,
): Promise<import("../types/reviewsType").ReviewStatsData> => {
  const { data } = await apiClient.get<
    ApiResponse<import("../types/reviewsType").ReviewStatsData>
  >(`/v1/exhibitor/reviews/booth/${boothId}/statistics`);
  return data.data;
};

export const getEventReviewStatsApi = async (
  eventId: number,
): Promise<import("../types/reviewsType").ReviewStatsData> => {
  const { data } = await apiClient.get<
    ApiResponse<import("../types/reviewsType").ReviewStatsData>
  >(`/v1/exhibitor/reviews/event/${eventId}/statistics`);
  return data.data;
};
