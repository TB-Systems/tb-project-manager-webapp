import { HttpInterceptorFn } from '@angular/common/http';

const csrfCookieName = 'project_manager_csrf';
const csrfHeaderName = 'X-CSRF-Token';

export const credentialsInterceptor: HttpInterceptorFn = (request, next) => {
  const csrfToken = getCookie(csrfCookieName);
  const requestWithCredentials = request.clone({
    withCredentials: true,
    setHeaders: csrfToken
      ? {
          [csrfHeaderName]: csrfToken,
        }
      : {},
  });

  return next(requestWithCredentials);
};

function getCookie(name: string): string | null {
  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${encodeURIComponent(name)}=`));

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.split('=').slice(1).join('='));
}
