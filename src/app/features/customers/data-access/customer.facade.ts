import { Injectable, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';

import { Customer, CustomerFormValue } from '../domain/customer.model';
import { CustomerApi } from './customer.api';
import { mapCustomerDto, mapCustomerFormToRequest, mapCustomerListDto } from './customer.mapper';

interface CustomersListState {
  customers: Customer[];
  page: number;
  pageCount: number;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
}

interface CustomerDetailState {
  customer: Customer | null;
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  error: string | null;
  saveError: string | null;
}

@Injectable({ providedIn: 'root' })
export class CustomerFacade {
  private readonly api = inject(CustomerApi);
  private readonly limit = 10;

  private readonly listState = signal<CustomersListState>({
    customers: [],
    page: 0,
    pageCount: 1,
    loading: false,
    loadingMore: false,
    error: null,
  });

  private readonly detailState = signal<CustomerDetailState>({
    customer: null,
    loading: false,
    saving: false,
    deleting: false,
    error: null,
    saveError: null,
  });

  readonly customers = computed(() => this.listState().customers);
  readonly listLoading = computed(() => this.listState().loading);
  readonly listLoadingMore = computed(() => this.listState().loadingMore);
  readonly listError = computed(() => this.listState().error);
  readonly hasNextPage = computed(() => this.listState().page < this.listState().pageCount);

  readonly customer = computed(() => this.detailState().customer);
  readonly detailLoading = computed(() => this.detailState().loading);
  readonly saving = computed(() => this.detailState().saving);
  readonly deleting = computed(() => this.detailState().deleting);
  readonly detailError = computed(() => this.detailState().error);
  readonly saveError = computed(() => this.detailState().saveError);

  loadCustomers(): void {
    this.listState.set({
      customers: [],
      page: 0,
      pageCount: 1,
      loading: true,
      loadingMore: false,
      error: null,
    });

    this.loadCustomersPage(1, false);
  }

  loadMoreCustomers(): void {
    const state = this.listState();
    if (state.loading || state.loadingMore || state.page >= state.pageCount) {
      return;
    }

    this.listState.update((current) => ({ ...current, loadingMore: true }));
    this.loadCustomersPage(state.page + 1, true);
  }

  loadCustomer(id: string): void {
    this.detailState.update((state) => ({
      ...state,
      customer: null,
      loading: true,
      error: null,
      saveError: null,
    }));

    this.api.findById(id).subscribe({
      next: (response) => {
        this.detailState.update((state) => ({
          ...state,
          customer: mapCustomerDto(response),
          loading: false,
        }));
      },
      error: () => {
        this.detailState.update((state) => ({
          ...state,
          loading: false,
          error: 'Nao foi possivel carregar o cliente.',
        }));
      },
    });
  }

  saveCustomer(id: string | null, value: CustomerFormValue, onSuccess: (customer: Customer) => void): void {
    this.detailState.update((state) => ({ ...state, saving: true, saveError: null }));
    const request = mapCustomerFormToRequest(value);
    const operation = id ? this.api.update(id, request) : this.api.create(request);

    operation.pipe(finalize(() => this.detailState.update((state) => ({ ...state, saving: false })))).subscribe({
      next: (response) => {
        const customer = mapCustomerDto(response);
        this.detailState.update((state) => ({ ...state, customer }));
        onSuccess(customer);
      },
      error: () => {
        this.detailState.update((state) => ({
          ...state,
          saveError: 'Nao foi possivel salvar o cliente.',
        }));
      },
    });
  }

  deleteCustomer(id: string, onSuccess: () => void): void {
    this.detailState.update((state) => ({ ...state, deleting: true, saveError: null }));

    this.api.delete(id).pipe(finalize(() => this.detailState.update((state) => ({ ...state, deleting: false })))).subscribe({
      next: () => onSuccess(),
      error: () => {
        this.detailState.update((state) => ({
          ...state,
          saveError: 'Nao foi possivel deletar o cliente. Verifique se ele possui projetos vinculados.',
        }));
      },
    });
  }

  clearDetail(): void {
    this.detailState.set({
      customer: null,
      loading: false,
      saving: false,
      deleting: false,
      error: null,
      saveError: null,
    });
  }

  private loadCustomersPage(page: number, append: boolean): void {
    this.api.list(page, this.limit).subscribe({
      next: (response) => {
        const data = mapCustomerListDto(response);
        this.listState.update((state) => ({
          ...state,
          customers: append ? [...state.customers, ...data.customers] : data.customers,
          page: data.page,
          pageCount: data.pageCount,
          loading: false,
          loadingMore: false,
        }));
      },
      error: () => {
        this.listState.update((state) => ({
          ...state,
          loading: false,
          loadingMore: false,
          error: 'Nao foi possivel carregar os clientes.',
        }));
      },
    });
  }
}
