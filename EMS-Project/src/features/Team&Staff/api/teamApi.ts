import { apiClient } from "../../../api/ApiClient";
import type {
  LookupEntity,
  ApiResponse,
  InvitePayload,
  TeamInvitation,
} from "../types/teamsType";

export const getBoothLookupApi = async (): Promise<LookupEntity[]> => {
  const { data } = await apiClient.get<ApiResponse<LookupEntity[]>>(
    "/v1/exhibitor/lookup/booths",
  );
  return data.data;
};

export const getCompanyInvitationsApi = async (
  companyId: number,
): Promise<TeamInvitation[]> => {
  const { data } = await apiClient.get(
    `/v1/exhibitor/companies/${companyId}/invitations`,
  );
  const res = data.data;
  if (Array.isArray(res)) return res;
  if (res && Array.isArray(res.data)) return res.data;
  return [];
};

export const getBoothInvitationsApi = async (
  boothId: number,
): Promise<TeamInvitation[]> => {
  const { data } = await apiClient.get(
    `/v1/exhibitor/booth/${boothId}/invitations`,
  );
  const res = data.data;
  if (Array.isArray(res)) return res;
  if (res && Array.isArray(res.data)) return res.data;
  return [];
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

export const deleteInvitationApi = async (
  invitation: string | number,
): Promise<ApiResponse<null>> => {
  const { data } = await apiClient.delete<ApiResponse<null>>(
    `/v1/exhibitor/invitations/${invitation}`,
  );
  return data;
};
