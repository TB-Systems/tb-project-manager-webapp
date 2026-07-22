import { ChangeDetectionStrategy, Component, HostListener, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FeedbackStateComponent } from '../../../../shared/feedback-state/feedback-state.component';
import { CustomerFacade } from '../../data-access/customer.facade';

@Component({
  selector: 'app-customers-page',
  imports: [FeedbackStateComponent, RouterLink],
  templateUrl: './customers-page.component.html',
  styleUrl: './customers-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersPageComponent implements OnInit {
  protected readonly customers = inject(CustomerFacade);

  ngOnInit(): void {
    this.customers.loadCustomers();
  }

  @HostListener('window:scroll')
  protected onScroll(): void {
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.scrollHeight - 240;
    if (scrollPosition >= threshold) {
      this.customers.loadMoreCustomers();
    }
  }

  protected retry(): void {
    this.customers.loadCustomers();
  }

  protected customerStatusLabel(status: number): string {
    return customerStatusLabels[status] ?? 'Desconhecido';
  }

  protected formatDocument(document: string, documentType: number): string {
    if (documentType === 1 && document.length === 11) {
      return `${document.slice(0, 3)}.${document.slice(3, 6)}.${document.slice(6, 9)}-${document.slice(9)}`;
    }
    if (documentType === 2 && document.length === 14) {
      return `${document.slice(0, 2)}.${document.slice(2, 5)}.${document.slice(5, 8)}/${document.slice(8, 12)}-${document.slice(12)}`;
    }
    return document;
  }
}

const customerStatusLabels: Record<number, string> = {
  1: 'Ativo',
  2: 'Cancelado',
  3: 'Suspenso',
  4: 'Onboarding',
  5: 'Pagamento atrasado',
};
