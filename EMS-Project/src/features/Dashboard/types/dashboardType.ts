export type DashboardScopeMode = "booth" | "event";

export interface DetailedBoothHall {
  id: number;
  number: string;
  area: number;
  type: string;
  svg_id?: string;
}

export interface DetailedBoothCompany {
  id: number;
  name: string;
  status: string;
}

export interface DetailedBoothService {
  id: number;
  name: string;
  price: string | number;
  category?: string;
  icon?: string;
}

export interface DetailedBoothData {
  id: number;
  number: string;
  qr_token: string;
  qr_code_url: string;
  area: number;
  price: string;
  svg_id: string;
  is_booked: boolean;
  status: string;
  hall_id: DetailedBoothHall;
  company?: DetailedBoothCompany;
  services?: DetailedBoothService[];
  created_at: string;
}

export interface BoothStatisticsData {
  leads_count: number;
  recent_qr_scans_count: number;
  services_count: number;
  services_total_price: number;
  booth_members_count: number;
  pending_invitations_count: number;
  events_count: number;
  approved_events_count: number;
}

export interface VisitorInfo {
  id: number;
  full_name: string;
  email: string | null;
  phone: string | null;
  avatar: string | null;
}

export interface VisitorLead {
  id: number;
  leadable_type: string;
  leadable_id: number;
  created_at: string;
  visitor: VisitorInfo;
}

export interface WeeklyStat {
  date: string;
  day_name: string;
  count: number;
}

export interface LeadsResponseData {
  leads_count: number;
  visitors: {
    data: VisitorLead[];
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
  };
  weekly_stats: WeeklyStat[];
}

export interface AnnouncementItem {
  id: number;
  title: string;
  description: string;
  receiver: string;
  is_active: boolean;
  media: string | null;
}

export type AnnouncementsResponseData =
  | AnnouncementItem[]
  | {
      data: AnnouncementItem[];
      current_page?: number;
      per_page?: number;
      total?: number;
      last_page?: number;
    };
