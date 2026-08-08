import type { MyBooth } from "../../MyBooths/types/myBoothsType";

export interface ExhibitorProfile {
  id: number;
  name: string;
  email: string;
  type: string;
  avatar: string | null;
  is_verified: boolean;
}

export interface UpdateExhibitorProfilePayload {
  name: string;
  avatar?: File | null;
  avatarPreviewUrl?: string | null;
}

export interface EditProfileDialogProps {
  exhibitor: ExhibitorProfile;
  onClose: () => void;
  open: boolean;
}

export interface ExhibitorProfileResponse {
  status: boolean;
  message: string;
  data: ExhibitorProfile;
}

export interface CompanySocialLinks {
  website?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  [platform: string]: string | undefined;
}

export interface ExhibitorCompany {
  id: number;
  name: string;
  business_sector: string;
  phone: string;
  description: string;
  year_founded: number;
  social_links: CompanySocialLinks;
  headquarters_lat: number;
  headquarters_lng: number;
  status: string;
  logo: string | null;
  gallery: unknown[];
}

export interface CompanyProfileData {
  company: ExhibitorCompany;
  exhibitor: ExhibitorProfile;
}

export interface CompanyProfileResponse {
  status: boolean;
  message: string;
  data: CompanyProfileData;
}

export interface ProfileCompanyOption {
  id: number;
  name: string;
}

export interface CompanyBoothSummary {
  count: number;
  hallNumber: string | null;
  boothNumber: string | null;
  totalArea: number;
}

export interface ActiveCompanySelectorProps {
  activeCompany: ExhibitorCompany | null;
  companies: ProfileCompanyOption[];
  onCompanyChange: (companyId: number) => void;
  selectedCompanyId: number | null;
}

export interface ProfileSidebarCardProps {
  boothSummary: CompanyBoothSummary;
  companies: ProfileCompanyOption[];
  company: ExhibitorCompany | null;
  exhibitor: ExhibitorProfile;
  onCompanyChange: (companyId: number) => void;
  selectedCompanyId: number | null;
}

export interface AccountInformationProps {
  company: ExhibitorCompany;
  exhibitor: ExhibitorProfile;
}

export interface CompanyAboutCardProps {
  company: ExhibitorCompany;
}

export interface SocialLinksCardProps {
  links: CompanySocialLinks;
}

export interface CompanyMediaCardProps {
  company: ExhibitorCompany;
}

export type ProfileBooth = MyBooth;
