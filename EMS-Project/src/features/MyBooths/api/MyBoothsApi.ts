import { apiClient } from "../../../api/ApiClient";
import type { MyBoothsResponse } from "../types/myBoothsType";

export async function getMyBooths(page: number): Promise<MyBoothsResponse> {
  const response = await apiClient.get<MyBoothsResponse>(
    "/v1/exhibitor/booth/my",
    {
      params: { page },
    },
  );

  if (!response.data.status) {
    throw new Error(
      response.data.message || "The booths could not be retrieved.",
    );
  }

  return response.data;
}
