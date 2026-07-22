export interface Customer {
  id: string;
  name: string;
  slug: string;
  document: string;
  documentType: number;
  email: string;
  phone: string;
  status: number;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerList {
  customers: Customer[];
  page: number;
  pageCount: number;
}

export interface CustomerFormValue {
  name: string;
  slug: string;
  document: string;
  documentType: number;
  email: string;
  phone: string;
  status: number;
  url: string;
}
