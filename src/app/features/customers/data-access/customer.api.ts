import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { apiConfig } from '../../../core/config/api.config';
import { CustomerDto, CustomerListResponseDto, CustomerRequestDto } from './customer.dto';

@Injectable({ providedIn: 'root' })
export class CustomerApi {
  private readonly http = inject(HttpClient);

  list(page: number, limit: number): Observable<CustomerListResponseDto> {
    return this.http.get<CustomerListResponseDto>(`${apiConfig.baseUrl}/customers`, {
      params: {
        page,
        limit,
      },
    });
  }

  findById(id: string): Observable<CustomerDto> {
    return this.http.get<CustomerDto>(`${apiConfig.baseUrl}/customers/${id}`);
  }

  create(request: CustomerRequestDto): Observable<CustomerDto> {
    return this.http.post<CustomerDto>(`${apiConfig.baseUrl}/customers`, request);
  }

  update(id: string, request: CustomerRequestDto): Observable<CustomerDto> {
    return this.http.put<CustomerDto>(`${apiConfig.baseUrl}/customers/${id}`, request);
  }

  delete(id: string): Observable<unknown> {
    return this.http.delete(`${apiConfig.baseUrl}/customers/${id}`);
  }
}
