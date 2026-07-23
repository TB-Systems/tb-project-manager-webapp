import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { AuthFacade } from '../../features/auth/data-access/auth.facade';

export const sessionInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthFacade);

  return next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && shouldInvalidateSession(request.url)) {
        auth.invalidateSession();
      }

      return throwError(() => error);
    }),
  );
};

function shouldInvalidateSession(url: string): boolean {
  return !url.includes('/auth/login') && !url.includes('/auth/session');
}
