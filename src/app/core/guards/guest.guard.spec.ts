import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { Observable, firstValueFrom, of } from 'rxjs';

import { AuthFacade } from '../../features/auth/data-access/auth.facade';
import { guestGuard } from './guest.guard';

describe('guestGuard', () => {
  let auth: { restoreSession: () => Observable<boolean> };
  let router: { parseUrl: (url: string) => UrlTree };
  let dashboardTree: UrlTree;

  beforeEach(() => {
    dashboardTree = {} as UrlTree;
    auth = {
      restoreSession: () => of(false),
    };
    router = {
      parseUrl: vi.fn().mockReturnValue(dashboardTree),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthFacade, useValue: auth },
        { provide: Router, useValue: router },
      ],
    });
  });

  it('deve permitir acesso ao login quando usuario nao esta autenticado', async () => {
    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(guestGuard({} as never, {} as never) as Observable<boolean | UrlTree>),
    );

    expect(result).toBe(true);
  });

  it('deve redirecionar para dashboard quando usuario ja esta autenticado', async () => {
    auth.restoreSession = () => of(true);

    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(guestGuard({} as never, {} as never) as Observable<boolean | UrlTree>),
    );

    expect(router.parseUrl).toHaveBeenCalledWith('/dashboard');
    expect(result).toBe(dashboardTree);
  });
});
