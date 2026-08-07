import { apiClient } from "../../../api/ApiClient";
import type { BoothFilters, BoothListResponse } from "../types/boothType";

export async function getBooths(
  filters: BoothFilters,
  signal?: AbortSignal,
): Promise<BoothListResponse> {
  const response = await apiClient.get<BoothListResponse>(
    "/v1/exhibitor/booth",
    {
      signal,
      params: {
        "filter[number]": filters.number || undefined,
        "filter[booked]": filters.booked,
        "filter[hall_type]": filters.hallType || undefined,
        include: filters.include || undefined,
        sort: filters.sort || undefined,
      },
    },
  );

  if (!response.data.status) {
    throw new Error(response.data.message || "The booths could not be loaded.");
  }

  return response.data;
}
