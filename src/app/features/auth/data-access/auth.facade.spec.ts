import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Observable, firstValueFrom, of, throwError } from 'rxjs';
import { Mock, vi } from 'vitest';

import { AuthApi } from './auth.api';
import { LoginRequestDto, LoginResponseDto } from './auth.dto';
import { AuthFacade } from './auth.facade';

describe('AuthFacade', () => {
  let api: {
    login: Mock<(credentials: LoginRequestDto) => Observable<LoginResponseDto>>;
    session: Mock<() => Observable<LoginResponseDto>>;
  };
  let router: { navigateByUrl: Mock<(url: string) => Promise<boolean>> };
  let facade: AuthFacade;

  beforeEach(() => {
    api = {
      login: vi.fn(),
      session: vi.fn(),
    };
    router = {
      navigateByUrl: vi.fn().mockResolvedValue(true),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthFacade,
        { provide: AuthApi, useValue: api },
        { provide: Router, useValue: router },
      ],
    });

    facade = TestBed.inject(AuthFacade);
  });

  it('deve iniciar sem usuario, sem loading e sem erro', () => {
    expect(facade.user()).toBeNull();
    expect(facade.isAuthenticated()).toBe(false);
    expect(facade.loading()).toBe(false);
    expect(facade.error()).toBeNull();
  });

  it('deve autenticar, armazenar usuario em memoria e navegar para dashboard', () => {
    api.login.mockReturnValue(
      of({
        id: 1,
        name: 'Tiago',
        username: 'tiago',
        email: 'tiago@example.com',
        cpf: '12345678900',
        expires_at: '2026-07-20T16:00:00Z',
      }),
    );

    facade.login('tiago', 'senha-secreta');

    expect(api.login).toHaveBeenCalledWith({ username: 'tiago', password: 'senha-secreta' });
    expect(facade.user()).toEqual({
      id: 1,
      name: 'Tiago',
      username: 'tiago',
      email: 'tiago@example.com',
      cpf: '12345678900',
      expiresAt: '2026-07-20T16:00:00Z',
    });
    expect(facade.isAuthenticated()).toBe(true);
    expect(facade.loading()).toBe(false);
    expect(facade.error()).toBeNull();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });

  it('deve mostrar mensagem segura quando as credenciais forem invalidas', () => {
    api.login.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' })),
    );

    facade.login('tiago', 'senha-incorreta');

    expect(facade.user()).toBeNull();
    expect(facade.loading()).toBe(false);
    expect(facade.error()).toBe('Usuario ou senha invalidos.');
  });

  it('deve restaurar sessao valida e armazenar usuario em memoria', async () => {
    api.session.mockReturnValue(
      of({
        id: 1,
        name: 'Tiago',
        username: 'tiago',
        email: 'tiago@example.com',
        cpf: '12345678900',
        expires_at: '2026-07-20T16:00:00Z',
      }),
    );

    const restored = await firstValueFrom(facade.restoreSession());

    expect(restored).toBe(true);
    expect(api.session).toHaveBeenCalled();
    expect(facade.isAuthenticated()).toBe(true);
    expect(facade.user()?.username).toBe('tiago');
  });

  it('deve manter usuario deslogado quando sessao nao for valida', async () => {
    api.session.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' })),
    );

    const restored = await firstValueFrom(facade.restoreSession());

    expect(restored).toBe(false);
    expect(facade.user()).toBeNull();
    expect(facade.isAuthenticated()).toBe(false);
  });
});
