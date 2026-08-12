export interface EventSpeaker {
  id: number;
  name: string;
}

export interface EventOwner {
  id: number;
  name: string;
  email?: string;
  avatar?: string | null;
  business_sector?: string;
  phone?: string;
  description?: string;
  year_founded?: number;
  social_links?: Record<string, string>;
  headquarters_lat?: number;
  headquarters_lng?: number;
  status?: string;
}

export interface ExhibitorEvent {
  id: number;
  title: string;
  event_hall_id: number;
  type: string;
  status: string;
  start_at: string;
  end_at: string;
  duration: number;
  description: string;
  qr_token: string | null;
  qr_code_url?: string | null;
  qr_token_url?: string | null;
  eventable: EventOwner;
  speakers: EventSpeaker[];
  average_rating: number | null;
  qr_scans_count: number;
  reviews_count: number;
  saved_count: number;
  leads_count: number;
  created_at: string;
  logo: string | null;
}

export interface EventsPagination {
  data: ExhibitorEvent[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface EventsResponse {
  status: boolean;
  message: string;
  data: EventsPagination;
}

export interface EventStatistics {
  total_requests: number;
  pending_requests: number;
  approved_requests: number;
  rejected_requests: number;
}

export interface EventStatisticsResponse {
  status: boolean;
  message: string;
  data: EventStatistics;
}

export interface EventCardProps {
  event: ExhibitorEvent;
}

export interface EventMetricsProps {
  event: ExhibitorEvent;
  numberFormatter: Intl.NumberFormat;
}

export interface EventStatisticsCardsProps {
  statistics: EventStatistics;
}

export type EventStatusTone =
  | "approved"
  | "pending"
  | "rejected"
  | "neutral";

export type EventStatusTranslationKey =
  | "status.approved"
  | "status.pending"
  | "status.rejected"
  | "status.other";
