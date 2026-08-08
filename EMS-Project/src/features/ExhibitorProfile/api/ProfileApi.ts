import { apiClient } from "../../../api/ApiClient";
import type {
  CompanyProfileResponse,
  ExhibitorProfileResponse,
  UpdateExhibitorProfilePayload,
} from "../types/profileType";

export async function getExhibitorProfile(): Promise<ExhibitorProfileResponse> {
  const response = await apiClient.get<ExhibitorProfileResponse>(
    "/v1/exhibitor/profile",
  );

  if (!response.data.status) {
    throw new Error(
      response.data.message || "The profile could not be loaded.",
    );
  }

  return response.data;
}

export async function getCompanyProfile(
  companyId: number,
): Promise<CompanyProfileResponse> {
  const response = await apiClient.get<CompanyProfileResponse>(
    `/v1/exhibitor/companies/${companyId}/profile`,
  );

  if (!response.data.status) {
    throw new Error(
      response.data.message || "The company profile could not be loaded.",
    );
  }

  return response.data;
}

export async function updateExhibitorProfile(
  payload: UpdateExhibitorProfilePayload,
): Promise<ExhibitorProfileResponse> {
  const formData = new FormData();
  formData.append("name", payload.name);

  if (payload.avatar) {
    formData.append("avatar", payload.avatar, payload.avatar.name);
  }

  const response = await apiClient.post<ExhibitorProfileResponse>(
    "/v1/exhibitor/profile",
    formData,
    {
      headers: {
        "Content-Type": undefined,
      },
    },
  );

  if (!response.data.status) {
    throw new Error(
      response.data.message || "The profile could not be updated.",
    );
  }

  return response.data;
}
