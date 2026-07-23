import { HttpErrorResponse, HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of, throwError } from 'rxjs';
import { Mock, vi } from 'vitest';

import { AuthFacade } from '../../features/auth/data-access/auth.facade';
import { sessionInterceptor } from './session.interceptor';

describe('sessionInterceptor', () => {
  let auth: { invalidateSession: Mock<() => void> };

  beforeEach(() => {
    auth = {
      invalidateSession: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: AuthFacade, useValue: auth }],
    });
  });

  it('deve invalidar sessao quando endpoint protegido responder 401', async () => {
    const request = new HttpRequest('GET', '/api/v1/projects/1');

    await expect(
      firstValueFrom(
        TestBed.runInInjectionContext(() =>
          sessionInterceptor(request, () =>
            throwError(() => new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' })),
          ),
        ),
      ),
    ).rejects.toBeInstanceOf(HttpErrorResponse);

    expect(auth.invalidateSession).toHaveBeenCalledOnce();
  });

  it('nao deve invalidar sessao quando login responder 401', async () => {
    const request = new HttpRequest('POST', '/api/v1/auth/login', {});

    await expect(
      firstValueFrom(
        TestBed.runInInjectionContext(() =>
          sessionInterceptor(request, () =>
            throwError(() => new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' })),
          ),
        ),
      ),
    ).rejects.toBeInstanceOf(HttpErrorResponse);

    expect(auth.invalidateSession).not.toHaveBeenCalled();
  });

  it('deve manter fluxo normal quando resposta for sucesso', async () => {
    const request = new HttpRequest('GET', '/api/v1/dashboard');
    const response = await firstValueFrom(
      TestBed.runInInjectionContext(() => sessionInterceptor(request, () => of(new HttpResponse({ status: 200 })))),
    );

    const httpResponse = response as HttpResponse<unknown>;
    expect(httpResponse).toBeInstanceOf(HttpResponse);
    expect(httpResponse.status).toBe(200);
    expect(auth.invalidateSession).not.toHaveBeenCalled();
  });
});
