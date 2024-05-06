export interface Companies {
  id: number;
  id_machine: string;
  id_user: number;
  document: string;
  access_allowed: boolean;
  test_period_active: boolean;
  remaining_days?: number | null;
  name: string;
  address?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  phone?: string | null;
  last_activity_at?: Date | null;
  created_at: Date;
  start_test_period_at?: Date | null;
}

export interface CompaniesResponse {
  data: Companies[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}
