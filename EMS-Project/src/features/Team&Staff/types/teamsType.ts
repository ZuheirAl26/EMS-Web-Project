export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  initials?: string;
}

export interface LookupEntity {
  id: number;
  label?: string;
  name?: string;
  number?: string;
}

export interface InvitePayload {
  email: string;
}

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}
