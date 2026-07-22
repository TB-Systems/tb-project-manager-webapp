import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { DashboardFacade } from '../../data-access/dashboard.facade';
import { DashboardCustomer, DashboardProjectService } from '../../domain/dashboard-project.model';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    DatePipe,
    MatButtonModule,
    MatDividerModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit {
  protected readonly dashboard = inject(DashboardFacade);

  ngOnInit(): void {
    this.dashboard.load();
  }

  protected retry(): void {
    this.dashboard.load();
  }

  protected projectStatusLabel(status: number): string {
    return projectStatusLabels[status] ?? 'Desconhecido';
  }

  protected projectTypeLabel(type: number): string {
    return projectTypeLabels[type] ?? 'Outro';
  }

  protected customerStatusLabel(status: number): string {
    return customerStatusLabels[status] ?? 'Desconhecido';
  }

  protected paymentStatusLabel(status: number): string {
    return paymentStatusLabels[status] ?? 'Desconhecido';
  }

  protected projectStatusClass(status: number): string {
    return `status-${status}`;
  }

  protected money(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 100);
  }

  protected customerDetailUrl(customer: DashboardCustomer): string {
    return `/customers/${customer.id}`;
  }

  protected serviceDetailUrl(service: DashboardProjectService): string {
    return `/project-services/${service.id}`;
  }
}

const projectStatusLabels: Record<number, string> = {
  1: 'Backlog',
  2: 'Discovery',
  3: 'Desenvolvimento',
  4: 'Staging',
  5: 'Live',
  6: 'Pausado',
  7: 'Down',
  8: 'Arquivado',
};

const projectTypeLabels: Record<number, string> = {
  1: 'Backend',
  2: 'Frontend',
  3: 'Android',
  4: 'iOS',
  5: 'Desktop',
  6: 'Automacao',
  7: 'Database',
  8: 'Outro',
};

const customerStatusLabels: Record<number, string> = {
  1: 'Ativo',
  2: 'Cancelado',
  3: 'Suspenso',
  4: 'Onboarding',
  5: 'Pagamento atrasado',
};

const paymentStatusLabels: Record<number, string> = {
  1: 'Primeira parte pendente',
  2: 'Primeira parte paga',
  3: 'Segunda parte pendente',
  4: 'Segunda parte paga',
};
