import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';

import { AuthFacade } from '../../features/auth/data-access/auth.facade';

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthFacade);
  const router = inject(Router);

  return auth
    .restoreSession()
    .pipe(map((isAuthenticated) => (isAuthenticated ? router.parseUrl('/dashboard') : true)));
};
