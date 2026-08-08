export const profileKeys = {
  exhibitor: ["exhibitor-profile"] as const,
  companies: ["exhibitor-company-profile"] as const,
  company: (companyId: number) =>
    [...profileKeys.companies, companyId] as const,
  companyLookup: ["exhibitor-company-lookup"] as const,
};
