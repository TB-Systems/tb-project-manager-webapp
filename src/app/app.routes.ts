import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { entryGuard } from './core/guards/entry.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/pages/login-page/login-page.component').then(
        (m) => m.LoginPageComponent,
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    canActivate: [entryGuard],
    loadComponent: () =>
      import('./features/auth/pages/login-page/login-page.component').then(
        (m) => m.LoginPageComponent,
      ),
  },
  {
    canActivate: [authGuard],
    path: '',
    loadComponent: () =>
      import('./core/layout/app-shell/app-shell.component').then((m) => m.AppShellComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard-page/dashboard-page.component').then(
            (m) => m.DashboardPageComponent,
          ),
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./features/customers/pages/customers-page/customers-page.component').then(
            (m) => m.CustomersPageComponent,
          ),
      },
      {
        path: 'customers/new',
        loadComponent: () =>
          import('./features/customers/pages/customer-form-page/customer-form-page.component').then(
            (m) => m.CustomerFormPageComponent,
          ),
      },
      {
        path: 'customers/:id/edit',
        loadComponent: () =>
          import('./features/customers/pages/customer-form-page/customer-form-page.component').then(
            (m) => m.CustomerFormPageComponent,
          ),
      },
      {
        path: 'customers/:id',
        loadComponent: () =>
          import(
            './features/customers/pages/customer-detail-page/customer-detail-page.component'
          ).then((m) => m.CustomerDetailPageComponent),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./features/projects/pages/projects-page/projects-page.component').then(
            (m) => m.ProjectsPageComponent,
          ),
      },
      {
        path: 'projects/new',
        loadComponent: () =>
          import('./features/projects/pages/project-form-page/project-form-page.component').then(
            (m) => m.ProjectFormPageComponent,
          ),
      },
      {
        path: 'projects/:id/edit',
        loadComponent: () =>
          import('./features/projects/pages/project-form-page/project-form-page.component').then(
            (m) => m.ProjectFormPageComponent,
          ),
      },
      {
        path: 'projects/:id',
        loadComponent: () =>
          import('./features/projects/pages/project-detail-page/project-detail-page.component').then(
            (m) => m.ProjectDetailPageComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
