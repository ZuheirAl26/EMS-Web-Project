export interface Booth {
  id: number;
  number: string;
  qr_token: string | null;
  area: number;
  price: string;
  svg_id: string;
  is_booked: boolean;
  created_at: string;
}

export interface BoothFilters {
  number?: string;
  booked?: boolean;
  hallType?: string;
  include?: string;
  sort?: string;
}

export interface BoothListResponse {
  status: boolean;
  message: string;
  data: Booth[];
}

export type BookingFilter = "" | "true" | "false";

export interface BoothFilterDraft {
  number: string;
  booking: BookingFilter;
  hallType: string;
  include: string;
  sort: string;
}
