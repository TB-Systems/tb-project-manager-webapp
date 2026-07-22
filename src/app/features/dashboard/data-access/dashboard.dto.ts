export interface DashboardResponseDto {
  items: DashboardProjectDto[];
  total: number;
}

export interface DashboardProjectDto {
  id: string;
  name: string;
  description: string;
  slug: string;
  repo_url: string;
  status: number;
  customer: DashboardCustomerDto | null;
  services: DashboardProjectServiceDto[];
  created_at: string;
  updated_at: string;
}

export interface DashboardCustomerDto {
  id: string;
  name: string;
  slug: string;
  status: number;
  project_value: number;
  monthly_value: number;
  due_day: number;
  project_payment_status: number;
  last_payment: string | null;
}

export interface DashboardProjectServiceDto {
  id: string;
  name: string;
  type: number;
  url: string;
  repo_url: string;
  status: number;
  health_check_url: string;
}
