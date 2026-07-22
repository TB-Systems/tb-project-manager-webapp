import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { apiConfig } from '../../../core/config/api.config';
import { AuthSessionResponseDto, LoginRequestDto, LoginResponseDto } from './auth.dto';

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private readonly http = inject(HttpClient);

  login(credentials: LoginRequestDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(`${apiConfig.baseUrl}/auth/login`, credentials);
  }

  session(): Observable<AuthSessionResponseDto> {
    return this.http.get<AuthSessionResponseDto>(`${apiConfig.baseUrl}/auth/session`);
  }

  logout(): Observable<{ logged_out: boolean }> {
    return this.http.post<{ logged_out: boolean }>(`${apiConfig.baseUrl}/auth/logout`, {});
  }
}
