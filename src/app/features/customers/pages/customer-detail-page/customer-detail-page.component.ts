import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { FeedbackStateComponent } from '../../../../shared/feedback-state/feedback-state.component';
import { CustomerFacade } from '../../data-access/customer.facade';
import { Customer } from '../../domain/customer.model';

@Component({
  selector: 'app-customer-detail-page',
  imports: [DatePipe, FeedbackStateComponent, MatDialogModule, RouterLink],
  templateUrl: './customer-detail-page.component.html',
  styleUrl: './customer-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  protected readonly customers = inject(CustomerFacade);

  protected readonly customerId = this.route.snapshot.paramMap.get('id') ?? '';

  ngOnInit(): void {
    this.customers.loadCustomer(this.customerId);
  }

  protected retry(): void {
    this.customers.loadCustomer(this.customerId);
  }

  protected confirmDelete(): void {
    const dialogRef = this.dialog.open(CustomerDeleteDialogComponent, {
      width: 'min(420px, calc(100vw - 32px))',
      panelClass: 'customer-delete-dialog-panel',
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.customers.deleteCustomer(this.customerId, () => {
          void this.router.navigate(['/customers']);
        });
      }
    });
  }

  protected customerStatusLabel(status: number): string {
    return customerStatusLabels[status] ?? 'Desconhecido';
  }

  protected documentTypeLabel(type: number): string {
    return documentTypeLabels[type] ?? 'Outro';
  }

  protected formatDocument(customer: Customer): string {
    if (customer.documentType === 1 && customer.document.length === 11) {
      return `${customer.document.slice(0, 3)}.${customer.document.slice(3, 6)}.${customer.document.slice(6, 9)}-${customer.document.slice(9)}`;
    }
    if (customer.documentType === 2 && customer.document.length === 14) {
      return `${customer.document.slice(0, 2)}.${customer.document.slice(2, 5)}.${customer.document.slice(5, 8)}/${customer.document.slice(8, 12)}-${customer.document.slice(12)}`;
    }
    return customer.document;
  }
}

@Component({
  selector: 'app-customer-delete-dialog',
  template: `
    <section class="delete-dialog">
      <h2>Deletar cliente?</h2>
      <p>Essa acao so deve ser confirmada se o cliente nao possuir projetos vinculados.</p>
      <div>
        <button class="secondary-action" type="button" (click)="close(false)">Cancelar</button>
        <button class="danger-action" type="button" (click)="close(true)">Deletar</button>
      </div>
    </section>
  `,
  styles: `
    .delete-dialog {
      display: grid;
      gap: 14px;
      padding: 22px;
      background: var(--mat-sys-surface-container-lowest);
      color: var(--mat-sys-on-surface);
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
      color: var(--mat-sys-on-surface);
    }

    .danger-action {
      background: var(--mat-sys-error);
      color: var(--mat-sys-on-error);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerDeleteDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CustomerDeleteDialogComponent>);

  close(confirmed: boolean): void {
    this.dialogRef.close(confirmed);
  }
}

const customerStatusLabels: Record<number, string> = {
  1: 'Ativo',
  2: 'Cancelado',
  3: 'Suspenso',
  4: 'Onboarding',
  5: 'Pagamento atrasado',
};

const documentTypeLabels: Record<number, string> = {
  1: 'CPF',
  2: 'CNPJ',
  3: 'Outro',
};
