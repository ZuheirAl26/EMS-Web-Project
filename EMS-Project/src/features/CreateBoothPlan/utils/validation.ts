import type { BoothFilterDraft, BoothFilters } from "../types/boothType";
import { isBusinessSector } from "../types/businessSectorType";
import type {
  CompanyProfileDraft,
  CompanyProfileValidationErrors,
} from "../types/companyProfileType";
import type { ServiceFilterDraft, ServiceFilters } from "../types/serviceType";
import type {
  RequestBoothDraft,
  ReviewValidationIssue,
} from "../types/requestBoothType";

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
  perPage: "10",
};

export function isValidBoothId(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

export function toBoothApiFilters(draft: BoothFilterDraft): BoothFilters {
  return {
    number: draft.number.trim() || undefined,
    booked: draft.booking === "" ? undefined : draft.booking === "true",
    hallType: draft.hallType.trim() || undefined,
    include: draft.include.trim() || undefined,
    sort: draft.sort || undefined,
  };
}

export function toServiceApiFilters(draft: ServiceFilterDraft): ServiceFilters {
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
    headquartersLocation:
      isValidLatitude(profile.headquartersLatitude) &&
      isValidLongitude(profile.headquartersLongitude)
        ? undefined
        : "required",
  };
}

export function isValidLatitude(value: string): boolean {
  const coordinate = Number(value);

  return (
    value.trim() !== "" &&
    Number.isFinite(coordinate) &&
    coordinate >= -90 &&
    coordinate <= 90
  );
}

export function isValidLongitude(value: string): boolean {
  const coordinate = Number(value);

  return (
    value.trim() !== "" &&
    Number.isFinite(coordinate) &&
    coordinate >= -180 &&
    coordinate <= 180
  );
}

export function validateRequestBoothDraft(
  draft: RequestBoothDraft,
): ReviewValidationIssue[] {
  const issues: ReviewValidationIssue[] = [];
  const hasExistingCompany = Boolean(
    draft.companyProfile.directoryCompanyId.trim(),
  );
  const requiredCompanyFields = [
    draft.companyProfile.companyName,
    draft.companyProfile.businessSector,
    draft.companyProfile.companyLocation,
    draft.companyProfile.phoneNumber,
    draft.companyProfile.yearFounded,
    draft.companyProfile.description,
  ];
  const hasSocialLink = [
    draft.companyProfile.website,
    draft.companyProfile.twitter,
    draft.companyProfile.linkedin,
  ].some((value) => value.trim().length > 0);
  const yearFounded = Number(draft.companyProfile.yearFounded);
  const hasValidYear = Number.isInteger(yearFounded) && yearFounded > 0;

  if (!draft.boothId || !isValidBoothId(draft.boothId)) {
    issues.push("booth");
  }
  if (
    !hasExistingCompany &&
    (requiredCompanyFields.some((value) => !value.trim()) ||
      !isBusinessSector(draft.companyProfile.businessSector) ||
      !isValidLatitude(draft.companyProfile.headquartersLatitude) ||
      !isValidLongitude(draft.companyProfile.headquartersLongitude) ||
      !hasValidYear)
  ) {
    issues.push("companyProfile");
  }
  if (!hasExistingCompany && !hasSocialLink) {
    issues.push("socialLinks");
  }
  if (!hasExistingCompany && !draft.companyLogo) {
    issues.push("companyLogo");
  }

  return issues;
}
