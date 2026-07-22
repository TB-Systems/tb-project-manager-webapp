import { DashboardOverview } from '../domain/dashboard-project.model';
import { DashboardResponseDto } from './dashboard.dto';

export function mapDashboardResponseDto(dto: DashboardResponseDto): DashboardOverview {
  return {
    total: dto.total,
    projects: dto.items.map((project) => ({
      id: project.id,
      name: project.name,
      description: project.description,
      slug: project.slug,
      repoUrl: project.repo_url,
      status: project.status,
      customer: project.customer
        ? {
            id: project.customer.id,
            name: project.customer.name,
            slug: project.customer.slug,
            status: project.customer.status,
            projectValue: project.customer.project_value,
            monthlyValue: project.customer.monthly_value,
            dueDay: project.customer.due_day,
            projectPaymentStatus: project.customer.project_payment_status,
            lastPayment: project.customer.last_payment,
          }
        : null,
      services: project.services.map((service) => ({
        id: service.id,
        name: service.name,
        type: service.type,
        url: service.url,
        repoUrl: service.repo_url,
        status: service.status,
        healthCheckUrl: service.health_check_url,
      })),
      createdAt: project.created_at,
      updatedAt: project.updated_at,
    })),
  };
}
