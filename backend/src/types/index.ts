export type UserRole = 'user' | 'staff' | 'admin';

export type ComplaintStatus = 'open' | 'assigned' | 'in-progress' | 'resolved';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  contact_info: string;
  created_at: Date;
}

export interface Complaint {
  id: number;
  user_id: number;
  staff_id: number | null;
  title: string;
  description: string;
  category: string;
  status: ComplaintStatus;
  attachments: string | null;
  created_at: Date;
  updated_at?: Date;
}

export interface AuthToken {
  id: number;
  email: string;
  role: UserRole;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
