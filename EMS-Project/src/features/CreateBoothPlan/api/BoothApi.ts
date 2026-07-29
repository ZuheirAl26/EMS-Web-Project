import { apiClient } from "../../../api/ApiClient";

export interface Booth {
  id: number;
  number: string;
  qr_token: string | null;
  area: number;
  price: string;
  svg_id: string;
  is_booked: boolean;
  created_at: string;
}

export interface BoothFilters {
  number?: string;
  booked?: boolean;
  hallType?: string;
  include?: string;
  sort?: string;
}

export interface BoothListResponse {
  status: boolean;
  message: string;
  data: Booth[];
}

export async function getBooths(
  filters: BoothFilters,
): Promise<BoothListResponse> {
  const response = await apiClient.get<BoothListResponse>(
    "/v1/exhibitor/booth",
    {
      params: {
        "filter[number]": filters.number || undefined,
        "filter[booked]": filters.booked,
        "filter[hall_type]": filters.hallType || undefined,
        include: filters.include || undefined,
        sort: filters.sort || undefined,
      },
    },
  );

  return response.data;
}
