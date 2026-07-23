export interface ProjectDto {
  id: string;
  name: string;
  description: string;
  slug: string;
  repo_url: string;
  status: number;
  customer_project: ProjectCustomerProjectDto | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectCustomerProjectDto {
  id: string;
  project_id: string;
  customer_id: string;
  project_value: number;
  monthly_value: number;
  due_day: number;
  project_payment_status: number;
  last_payment: string | null;
  customer: ProjectCustomerDto;
  created_at: string;
  updated_at: string;
}

export interface ProjectCustomerDto {
  id: string;
  name: string;
  slug: string;
  document: string;
  document_type: number;
  email: string;
  phone: string;
  status: number;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectListResponseDto {
  items: ProjectDto[];
  page: number;
  page_count: number;
}

export interface ProjectRequestDto {
  name: string;
  description: string;
  slug: string;
  repo_url: string;
}

export interface ProjectServiceDto {
  id: string;
  project_id: string;
  name: string;
  type: number;
  url: string;
  repo_url: string;
  status: number;
  health_check_url: string;
}

export interface ProjectServiceRequestDto {
  project_id: string;
  name: string;
  type: number;
  url: string;
  repo_url: string;
  health_check_url: string;
}

export interface ProjectServiceUpdateRequestDto extends ProjectServiceRequestDto {
  status: number;
}

export interface ProjectServiceListResponseDto {
  items: ProjectServiceDto[];
  page: number;
  page_count: number;
}

export interface CustomerProjectDto {
  id: string;
  project_id: string;
  customer_id: string;
  project_value: number;
  monthly_value: number;
  due_day: number;
  project_payment_status: number;
  last_payment: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerProjectRequestDto {
  project_id: string;
  customer_id: string;
  project_value: number;
  monthly_value: number;
  due_day: number;
}
