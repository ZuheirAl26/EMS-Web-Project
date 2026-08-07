import { create } from "zustand";
import type { CompanyProfileDraft } from "../types/companyProfileType";
import type { CreatePlanState } from "../types/createPlanType";
import type { BoothFilterDraft, BoothFilters } from "../types/boothType";
import { initialBoothFilterDraft } from "../utils/validation";

const initialCompanyProfile: CompanyProfileDraft = {
  companyName: "",
  businessSector: "",
  companyLocation: "",
  headquartersLatitude: "",
  headquartersLongitude: "",
  phoneNumber: "",
  yearFounded: "",
  website: "",
  twitter: "",
  linkedin: "",
  description: "",
  directoryCompanyId: "",
};

const initialDraft = {
  boothId: null,
  serviceQuantities: {},
  companyProfile: initialCompanyProfile,
  companyLogo: null,
  boothBanner: null,
  draftFilters: initialBoothFilterDraft,
  filters: {} as BoothFilters,
};

export const useCreatePlanStore = create<CreatePlanState>((set) => ({
  ...initialDraft,
  setBoothId: (boothId) => set({ boothId }),
  setServiceQuantity: (serviceId, quantity) =>
    set((state) => ({
      serviceQuantities: {
        ...state.serviceQuantities,
        [serviceId]: quantity,
      },
    })),
  updateCompanyProfile: (field, value) =>
    set((state) => ({
      companyProfile: {
        ...state.companyProfile,
        [field]: value,
      },
    })),
  setCompanyLogo: (companyLogo) => set({ companyLogo }),
  setBoothBanner: (boothBanner) => set({ boothBanner }),

  setDraftFilters: (
    updater: BoothFilterDraft | ((prev: BoothFilterDraft) => BoothFilterDraft),
  ) =>
    set((state) => ({
      draftFilters:
        typeof updater === "function" ? updater(state.draftFilters) : updater,
    })),

  setFilters: (filters: BoothFilters) => set({ filters }),

  resetFilters: () =>
    set({
      draftFilters: initialBoothFilterDraft,
      filters: {},
    }),

  resetDraft: () =>
    set({
      ...initialDraft,
      serviceQuantities: {},
      companyProfile: { ...initialCompanyProfile },
    }),
}));
