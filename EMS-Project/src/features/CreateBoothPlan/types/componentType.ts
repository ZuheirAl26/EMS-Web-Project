import type {
  Dispatch,
  FormEvent,
  InputHTMLAttributes,
  ReactNode,
  SetStateAction,
} from "react";
import type { IconSvgElement } from "@hugeicons/react";
import type {
  Booth,
  BoothFilterDraft,
} from "./boothType";
import type { CompanyProfileDraft } from "./companyProfileType";
import type { BoothPlanStep } from "./createPlanType";
import type {
  ExhibitorService,
  ServiceFilterDraft,
} from "./serviceType";

export interface BoothPlanShellProps {
  children: ReactNode;
  currentStep: BoothPlanStep;
}

export interface BoothMapProps {
  booths: Booth[];
  selectedBoothId: number | null;
  onSelect: (booth: Booth) => void;
}

export interface BoothFiltersPanelProps {
  draftFilters: BoothFilterDraft;
  isFetching: boolean;
  onDraftChange: Dispatch<SetStateAction<BoothFilterDraft>>;
  onReset: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export interface BoothResultsProps {
  booths: Booth[];
  currencyFormatter: Intl.NumberFormat;
  isPending: boolean;
  onSelect: (booth: Booth) => void;
  selectedBooth: Booth | null;
}

export interface BoothSelectionSummaryProps {
  booth: Booth;
  currencyFormatter: Intl.NumberFormat;
}

export interface ServiceFiltersPanelProps {
  draftFilters: ServiceFilterDraft;
  isFetching: boolean;
  onDraftChange: Dispatch<SetStateAction<ServiceFilterDraft>>;
  onReset: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  total?: number;
}

export interface ServiceListProps {
  currencyFormatter: Intl.NumberFormat;
  isPending: boolean;
  onQuantityChange: (
    serviceId: number,
    change: -1 | 1,
    isActive: boolean,
  ) => void;
  quantities: Record<number, number>;
  services: ExhibitorService[];
}

export interface ProfileFieldProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  icon: IconSvgElement;
  label: string;
  onValueChange: (value: string) => void;
  value: string;
}

export interface MediaUploadProps {
  accept: string;
  emptyLabel: string;
  errorMessage?: string;
  file: File | null;
  helpText: string;
  id: string;
  label: string;
  onFileChange: (file: File | null) => void;
  required?: boolean;
  uploadedLabel: string;
  wide?: boolean;
}

export interface CompanyDetailsFormProps {
  headquartersLocationError?: string;
  hasSocialLinksError: boolean;
  onFieldChange: (field: keyof CompanyProfileDraft, value: string) => void;
}

export interface CompanyMediaSectionProps {
  companyLogoError?: string;
  onLogoAccepted: () => void;
}

export interface CompanyDirectoryProps {
  onFieldChange: (field: keyof CompanyProfileDraft, value: string) => void;
}
