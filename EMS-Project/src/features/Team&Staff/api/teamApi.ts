import { apiClient } from "../../../api/ApiClient";
import type {
  LookupEntity,
  ApiResponse,
  InvitePayload,
} from "../types/teamsType";

export const getBoothLookupApi = async (): Promise<LookupEntity[]> => {
  const { data } = await apiClient.get<ApiResponse<LookupEntity[]>>(
    "/v1/exhibitor/lookup/booths",
  );
  return data.data;
};

// Mutation Endpoints
export const inviteCompanyManagerApi = async (
  companyId: number,
  payload: InvitePayload,
): Promise<ApiResponse<null>> => {
  const { data } = await apiClient.post<ApiResponse<null>>(
    `/v1/exhibitor/companies/${companyId}/invitations`,
    payload,
  );
  return data;
};

export const inviteBoothManagerApi = async (
  boothId: number,
  payload: InvitePayload,
): Promise<ApiResponse<null>> => {
  const { data } = await apiClient.post<ApiResponse<null>>(
    `/v1/exhibitor/booth/${boothId}/invitations`,
    payload,
  );
  return data;
};
