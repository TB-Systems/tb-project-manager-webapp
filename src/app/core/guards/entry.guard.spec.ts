import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { Observable, firstValueFrom, of } from 'rxjs';

import { AuthFacade } from '../../features/auth/data-access/auth.facade';
import { entryGuard } from './entry.guard';

describe('entryGuard', () => {
  let auth: { restoreSession: () => Observable<boolean> };
  let router: { parseUrl: ReturnType<typeof vi.fn> };
  let dashboardTree: UrlTree;
  let loginTree: UrlTree;

  beforeEach(() => {
    dashboardTree = {} as UrlTree;
    loginTree = {} as UrlTree;
    auth = {
      restoreSession: () => of(false),
    };
    router = {
      parseUrl: vi.fn((url: string) => (url === '/dashboard' ? dashboardTree : loginTree)),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthFacade, useValue: auth },
        { provide: Router, useValue: router },
      ],
    });
  });

  it('deve redirecionar para dashboard quando houver sessao valida', async () => {
    auth.restoreSession = () => of(true);

    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(entryGuard({} as never, {} as never) as Observable<UrlTree>),
    );

    expect(router.parseUrl).toHaveBeenCalledWith('/dashboard');
    expect(result).toBe(dashboardTree);
  });

  it('deve redirecionar para login quando nao houver sessao valida', async () => {
    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(entryGuard({} as never, {} as never) as Observable<UrlTree>),
    );

    expect(router.parseUrl).toHaveBeenCalledWith('/login');
    expect(result).toBe(loginTree);
  });
});
