import { HttpRequest, HttpResponse } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';

import { credentialsInterceptor } from './credentials.interceptor';

describe('credentialsInterceptor', () => {
  beforeEach(() => {
    document.cookie = 'project_manager_csrf=; Max-Age=0; path=/';
  });

  it('deve enviar credenciais em todas as requisicoes', async () => {
    const request = new HttpRequest('GET', '/api/v1/dashboard');

    await firstValueFrom(
      credentialsInterceptor(request, (handledRequest) => {
        expect(handledRequest.withCredentials).toBe(true);
        return of(new HttpResponse());
      }),
    );
  });

  it('deve adicionar header CSRF quando cookie existir', async () => {
    document.cookie = 'project_manager_csrf=csrf-token; path=/';
    const request = new HttpRequest('POST', '/api/v1/auth/logout', {});

    await firstValueFrom(
      credentialsInterceptor(request, (handledRequest) => {
        expect(handledRequest.withCredentials).toBe(true);
        expect(handledRequest.headers.get('X-CSRF-Token')).toBe('csrf-token');
        return of(new HttpResponse());
      }),
    );
  });
});
