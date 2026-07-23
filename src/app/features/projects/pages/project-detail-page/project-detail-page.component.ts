import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { FeedbackStateComponent } from '../../../../shared/feedback-state/feedback-state.component';
import { ProjectFacade } from '../../data-access/project.facade';
import { ProjectService } from '../../domain/project.model';

@Component({
  selector: 'app-project-detail-page',
  imports: [DatePipe, FeedbackStateComponent, MatDialogModule, RouterLink],
  templateUrl: './project-detail-page.component.html',
  styleUrl: './project-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  protected readonly projects = inject(ProjectFacade);
  protected readonly projectId = this.route.snapshot.paramMap.get('id') ?? '';

  ngOnInit(): void {
    this.projects.loadProject(this.projectId);
  }

  protected retry(): void {
    this.projects.loadProject(this.projectId);
  }

  protected confirmDeleteProject(): void {
    this.confirm('Deletar projeto?', 'Projetos com cliente vinculado nao devem ser deletados.').subscribe(
      (confirmed) => {
        if (confirmed) {
          this.projects.deleteProject(this.projectId, () => void this.router.navigate(['/projects']));
        }
      },
    );
  }

  protected confirmUnlinkCustomer(customerProjectId: string): void {
    this.confirm('Desvincular cliente?', 'O vinculo comercial entre cliente e projeto sera removido.').subscribe(
      (confirmed) => {
        if (confirmed) {
          this.projects.unlinkCustomerProject(customerProjectId, this.projectId);
        }
      },
    );
  }

  protected confirmDeleteService(serviceId: string): void {
    this.confirm('Deletar servico?', 'Essa acao remove o servico vinculado ao projeto.').subscribe(
      (confirmed) => {
        if (confirmed) {
          this.projects.deleteService(serviceId, this.projectId);
        }
      },
    );
  }

  protected openServiceStatusDialog(service: ProjectService): void {
    this.dialog
      .open(ProjectServiceStatusDialogComponent, {
        width: 'min(420px, calc(100vw - 32px))',
        data: {
          serviceName: service.name,
          status: service.status,
          statuses: projectStatusOptions,
        },
      })
      .afterClosed()
      .subscribe((status: number | undefined) => {
        if (status && status !== service.status) {
          this.projects.updateServiceStatus(service, status, this.projectId);
        }
      });
  }

  protected projectStatusLabel(status: number): string {
    return projectStatusLabels[status] ?? 'Desconhecido';
  }

  protected projectTypeLabel(type: number): string {
    return projectTypeLabels[type] ?? 'Outro';
  }

  protected paymentStatusLabel(status: number): string {
    return paymentStatusLabels[status] ?? 'Desconhecido';
  }

  protected money(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value / 100);
  }

  private confirm(title: string, message: string) {
    return this.dialog
      .open(ProjectConfirmDialogComponent, {
        width: 'min(420px, calc(100vw - 32px))',
        data: { title, message },
      })
      .afterClosed();
  }
}

@Component({
  selector: 'app-project-confirm-dialog',
  template: `
    <section class="confirm-dialog">
      <h2>{{ data.title }}</h2>
      <p>{{ data.message }}</p>
      <div>
        <button class="secondary-action" type="button" (click)="close(false)">Cancelar</button>
        <button class="danger-action" type="button" (click)="close(true)">Confirmar</button>
      </div>
    </section>
  `,
  styles: `
    .confirm-dialog {
      display: grid;
      gap: 14px;
      padding: 22px;
      background: var(--mat-sys-surface-container-lowest);
    }
    h2,
    p {
      margin: 0;
    }
    h2 {
      font-size: 1.1rem;
    }
    p {
      color: var(--mat-sys-on-surface-variant);
    }
    div {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 4px;
    }
    button {
      min-height: 40px;
      padding: 0 16px;
      border: 0;
      border-radius: 999px;
      font-family: inherit;
      font-size: 0.86rem;
      font-weight: 700;
      cursor: pointer;
    }
    .secondary-action {
      background: var(--mat-sys-surface-container-high);
    }
    .danger-action {
      background: var(--mat-sys-error);
      color: var(--mat-sys-on-error);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectConfirmDialogComponent {
  protected readonly data = inject<{ title: string; message: string }>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ProjectConfirmDialogComponent>);

  close(confirmed: boolean): void {
    this.dialogRef.close(confirmed);
  }
}

@Component({
  selector: 'app-project-service-status-dialog',
  template: `
    <section class="status-dialog">
      <div>
        <p>Servico</p>
        <h2>{{ data.serviceName }}</h2>
      </div>

      <label>
        Status
        <select [value]="selectedStatus" (change)="onStatusChange($any($event.target).value)">
          @for (status of data.statuses; track status.value) {
            <option [value]="status.value">{{ status.label }}</option>
          }
        </select>
      </label>

      <div class="dialog-actions">
        <button class="secondary-action" type="button" (click)="close()">Cancelar</button>
        <button class="primary-action" type="button" (click)="save()">Atualizar</button>
      </div>
    </section>
  `,
  styles: `
    .status-dialog {
      display: grid;
      gap: 18px;
      padding: 22px;
      background: var(--mat-sys-surface-container-lowest);
    }
    h2,
    p {
      margin: 0;
    }
    h2 {
      font-size: 1.12rem;
      line-height: 1.2;
    }
    p,
    label {
      color: var(--mat-sys-on-surface-variant);
      font-size: 0.82rem;
      font-weight: 700;
    }
    label {
      display: grid;
      gap: 8px;
    }
    select {
      min-height: 48px;
      width: 100%;
      border: 0;
      border-radius: 8px;
      padding: 0 14px;
      background: color-mix(in srgb, var(--tib-violet) 16%, var(--mat-sys-surface-container-lowest));
      color: var(--mat-sys-on-surface);
      font-family: inherit;
      font-size: 0.95rem;
      outline: 2px solid transparent;
    }
    select:focus-visible {
      outline-color: var(--mat-sys-primary);
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 2px;
    }
    button {
      min-height: 40px;
      padding: 0 16px;
      border: 0;
      border-radius: 999px;
      font-family: inherit;
      font-size: 0.86rem;
      font-weight: 700;
      cursor: pointer;
    }
    .secondary-action {
      background: var(--mat-sys-surface-container-high);
      color: var(--mat-sys-on-surface);
    }
    .primary-action {
      background: var(--mat-sys-primary);
      color: var(--mat-sys-on-primary);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectServiceStatusDialogComponent {
  protected readonly data = inject<{
    serviceName: string;
    status: number;
    statuses: StatusOption[];
  }>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ProjectServiceStatusDialogComponent>);
  protected selectedStatus = this.data.status;

  onStatusChange(value: string): void {
    this.selectedStatus = Number(value);
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.dialogRef.close(this.selectedStatus);
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

interface StatusOption {
  value: number;
  label: string;
}

const projectStatusOptions: StatusOption[] = Object.entries(projectStatusLabels).map(([value, label]) => ({
  value: Number(value),
  label,
}));

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

const paymentStatusLabels: Record<number, string> = {
  1: 'Primeira parte pendente',
  2: 'Primeira parte paga',
  3: 'Segunda parte pendente',
  4: 'Segunda parte paga',
};
