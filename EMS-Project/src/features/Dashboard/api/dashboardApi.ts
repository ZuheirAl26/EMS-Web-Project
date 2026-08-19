import { apiClient } from "../../../api/ApiClient";
import type { ApiResponse } from "../../Team&Staff/types/teamsType";
import type {
  AnnouncementsResponseData,
  BoothStatisticsData,
  DetailedBoothData,
  LeadsResponseData,
} from "../types/dashboardType";

export const getSingleBoothApi = async (
  boothId: number,
): Promise<DetailedBoothData> => {
  const { data } = await apiClient.get<ApiResponse<DetailedBoothData>>(
    `/v1/exhibitor/booth/${boothId}`,
  );
  return data.data;
};

export const getBoothStatisticsApi = async (
  boothId: number,
): Promise<BoothStatisticsData> => {
  const { data } = await apiClient.get<ApiResponse<BoothStatisticsData>>(
    `/v1/exhibitor/booth/${boothId}/statistics`,
  );
  return data.data;
};

export const getBoothLeadsApi = async (
  boothId: number,
  page = 1,
): Promise<LeadsResponseData> => {
  const { data } = await apiClient.get<ApiResponse<LeadsResponseData>>(
    `/v1/exhibitor/leads/booths/${boothId}`,
    { params: { page } },
  );
  return data.data;
};

export const getEventLeadsApi = async (
  eventId: number,
  page = 1,
): Promise<LeadsResponseData> => {
  const { data } = await apiClient.get<ApiResponse<LeadsResponseData>>(
    `/v1/exhibitor/leads/events/${eventId}`,
    { params: { page } },
  );
  return data.data;
};

export const getAnnouncementsApi = async (
  perPage = 5,
  page = 1,
): Promise<AnnouncementsResponseData> => {
  const { data } = await apiClient.get<ApiResponse<AnnouncementsResponseData>>(
    "/v1/exhibitor/announcements",
    { params: { per_page: perPage, page } },
  );
  return data.data;
};
