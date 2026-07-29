import type {
  BoothFilterDraft,
  BoothFilters,
} from "../types/boothType";
import type {
  CompanyProfileDraft,
  CompanyProfileValidationErrors,
} from "../types/companyProfileType";
import type {
  ServiceFilterDraft,
  ServiceFilters,
} from "../types/serviceType";

export const initialBoothFilterDraft: BoothFilterDraft = {
  number: "",
  booking: "",
  hallType: "",
  include: "",
  sort: "",
};

export const initialServiceFilterDraft: ServiceFilterDraft = {
  name: "",
  sort: "",
  perPage: "15",
};

export function isValidBoothId(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

export function toBoothApiFilters(
  draft: BoothFilterDraft,
): BoothFilters {
  return {
    number: draft.number.trim() || undefined,
    booked: draft.booking === "" ? undefined : draft.booking === "true",
    hallType: draft.hallType.trim() || undefined,
    include: draft.include.trim() || undefined,
    sort: draft.sort || undefined,
  };
}

export function toServiceApiFilters(
  draft: ServiceFilterDraft,
): ServiceFilters {
  return {
    name: draft.name.trim() || undefined,
    sort: draft.sort || undefined,
    perPage: Number(draft.perPage),
  };
}

export function clampServiceQuantity(quantity: number): number {
  return Math.min(99, Math.max(0, quantity));
}

export function validateCompanyProfile(
  profile: CompanyProfileDraft,
  companyLogo: File | null,
): CompanyProfileValidationErrors {
  const hasSocialLink = [
    profile.website,
    profile.twitter,
    profile.linkedin,
  ].some((value) => value.trim().length > 0);

  return {
    socialLinks: hasSocialLink ? undefined : "required",
    companyLogo: companyLogo ? undefined : "required",
  };
}
