import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';

import { AuthFacade } from '../../features/auth/data-access/auth.facade';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let auth: { isAuthenticated: () => boolean };
  let router: { parseUrl: (url: string) => UrlTree };
  let loginTree: UrlTree;

  beforeEach(() => {
    loginTree = {} as UrlTree;
    auth = {
      isAuthenticated: () => false
    };
    router = {
      parseUrl: vi.fn().mockReturnValue(loginTree)
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthFacade, useValue: auth },
        { provide: Router, useValue: router }
      ]
    });
  });

  it('deve permitir acesso quando usuario esta autenticado', () => {
    auth.isAuthenticated = () => true;

    const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

    expect(result).toBe(true);
  });

  it('deve redirecionar para login quando usuario nao esta autenticado', () => {
    const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

    expect(router.parseUrl).toHaveBeenCalledWith('/login');
    expect(result).toBe(loginTree);
  });
});
