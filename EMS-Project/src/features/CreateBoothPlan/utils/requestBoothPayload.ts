import type {
  RequestBoothDraft,
  RequestBoothPayload,
  RequestBoothService,
} from "../types/requestBoothType";
import { isBusinessSector } from "../types/businessSectorType";
import { isValidLatitude, isValidLongitude } from "./validation";

function serializeServices(
  quantities: Record<number, number>,
): RequestBoothService[] {
  return Object.entries(quantities)
    .filter(([, quantity]) => quantity > 0)
    .map(([serviceId, quantity]) => ({
      service_id: Number(serviceId),
      quantity,
    }));
}

export function buildRequestBoothPayload(
  draft: RequestBoothDraft,
): RequestBoothPayload {
  if (!draft.boothId) {
    throw new Error("A booth is required.");
  }

  const companyId = draft.companyProfile.directoryCompanyId.trim();
  const socialLinks = [
    draft.companyProfile.website,
    draft.companyProfile.twitter,
    draft.companyProfile.linkedin,
  ]
    .map((value) => value.trim())
    .filter(Boolean);

  const payload: RequestBoothPayload = {
    booth_id: draft.boothId,
    reason_for_booking: "",
    services: serializeServices(draft.serviceQuantities),
  };

  if (companyId) {
    payload.company_id = companyId;
    return payload;
  }

  if (!draft.companyLogo) {
    throw new Error("The company logo is required.");
  }

  if (!isBusinessSector(draft.companyProfile.businessSector)) {
    throw new Error("A valid business sector is required.");
  }

  if (
    !isValidLatitude(draft.companyProfile.headquartersLatitude) ||
    !isValidLongitude(draft.companyProfile.headquartersLongitude)
  ) {
    throw new Error("Valid company coordinates are required.");
  }

  payload.new_company = {
    name: draft.companyProfile.companyName.trim(),
    business_sector: draft.companyProfile.businessSector,
    phone: draft.companyProfile.phoneNumber.trim(),
    description: draft.companyProfile.description.trim(),
    year_founded: Number(draft.companyProfile.yearFounded),
    social_links: socialLinks,
    headquarters_lat: Number(draft.companyProfile.headquartersLatitude),
    headquarters_lng: Number(draft.companyProfile.headquartersLongitude),
    logo: draft.companyLogo,
    gallery: draft.companyGallery,
  };

  return payload;
}
