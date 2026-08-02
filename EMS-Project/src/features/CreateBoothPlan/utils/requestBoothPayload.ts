import type {
  RequestBoothDraft,
  RequestBoothPayload,
  RequestBoothService,
} from "../types/requestBoothType";

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

  payload.new_company = {
    name: draft.companyProfile.companyName.trim(),
    business_sector: draft.companyProfile.businessSector.trim(),
    phone: draft.companyProfile.phoneNumber.trim(),
    description: draft.companyProfile.description.trim(),
    year_founded: Number(draft.companyProfile.yearFounded),
    social_links: socialLinks,
    logo: draft.companyLogo,
    gallery: draft.boothBanner ? [draft.boothBanner] : [],
  };

  return payload;
}
