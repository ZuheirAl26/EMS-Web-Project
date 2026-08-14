import type { BoothFilterDraft, BoothFilters } from "./boothType";
import type { CompanyProfileDraft } from "./companyProfileType";

export interface CreatePlanState {
  draftFilters: BoothFilterDraft;
  filters: BoothFilters;
  boothId: number | null;
  serviceQuantities: Record<number, number>;
  companyProfile: CompanyProfileDraft;
  companyLogo: File | null;
  companyGallery: File[];
  setBoothId: (boothId: number | null) => void;
  setServiceQuantity: (serviceId: number, quantity: number) => void;
  updateCompanyProfile: (
    field: keyof CompanyProfileDraft,
    value: string,
  ) => void;
  setCompanyLogo: (file: File | null) => void;
  setCompanyGallery: (files: File[]) => void;
  resetDraft: () => void;
  setDraftFilters: (
    updater: BoothFilterDraft | ((prev: BoothFilterDraft) => BoothFilterDraft),
  ) => void;
  setFilters: (filters: BoothFilters) => void;
  resetFilters: () => void;
}

export type BoothPlanStep = 1 | 2 | 3 | 4;
