export interface ExhibitorService {
  id: number;
  name: string;
  price: string;
  is_active: boolean;
}

export interface ServiceFilters {
  name?: string;
  sort?: string;
  perPage?: number;
}

export interface ServicePagination {
  data: ExhibitorService[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface ServiceListResponse {
  status: boolean;
  message: string;
  data: ServicePagination;
}

export interface ServiceFilterDraft {
  name: string;
  sort: string;
  perPage: string;
}
