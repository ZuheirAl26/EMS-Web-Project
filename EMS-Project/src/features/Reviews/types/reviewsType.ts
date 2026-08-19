export interface ReviewUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string | null;
}

export interface ReviewerDetails {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  job?: string | null;
  location?: string | null;
  birthday?: string | null;
  gender?: string | null;
  phone?: string | null;
  avatar?: string | null;
}

export interface ReviewItem {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at?: string;
  user: ReviewUser;
}

export interface ReviewStatistics {
  total_reviews: number;
  average_rating: number;
  five_star_reviews?: number;
  four_star_reviews?: number;
  three_star_reviews?: number;
  two_star_reviews?: number;
  one_star_reviews?: number;
}

export interface ReviewStatsData {
  total_reviews: number;
  average_rating: number;
  one_star_reviews: number;
  two_star_reviews: number;
  three_star_reviews: number;
  four_star_reviews: number;
  five_star_reviews: number;
}

export interface ReviewsPaginationData {
  data: ReviewItem[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface ReviewsResponseData {
  statistics: ReviewStatistics;
  reviews: ReviewsPaginationData;
}

export type ReviewTargetType = "event" | "booth";
