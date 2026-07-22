import { Injectable, computed, inject, signal } from '@angular/core';

import { DashboardOverview } from '../domain/dashboard-project.model';
import { DashboardApi } from './dashboard.api';
import { mapDashboardResponseDto } from './dashboard.mapper';

interface DashboardState {
  overview: DashboardOverview;
  loading: boolean;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class DashboardFacade {
  private readonly api = inject(DashboardApi);
  private readonly state = signal<DashboardState>({
    overview: {
      projects: [],
      total: 0,
    },
    loading: false,
    error: null,
  });

  readonly projects = computed(() => this.state().overview.projects);
  readonly total = computed(() => this.state().overview.total);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);

  load(): void {
    this.state.update((state) => ({ ...state, loading: true, error: null }));

    this.api.overview().subscribe({
      next: (response) => {
        this.state.update((state) => ({
          ...state,
          overview: mapDashboardResponseDto(response),
          loading: false,
        }));
      },
      error: () => {
        this.state.update((state) => ({
          ...state,
          loading: false,
          error: 'Nao foi possivel carregar o dashboard.',
        }));
      },
    });
  }
}
