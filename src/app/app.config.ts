import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { credentialsInterceptor } from './core/http/credentials.interceptor';
import { sessionInterceptor } from './core/http/session.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'project_manager_csrf',
        headerName: 'X-CSRF-Token'
      }),
      withInterceptors([credentialsInterceptor, sessionInterceptor])
    )
  ]
};
