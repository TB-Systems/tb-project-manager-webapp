import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, finalize } from 'rxjs';

import { Project, ProjectFormValue, ProjectService } from '../domain/project.model';
import { ProjectApi } from './project.api';
import { mapProjectDto, mapProjectFormToRequest, mapProjectServiceDto } from './project.mapper';

interface ProjectListState {
  projects: Project[];
  page: number;
  pageCount: number;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
}

interface ProjectDetailState {
  project: Project | null;
  services: ProjectService[];
  loading: boolean;
  servicesLoading: boolean;
  saving: boolean;
  deleting: boolean;
  error: string | null;
  actionError: string | null;
}

@Injectable({ providedIn: 'root' })
export class ProjectFacade {
  private readonly api = inject(ProjectApi);
  private readonly limit = 10;

  private readonly listState = signal<ProjectListState>({
    projects: [],
    page: 0,
    pageCount: 1,
    loading: false,
    loadingMore: false,
    error: null,
  });

  private readonly detailState = signal<ProjectDetailState>({
    project: null,
    services: [],
    loading: false,
    servicesLoading: false,
    saving: false,
    deleting: false,
    error: null,
    actionError: null,
  });

  readonly projects = computed(() => this.listState().projects);
  readonly listLoading = computed(() => this.listState().loading);
  readonly listLoadingMore = computed(() => this.listState().loadingMore);
  readonly listError = computed(() => this.listState().error);
  readonly hasNextPage = computed(() => this.listState().page < this.listState().pageCount);

  readonly project = computed(() => this.detailState().project);
  readonly services = computed(() => this.detailState().services);
  readonly detailLoading = computed(() => this.detailState().loading);
  readonly servicesLoading = computed(() => this.detailState().servicesLoading);
  readonly saving = computed(() => this.detailState().saving);
  readonly deleting = computed(() => this.detailState().deleting);
  readonly detailError = computed(() => this.detailState().error);
  readonly actionError = computed(() => this.detailState().actionError);

  loadProjects(): void {
    this.listState.set({
      projects: [],
      page: 0,
      pageCount: 1,
      loading: true,
      loadingMore: false,
      error: null,
    });
    this.loadProjectsPage(1, false);
  }

  loadMoreProjects(): void {
    const state = this.listState();
    if (state.loading || state.loadingMore || state.page >= state.pageCount) {
      return;
    }
    this.listState.update((current) => ({ ...current, loadingMore: true }));
    this.loadProjectsPage(state.page + 1, true);
  }

  loadProject(id: string): void {
    this.detailState.update((state) => ({
      ...state,
      project: null,
      services: [],
      loading: true,
      error: null,
      actionError: null,
    }));

    this.api.findById(id).subscribe({
      next: (response) => {
        this.detailState.update((state) => ({
          ...state,
          project: mapProjectDto(response),
          loading: false,
        }));
        this.loadServices(id);
      },
      error: () => {
        this.detailState.update((state) => ({
          ...state,
          loading: false,
          error: 'Nao foi possivel carregar o projeto.',
        }));
      },
    });
  }

  loadServices(projectId: string): void {
    this.detailState.update((state) => ({ ...state, servicesLoading: true }));
    this.api.listServices(projectId, 1, 100).subscribe({
      next: (response) => {
        this.detailState.update((state) => ({
          ...state,
          services: response.items.map(mapProjectServiceDto),
          servicesLoading: false,
        }));
      },
      error: () => {
        this.detailState.update((state) => ({
          ...state,
          servicesLoading: false,
          actionError: 'Nao foi possivel carregar os servicos do projeto.',
        }));
      },
    });
  }

  saveProject(id: string | null, value: ProjectFormValue, onSuccess: (project: Project) => void): void {
    this.detailState.update((state) => ({ ...state, saving: true, actionError: null }));
    const request = mapProjectFormToRequest(value);
    const operation = id ? this.api.update(id, request) : this.api.create(request);

    operation.pipe(finalize(() => this.detailState.update((state) => ({ ...state, saving: false })))).subscribe({
      next: (response) => {
        const project = mapProjectDto(response);
        this.detailState.update((state) => ({ ...state, project }));
        onSuccess(project);
      },
      error: () => {
        this.detailState.update((state) => ({
          ...state,
          actionError: 'Nao foi possivel salvar o projeto.',
        }));
      },
    });
  }

  deleteProject(id: string, onSuccess: () => void): void {
    this.deleteOperation(this.api.delete(id), 'Nao foi possivel deletar o projeto.', onSuccess);
  }

  unlinkCustomerProject(id: string, projectId: string): void {
    this.deleteOperation(this.api.unlinkCustomerProject(id), 'Nao foi possivel desvincular o cliente.', () => {
      this.loadProject(projectId);
    });
  }

  deleteService(id: string, projectId: string): void {
    this.deleteOperation(this.api.deleteService(id), 'Nao foi possivel deletar o servico.', () => {
      this.loadServices(projectId);
    });
  }

  updateServiceStatus(service: ProjectService, status: number, projectId: string): void {
    this.detailState.update((state) => ({ ...state, saving: true, actionError: null }));

    this.api
      .updateService(service.id, {
        project_id: service.projectId,
        name: service.name,
        type: service.type,
        url: service.url,
        repo_url: service.repoUrl,
        health_check_url: service.healthCheckUrl,
        status,
      })
      .pipe(finalize(() => this.detailState.update((state) => ({ ...state, saving: false }))))
      .subscribe({
        next: () => this.loadProject(projectId),
        error: () => {
          this.detailState.update((state) => ({
            ...state,
            actionError: 'Nao foi possivel atualizar o status do servico.',
          }));
        },
      });
  }

  clearDetail(): void {
    this.detailState.set({
      project: null,
      services: [],
      loading: false,
      servicesLoading: false,
      saving: false,
      deleting: false,
      error: null,
      actionError: null,
    });
  }

  private loadProjectsPage(page: number, append: boolean): void {
    this.api.list(page, this.limit).subscribe({
      next: (response) => {
        const projects = response.items.map(mapProjectDto);
        this.listState.update((state) => ({
          ...state,
          projects: append ? [...state.projects, ...projects] : projects,
          page: response.page,
          pageCount: response.page_count,
          loading: false,
          loadingMore: false,
        }));
      },
      error: () => {
        this.listState.update((state) => ({
          ...state,
          loading: false,
          loadingMore: false,
          error: 'Nao foi possivel carregar os projetos.',
        }));
      },
    });
  }

  private deleteOperation(operation: Observable<unknown>, error: string, onSuccess: () => void): void {
    this.detailState.update((state) => ({ ...state, deleting: true, actionError: null }));
    operation.pipe(finalize(() => this.detailState.update((state) => ({ ...state, deleting: false })))).subscribe({
      next: () => onSuccess(),
      error: () => {
        this.detailState.update((state) => ({ ...state, actionError: error }));
      },
    });
  }
}
