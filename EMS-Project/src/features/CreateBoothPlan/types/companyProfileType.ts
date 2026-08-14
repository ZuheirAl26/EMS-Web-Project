export interface CompanyProfileDraft {
  companyName: string;
  businessSector: string;
  headquartersLatitude: string;
  headquartersLongitude: string;
  phoneNumber: string;
  yearFounded: string;
  website: string;
  twitter: string;
  linkedin: string;
  description: string;
  directoryCompanyId: string;
}

export interface CompanyProfileValidationErrors {
  companyLogo?: string;
  headquartersLocation?: string;
  socialLinks?: string;
}
