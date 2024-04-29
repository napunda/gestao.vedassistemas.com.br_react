export interface Users {
  id: number;
  name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

export interface UsersResponse {
  data: Users[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}
