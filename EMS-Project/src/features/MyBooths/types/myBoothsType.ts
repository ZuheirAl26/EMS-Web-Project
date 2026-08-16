export interface MyBoothHall {
  id: number;
  number: string;
  area: number;
  type: string;
  svg_id: string;
}

export interface MyBoothCompany {
  id: number;
  name: string;
}

export interface MyBoothService {
  id: number;
  service_id?: number;
  name?: string;
  service_name?: string;
  price?: string;
  is_active?: boolean;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface MyBooth {
  id: number;
  number: string;
  qr_token: string | null;
  qr_code_url: string | null;
  area: number;
  price: string;
  svg_id: string;
  is_booked: boolean;
  status: MyBoothStatus | null;
  hall_id: MyBoothHall | null;
  company: MyBoothCompany | null;
  services: MyBoothService[] | null;
  created_at: string;
}

export interface MyBoothsPagination {
  data: MyBooth[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export const MY_BOOTH_STATUSES = [
  "pending",
  "approved",
  "rejected",
] as const;

export type MyBoothStatus = (typeof MY_BOOTH_STATUSES)[number];

export interface MyBoothsResponse {
  status: boolean;
  message: string;
  data: MyBoothsPagination;
}

export interface MyBoothCardProps {
  booth: MyBooth;
}

export interface BoothDetailsCardProps {
  booth: MyBooth;
}

export interface BoothQrCardProps {
  boothNumber: string;
  qrToken: string | null;
  qrUrl: string | null;
}
