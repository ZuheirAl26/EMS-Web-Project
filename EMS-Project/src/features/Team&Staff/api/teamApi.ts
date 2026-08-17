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

export interface DeleteInvitationParams {
  id: number | string;
  type?: "company" | "booth";
  entityId?: number;
}

export const deleteInvitationApi = async (
  params: DeleteInvitationParams,
): Promise<ApiResponse<null>> => {
  const { id, type, entityId } = params;

  if (type === "company" && entityId) {
    try {
      const { data } = await apiClient.delete<ApiResponse<null>>(
        `/v1/exhibitor/companies/${entityId}/invitations/${id}`,
      );
      return data;
    } catch (err: unknown) {
      if (
        !(
          typeof err === "object" &&
          err !== null &&
          "response" in err &&
          (err as { response?: { status?: number } }).response?.status === 404
        )
      ) {
        throw err;
      }
    }
  }

  if (type === "booth" && entityId) {
    try {
      const { data } = await apiClient.delete<ApiResponse<null>>(
        `/v1/exhibitor/booth/${entityId}/invitations/${id}`,
      );
      return data;
    } catch (err: unknown) {
      if (
        !(
          typeof err === "object" &&
          err !== null &&
          "response" in err &&
          (err as { response?: { status?: number } }).response?.status === 404
        )
      ) {
        throw err;
      }
    }
  }

  const { data } = await apiClient.delete<ApiResponse<null>>(
    `/v1/exhibitor/invitations/${id}`,
  );
  return data;
};
