import { apiClient } from "../../../api/ApiClient";
import type {
  ServiceFilters,
  ServiceListResponse,
} from "../types/serviceType";

export async function getServices(
  filters: ServiceFilters,
): Promise<ServiceListResponse> {
  const response = await apiClient.get<ServiceListResponse>(
    "/v1/exhibitor/services",
    {
      params: {
        "filter[name]": filters.name || undefined,
        sort: filters.sort || undefined,
        per_page: filters.perPage,
      },
    },
  );

  return response.data;
}
