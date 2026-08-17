export interface ReviewUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
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
