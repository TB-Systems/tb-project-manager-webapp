import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';

import { CustomerApi } from '../../../customers/data-access/customer.api';
import { mapCustomerDto } from '../../../customers/data-access/customer.mapper';
import { Customer } from '../../../customers/domain/customer.model';
import { FeedbackStateComponent } from '../../../../shared/feedback-state/feedback-state.component';
import { ProjectApi } from '../../data-access/project.api';
import { mapCustomerProjectFormToRequest, mapCustomerProjectRelationDto } from '../../data-access/project.mapper';
import { CustomerProject, CustomerProjectFormValue } from '../../domain/project.model';

@Component({
  selector: 'app-customer-project-form-page',
  imports: [FeedbackStateComponent, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule, RouterLink],
  templateUrl: './customer-project-form-page.component.html',
  styleUrl: './customer-project-form-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerProjectFormPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projectsApi = inject(ProjectApi);
  private readonly customersApi = inject(CustomerApi);

  protected readonly customerProjectId = this.route.snapshot.paramMap.get('id');
  protected readonly projectId = signal(this.route.snapshot.queryParamMap.get('project_id') ?? '');
  protected readonly editing = this.customerProjectId !== null;
  protected readonly customers = signal<Customer[]>([]);
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly saveError = signal<string | null>(null);

  protected readonly form = new FormGroup({
    customerId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    projectValue: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\d+(,\d{0,2})?$/)],
    }),
    monthlyValue: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\d+(,\d{0,2})?$/)],
    }),
    dueDay: new FormControl(10, { nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(31)] }),
  });

  ngOnInit(): void {
    this.load();
    this.form.controls.projectValue.valueChanges.subscribe(() => this.applyMoneyMask(this.form.controls.projectValue));
    this.form.controls.monthlyValue.valueChanges.subscribe(() => this.applyMoneyMask(this.form.controls.monthlyValue));
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);

    if (!this.customerProjectId) {
      this.customersApi
        .list(1, 1000)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe({
          next: (response) => this.customers.set(response.items.map(mapCustomerDto)),
          error: () => this.error.set('Nao foi possivel carregar o formulario.'),
        });
      return;
    }

    forkJoin({
      customers: this.customersApi.list(1, 1000),
      detail: this.projectsApi.findCustomerProjectById(this.customerProjectId),
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.customers.set(response.customers.items.map(mapCustomerDto));
          this.patchForm(mapCustomerProjectRelationDto(response.detail));
        },
        error: () => this.error.set('Nao foi possivel carregar o formulario.'),
      });
  }

  protected save(): void {
    if (this.form.invalid || (!this.projectId() && !this.editing)) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.saveError.set(null);
    const value = this.form.getRawValue() satisfies CustomerProjectFormValue;
    const projectId = this.projectId();
    const request = mapCustomerProjectFormToRequest(projectId, value);
    const operation = this.customerProjectId
      ? this.projectsApi.updateCustomerProject(this.customerProjectId, request)
      : this.projectsApi.createCustomerProject(request);

    operation.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: (response) => void this.router.navigate(['/projects', response.project_id]),
      error: () => this.saveError.set('Nao foi possivel salvar o vinculo.'),
    });
  }

  private patchForm(customerProject: CustomerProject): void {
    this.projectId.set(customerProject.projectId);
    this.form.patchValue({
      customerId: customerProject.customerId,
      projectValue: centsToMoney(customerProject.projectValue),
      monthlyValue: centsToMoney(customerProject.monthlyValue),
      dueDay: customerProject.dueDay,
    });
  }

  private applyMoneyMask(control: FormControl<string>): void {
    const value = sanitizeMoneyInput(control.value);
    if (value !== control.value) {
      control.setValue(value, { emitEvent: false });
    }
  }
}

function sanitizeMoneyInput(value: string): string {
  const withoutDots = value.replace(/\./g, '');
  const onlyValidChars = withoutDots.replace(/[^\d,]/g, '');
  const [rawIntegerPart, ...decimalParts] = onlyValidChars.split(',');
  const integerPart = rawIntegerPart.replace(/^0+(?=\d)/, '');
  const decimalPart = decimalParts.join('').slice(0, 2);

  if (decimalParts.length > 0) {
    return `${integerPart || '0'},${decimalPart}`;
  }

  return integerPart;
}

function centsToMoney(value: number): string {
  const reais = Math.trunc(value / 100);
  const cents = Math.abs(value % 100);
  if (cents === 0) {
    return String(reais);
  }

  return `${reais},${String(cents).padStart(2, '0')}`;
}
