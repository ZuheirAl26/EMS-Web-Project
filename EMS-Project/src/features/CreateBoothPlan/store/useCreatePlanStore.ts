import { create } from "zustand";
import type { CompanyProfileDraft } from "../types/companyProfileType";
import type { CreatePlanState } from "../types/createPlanType";

const initialCompanyProfile: CompanyProfileDraft = {
  companyName: "",
  businessSector: "",
  companyLocation: "",
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
  resetDraft: () =>
    set({
      ...initialDraft,
      serviceQuantities: {},
      companyProfile: { ...initialCompanyProfile },
    }),
}));
