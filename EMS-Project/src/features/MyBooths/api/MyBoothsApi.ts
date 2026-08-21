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
  if (status === "rejected") {
    const [rejectedRes, cancelledRes] = await Promise.allSettled([
      apiClient.get<BoothRequestsResponse>("/v1/exhibitor/booth-requests", {
        params: { page, "filter[status]": "rejected" },
      }),
      apiClient.get<BoothRequestsResponse>("/v1/exhibitor/booth-requests", {
        params: { page, "filter[status]": "cancelled" },
      }),
    ]);

    const rejectedData =
      rejectedRes.status === "fulfilled"
        ? rejectedRes.value.data?.data?.data ?? []
        : [];
    const cancelledData =
      cancelledRes.status === "fulfilled"
        ? cancelledRes.value.data?.data?.data ?? []
        : [];

    const combinedData = [...rejectedData, ...cancelledData];
    const firstSuccess =
      rejectedRes.status === "fulfilled"
        ? rejectedRes.value.data
        : cancelledRes.status === "fulfilled"
          ? cancelledRes.value.data
          : null;

    if (!firstSuccess && rejectedRes.status === "rejected") {
      throw rejectedRes.reason;
    }

    return {
      status: true,
      message: firstSuccess?.message || "Success",
      data: {
        data: combinedData,
        current_page: page,
        per_page:
          (rejectedRes.status === "fulfilled"
            ? rejectedRes.value.data?.data?.per_page ?? 10
            : 10) +
          (cancelledRes.status === "fulfilled"
            ? cancelledRes.value.data?.data?.per_page ?? 10
            : 10),
        total:
          (rejectedRes.status === "fulfilled"
            ? rejectedRes.value.data?.data?.total ?? 0
            : 0) +
          (cancelledRes.status === "fulfilled"
            ? cancelledRes.value.data?.data?.total ?? 0
            : 0),
        last_page: Math.max(
          rejectedRes.status === "fulfilled"
            ? rejectedRes.value.data?.data?.last_page ?? 1
            : 1,
          cancelledRes.status === "fulfilled"
            ? cancelledRes.value.data?.data?.last_page ?? 1
            : 1,
        ),
      },
    };
  }

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