import { apiClient } from "../../../api/ApiClient";

export interface ExhibitorService {
  id: number;
  name: string;
  price: string;
  is_active: boolean;
}

export interface ServiceFilters {
  name?: string;
  sort?: string;
  perPage?: number;
}

export interface ServicePagination {
  data: ExhibitorService[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface ServiceListResponse {
  status: boolean;
  message: string;
  data: ServicePagination;
}

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
