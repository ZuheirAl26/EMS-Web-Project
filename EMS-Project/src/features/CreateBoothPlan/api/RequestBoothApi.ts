import { apiClient } from "../../../api/ApiClient";
import type {
  NewCompanyRequest,
  RequestBoothPayload,
  RequestBoothResponse,
  RequestBoothService,
} from "../types/requestBoothType";

function appendServices(formData: FormData, services: RequestBoothService[]) {
  services.forEach((service, index) => {
    formData.append(
      `services[${index}][service_id]`,
      String(service.service_id),
    );
    formData.append(
      `services[${index}][quantity]`,
      String(service.quantity),
    );
  });
}

function appendNewCompany(formData: FormData, company: NewCompanyRequest) {
  formData.append("new_company[name]", company.name);
  formData.append("new_company[business_sector]", company.business_sector);
  formData.append("new_company[phone]", company.phone);
  formData.append("new_company[description]", company.description);
  formData.append("new_company[year_founded]", String(company.year_founded));
  formData.append("new_company[logo]", company.logo, company.logo.name);

  company.social_links.forEach((link, index) => {
    formData.append(`new_company[social_links][${index}]`, link);
  });

  company.gallery.forEach((image, index) => {
    formData.append(`new_company[gallery][${index}]`, image, image.name);
  });

  formData.append(
    "new_company[headquarters_lat]",
    String(company.headquarters_lat),
  );
  formData.append(
    "new_company[headquarters_lng]",
    String(company.headquarters_lng),
  );
}

function toRequestBoothFormData(payload: RequestBoothPayload) {
  const formData = new FormData();

  formData.append("booth_id", String(payload.booth_id));
  formData.append("reason_for_booking", payload.reason_for_booking);
  appendServices(formData, payload.services);

  if (payload.company_id) {
    formData.append("company_id", payload.company_id);
  }

  if (payload.new_company) {
    appendNewCompany(formData, payload.new_company);
  }

  return formData;
}

export async function requestBooth(
  payload: RequestBoothPayload,
): Promise<RequestBoothResponse> {
  const response = await apiClient.post<RequestBoothResponse>(
    "/v1/exhibitor/booth/request-booth",
    toRequestBoothFormData(payload),
    {
      headers: {
        "Content-Type": undefined,
      },
    },
  );

  if (!response.data.status) {
    throw new Error(
      response.data.message || "The booth request could not be submitted.",
    );
  }

  return response.data;
}
