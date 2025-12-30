export type UserRole = 'user' | 'staff' | 'admin';
export type ComplaintStatus = 'open' | 'assigned' | 'in-progress' | 'resolved';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  contact_info?: string;
  created_at?: Date;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Complaint {
  id: number;
  user_id: number;
  staff_id?: number;
  title: string;
  description: string;
  category: string;
  status: ComplaintStatus;
  priority?: 'low' | 'medium' | 'high';
  attachments?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface ComplaintStats {
  total: number;
  open_count: number;
  assigned_count: number;
  in_progress_count: number;
  resolved_count: number;
}

export interface CategoryStat {
  category: string;
  count: number;
}
