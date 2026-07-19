import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, map } from 'rxjs';

import { AuthUser } from '../domain/auth-user.model';
import { AuthApi } from './auth.api';
import { mapLoginResponseDto } from './auth.mapper';

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly api = inject(AuthApi);
  private readonly router = inject(Router);
  private readonly state = signal<AuthState>({
    user: null,
    loading: false,
    error: null
  });

  readonly user = computed(() => this.state().user);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);

  login(username: string, password: string): void {
    this.state.update((state) => ({ ...state, loading: true, error: null }));

    this.api
      .login({ username, password })
      .pipe(
        map(mapLoginResponseDto),
        finalize(() => {
          this.state.update((state) => ({ ...state, loading: false }));
        })
      )
      .subscribe({
        next: (user) => {
          this.state.update((state) => ({ ...state, user }));
          void this.router.navigateByUrl('/dashboard');
        },
        error: (error: HttpErrorResponse) => {
          this.state.update((state) => ({
            ...state,
            error: getLoginErrorMessage(error)
          }));
        }
      });
  }
}

function getLoginErrorMessage(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'Nao foi possivel conectar ao servidor.';
  }

  if (error.status === 401) {
    return 'Usuario ou senha invalidos.';
  }

  if (error.status === 429) {
    return 'Muitas tentativas de login. Tente novamente em alguns minutos.';
  }

  if (Array.isArray(error.error?.messages) && error.error.messages.length > 0) {
    return 'Nao foi possivel fazer login. Verifique os dados informados.';
  }

  return 'Erro inesperado ao fazer login.';
}
