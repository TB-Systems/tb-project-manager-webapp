export interface DashboardOverview {
  projects: DashboardProject[];
  total: number;
}

export interface DashboardProject {
  id: string;
  name: string;
  description: string;
  slug: string;
  repoUrl: string;
  status: number;
  customer: DashboardCustomer | null;
  services: DashboardProjectService[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardCustomer {
  id: string;
  name: string;
  slug: string;
  status: number;
  projectValue: number;
  monthlyValue: number;
  dueDay: number;
  projectPaymentStatus: number;
  lastPayment: string | null;
}

export interface DashboardProjectService {
  id: string;
  name: string;
  type: number;
  url: string;
  repoUrl: string;
  status: number;
  healthCheckUrl: string;
}
