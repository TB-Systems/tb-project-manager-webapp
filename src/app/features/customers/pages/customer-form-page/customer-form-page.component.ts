import { ChangeDetectionStrategy, Component, OnInit, effect, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { FeedbackStateComponent } from '../../../../shared/feedback-state/feedback-state.component';
import { CustomerFacade } from '../../data-access/customer.facade';
import { Customer, CustomerFormValue } from '../../domain/customer.model';

@Component({
  selector: 'app-customer-form-page',
  imports: [
    FeedbackStateComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './customer-form-page.component.html',
  styleUrl: './customer-form-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerFormPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly customers = inject(CustomerFacade);

  protected readonly customerId = this.route.snapshot.paramMap.get('id');
  protected readonly editing = this.customerId !== null;

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(100)] }),
    slug: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)],
    }),
    documentType: new FormControl(1, { nonNullable: true, validators: [Validators.required] }),
    document: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(100)] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(100)],
    }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(50), phoneValidator] }),
    status: new FormControl(1, { nonNullable: true, validators: [Validators.required] }),
    url: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(500)] }),
  });

  constructor() {
    effect(() => {
      const customer = this.customers.customer();
      if (customer && this.editing && !this.form.dirty) {
        this.patchForm(customer);
      }
    });
  }

  ngOnInit(): void {
    this.customers.clearDetail();
    this.form.controls.document.addValidators(documentValidator(this.form.controls.documentType));

    this.form.controls.documentType.valueChanges.subscribe(() => {
      this.applyDocumentMask();
      this.form.controls.document.updateValueAndValidity();
    });

    this.form.controls.document.valueChanges.subscribe(() => this.applyDocumentMask());
    this.form.controls.phone.valueChanges.subscribe(() => this.applyPhoneMask());

    if (this.customerId) {
      this.customers.loadCustomer(this.customerId);
    }
  }

  protected retry(): void {
    if (this.customerId) {
      this.customers.loadCustomer(this.customerId);
    }
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.customers.saveCustomer(this.customerId, this.form.getRawValue() satisfies CustomerFormValue, (customer) => {
      void this.router.navigate(['/customers', customer.id]);
    });
  }

  protected documentLabel(): string {
    const type = this.form.controls.documentType.value;
    if (type === 1) {
      return 'CPF';
    }
    if (type === 2) {
      return 'CNPJ';
    }
    return 'Documento';
  }

  private patchForm(customer: Customer): void {
    this.form.patchValue({
      name: customer.name,
      slug: customer.slug,
      documentType: customer.documentType,
      document: maskDocument(customer.document, customer.documentType),
      email: customer.email,
      phone: maskPhone(customer.phone),
      status: customer.status,
      url: customer.url,
    });
  }

  private applyDocumentMask(): void {
    const control = this.form.controls.document;
    const masked = maskDocument(control.value, this.form.controls.documentType.value);
    if (masked !== control.value) {
      control.setValue(masked, { emitEvent: false });
    }
  }

  private applyPhoneMask(): void {
    const control = this.form.controls.phone;
    const masked = maskPhone(control.value);
    if (masked !== control.value) {
      control.setValue(masked, { emitEvent: false });
    }
  }
}

function documentValidator(documentTypeControl: FormControl<number>): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    const value = onlyDigits(control.value ?? '');
    if (documentTypeControl.value === 1 && !isValidCpf(value)) {
      return { cpf: true };
    }
    if (documentTypeControl.value === 2 && !isValidCnpj(value)) {
      return { cnpj: true };
    }
    if (documentTypeControl.value === 3 && control.value.trim().length === 0) {
      return { required: true };
    }
    return null;
  };
}

function phoneValidator(control: AbstractControl<string>): ValidationErrors | null {
  const digits = onlyDigits(control.value ?? '');
  return digits.length >= 10 && digits.length <= 13 ? null : { phone: true };
}

function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

function maskDocument(value: string, documentType: number): string {
  const digits = onlyDigits(value);
  if (documentType === 1) {
    return maskCpf(digits);
  }
  if (documentType === 2) {
    return maskCnpj(digits);
  }
  return value;
}

function maskCpf(value: string): string {
  const digits = value.slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
}

function maskCnpj(value: string): string {
  const digits = value.slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4')
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5');
}

function maskPhone(value: string): string {
  const digits = onlyDigits(value).slice(0, 13);
  if (digits.startsWith('55')) {
    const ddd = digits.slice(2, 4);
    const number = digits.slice(4);
    if (number.length > 5) {
      return `+55 ${ddd} ${number.slice(0, 5)}-${number.slice(5)}`;
    }
    return `+55 ${ddd}${number ? ` ${number}` : ''}`.trim();
  }
  if (digits.length > 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length > 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  if (digits.length > 2) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  return digits;
}

function isValidCpf(value: string): boolean {
  if (value.length !== 11 || /^(\d)\1+$/.test(value)) {
    return false;
  }
  const first = cpfDigit(value.slice(0, 9));
  const second = cpfDigit(`${value.slice(0, 9)}${first}`);
  return value === `${value.slice(0, 9)}${first}${second}`;
}

function cpfDigit(base: string): number {
  const sum = base.split('').reduce((total, digit, index) => total + Number(digit) * (base.length + 1 - index), 0);
  const rest = (sum * 10) % 11;
  return rest === 10 ? 0 : rest;
}

function isValidCnpj(value: string): boolean {
  if (value.length !== 14 || /^(\d)\1+$/.test(value)) {
    return false;
  }
  const first = cnpjDigit(value.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const second = cnpjDigit(`${value.slice(0, 12)}${first}`, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return value === `${value.slice(0, 12)}${first}${second}`;
}

function cnpjDigit(base: string, weights: number[]): number {
  const sum = base.split('').reduce((total, digit, index) => total + Number(digit) * weights[index], 0);
  const rest = sum % 11;
  return rest < 2 ? 0 : 11 - rest;
}
