import type { Booth } from "./boothType";
import type { CompanyProfileDraft } from "./companyProfileType";

export interface RequestBoothService {
  service_id: number;
  quantity: number;
}

export interface NewCompanyRequest {
  name: string;
  business_sector: string;
  phone: string;
  description: string;
  year_founded: number;
  social_links: string[];
  headquarters_lat?: number;
  headquarters_lng?: number;
  logo: File;
  gallery: File[];
}

export interface RequestBoothPayload {
  booth_id: number;
  company_id?: string;
  reason_for_booking: string;
  new_company?: NewCompanyRequest;
  services: RequestBoothService[];
}

export interface RequestBoothResponse {
  status: boolean;
  message: string;
  data?: unknown;
}

export interface RequestBoothDraft {
  boothId: number | null;
  boothBanner: File | null;
  companyLogo: File | null;
  companyProfile: CompanyProfileDraft;
  serviceQuantities: Record<number, number>;
}

export interface SelectedServiceSummary extends RequestBoothService {
  name: string;
  unitPrice: number;
}

export interface ReviewSummaryProps {
  booth: Booth | null;
  boothId: number | null;
  companyProfile: CompanyProfileDraft;
  currencyFormatter: Intl.NumberFormat;
  estimatedTotal: number;
  selectedServices: SelectedServiceSummary[];
}

export type ReviewValidationIssue =
  | "booth"
  | "companyLogo"
  | "companyProfile"
  | "socialLinks";

export type ReviewValidationTranslationKey =
  | "review.validation.booth"
  | "review.validation.companyLogo"
  | "review.validation.companyProfile"
  | "review.validation.socialLinks";
