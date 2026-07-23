import {
  Project,
  ProjectCustomer,
  ProjectCustomerProject,
  ProjectFormValue,
  ProjectService,
} from '../domain/project.model';
import {
  ProjectCustomerDto,
  ProjectCustomerProjectDto,
  ProjectDto,
  ProjectRequestDto,
  ProjectServiceDto,
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

export function mapProjectFormToRequest(value: ProjectFormValue): ProjectRequestDto {
  return {
    name: value.name,
    description: value.description,
    slug: value.slug,
    repo_url: value.repoUrl,
  };
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
