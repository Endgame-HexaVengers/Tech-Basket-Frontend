export interface Branch {
  id: string;
  name: string;
  code: string;
  location: string;
  type: string;
  manager: string;
  users: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface FilterParams {
  search: string;
  status: string;
  type: string;
  location: string;
}