import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { apiConfig } from '../../../core/config/api.config';
import { DashboardResponseDto } from './dashboard.dto';

@Injectable({ providedIn: 'root' })
export class DashboardApi {
  private readonly http = inject(HttpClient);

  overview(): Observable<DashboardResponseDto> {
    return this.http.get<DashboardResponseDto>(`${apiConfig.baseUrl}/dashboard`);
  }
}
