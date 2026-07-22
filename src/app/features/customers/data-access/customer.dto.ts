export interface CustomerDto {
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

export interface CustomerListResponseDto {
  items: CustomerDto[];
  page: number;
  page_count: number;
}

export interface CustomerRequestDto {
  name: string;
  slug: string;
  document: string;
  document_type: number;
  email: string;
  phone: string;
  status: number;
  url: string;
}
