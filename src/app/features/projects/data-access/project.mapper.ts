import {
  Project,
  CustomerProject,
  CustomerProjectFormValue,
  ProjectCustomer,
  ProjectCustomerProject,
  ProjectFormValue,
  ProjectService,
  ProjectServiceFormValue,
} from '../domain/project.model';
import {
  CustomerProjectDto,
  CustomerProjectRequestDto,
  ProjectCustomerDto,
  ProjectCustomerProjectDto,
  ProjectDto,
  ProjectRequestDto,
  ProjectServiceDto,
  ProjectServiceRequestDto,
  ProjectServiceUpdateRequestDto,
} from './project.dto';

export function mapProjectDto(dto: ProjectDto): Project {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    slug: dto.slug,
    repoUrl: dto.repo_url,
    status: dto.status,
    customerProject: dto.customer_project ? mapCustomerProjectDto(dto.customer_project) : null,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function mapProjectServiceDto(dto: ProjectServiceDto): ProjectService {
  return {
    id: dto.id,
    projectId: dto.project_id,
    name: dto.name,
    type: dto.type,
    url: dto.url,
    repoUrl: dto.repo_url,
    status: dto.status,
    healthCheckUrl: dto.health_check_url,
  };
}

export function mapCustomerProjectRelationDto(dto: CustomerProjectDto): CustomerProject {
  return {
    id: dto.id,
    projectId: dto.project_id,
    customerId: dto.customer_id,
    projectValue: dto.project_value,
    monthlyValue: dto.monthly_value,
    dueDay: dto.due_day,
    projectPaymentStatus: dto.project_payment_status,
    lastPayment: dto.last_payment,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function mapProjectFormToRequest(value: ProjectFormValue): ProjectRequestDto {
  return {
    name: value.name,
    description: value.description,
    slug: value.slug,
    repo_url: value.repoUrl,
  };
}

export function mapProjectServiceFormToRequest(
  projectId: string,
  value: ProjectServiceFormValue,
): ProjectServiceRequestDto {
  return {
    project_id: projectId,
    name: value.name,
    type: value.type,
    url: value.url,
    repo_url: value.repoUrl,
    health_check_url: value.healthCheckUrl,
  };
}

export function mapProjectServiceFormToUpdateRequest(
  projectId: string,
  value: ProjectServiceFormValue,
  status: number,
): ProjectServiceUpdateRequestDto {
  return {
    ...mapProjectServiceFormToRequest(projectId, value),
    status,
  };
}

export function mapCustomerProjectFormToRequest(
  projectId: string,
  value: CustomerProjectFormValue,
): CustomerProjectRequestDto {
  return {
    project_id: projectId,
    customer_id: value.customerId,
    project_value: moneyToCents(value.projectValue),
    monthly_value: moneyToCents(value.monthlyValue),
    due_day: value.dueDay,
  };
}

function moneyToCents(value: string): number {
  const normalized = value.trim().replace(/\./g, '').replace(',', '.');
  const parsed = Number.parseFloat(normalized);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }

  return Math.round(parsed * 100);
}

function mapCustomerProjectDto(dto: ProjectCustomerProjectDto): ProjectCustomerProject {
  return {
    id: dto.id,
    projectId: dto.project_id,
    customerId: dto.customer_id,
    projectValue: dto.project_value,
    monthlyValue: dto.monthly_value,
    dueDay: dto.due_day,
    projectPaymentStatus: dto.project_payment_status,
    lastPayment: dto.last_payment,
    customer: mapCustomerDto(dto.customer),
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

function mapCustomerDto(dto: ProjectCustomerDto): ProjectCustomer {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    document: dto.document,
    documentType: dto.document_type,
    email: dto.email,
    phone: dto.phone,
    status: dto.status,
    url: dto.url,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}
