export interface Companies {
  id: number;
  id_machine: string;
  document: string;
  access_allowed: boolean;
  test_period_active: boolean;
  name: string;
  address?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  phone?: string | null;
  created_at: Date;
}

export interface CompaniesResponse {
  data: Companies[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}
