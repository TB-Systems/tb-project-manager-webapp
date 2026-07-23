export interface Project {
  id: string;
  name: string;
  description: string;
  slug: string;
  repoUrl: string;
  status: number;
  customerProject: ProjectCustomerProject | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectCustomerProject {
  id: string;
  projectId: string;
  customerId: string;
  projectValue: number;
  monthlyValue: number;
  dueDay: number;
  projectPaymentStatus: number;
  lastPayment: string | null;
  customer: ProjectCustomer;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectCustomer {
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

export interface ProjectService {
  id: string;
  projectId: string;
  name: string;
  type: number;
  url: string;
  repoUrl: string;
  status: number;
  healthCheckUrl: string;
}

export interface ProjectFormValue {
  name: string;
  description: string;
  slug: string;
  repoUrl: string;
}
