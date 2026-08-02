export interface CompanyProfileDraft {
  companyName: string;
  businessSector: string;
  companyLocation: string;
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
  socialLinks?: string;
}
