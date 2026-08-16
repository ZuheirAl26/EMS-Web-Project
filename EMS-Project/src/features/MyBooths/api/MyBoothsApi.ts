import { apiClient } from "../../../api/ApiClient";
import type {
  BoothRequestStatus,
  BoothRequestsResponse,
  MyBoothsResponse,
} from "../types/myBoothsType";

export async function getMyBooths(page: number): Promise<MyBoothsResponse> {
  const response = await apiClient.get<MyBoothsResponse>(
    "/v1/exhibitor/booth/my",
    { params: { page } },
  );

  if (!response.data.status) {
    throw new Error(
      response.data.message || "The booths could not be retrieved.",
    );
  }

  return response.data;
}

export async function getBoothRequests(
  page: number,
  status: BoothRequestStatus,
): Promise<BoothRequestsResponse> {
  const response = await apiClient.get<BoothRequestsResponse>(
    "/v1/exhibitor/booth-requests",
    { params: { page, "filter[status]": status } },
  );

  if (!response.data.status) {
    throw new Error(
      response.data.message || "The booth requests could not be retrieved.",
    );
  }

  return response.data;
}