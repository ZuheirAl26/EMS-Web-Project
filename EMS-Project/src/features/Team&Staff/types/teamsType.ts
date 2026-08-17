export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  initials?: string;
  created_at?: string;
}

export interface TeamInvitationSender {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
}

export interface TeamInvitation {
  id: number;
  email: string;
  status: string;
  invitation?: string;
  token?: string;
  invitation_token?: string;
  code?: string;
  uuid?: string;
  is_user_exists?: boolean;
  expires_at?: string;
  is_expired?: boolean;
  sender?: TeamInvitationSender;
  type?: string;
  name?: string;
  role?: string;
  created_at?: string;
  initials?: string;
  booth_id?: number;
  company_id?: number;
}

export interface InvitationScope {
  type: "booth" | "company";
  id: number;
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
