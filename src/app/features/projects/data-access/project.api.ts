import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { apiConfig } from '../../../core/config/api.config';
import {
  ProjectDto,
  ProjectListResponseDto,
  ProjectRequestDto,
  ProjectServiceListResponseDto,
} from './project.dto';

@Injectable({ providedIn: 'root' })
export class ProjectApi {
  private readonly http = inject(HttpClient);

  list(page: number, limit: number): Observable<ProjectListResponseDto> {
    return this.http.get<ProjectListResponseDto>(`${apiConfig.baseUrl}/projects`, {
      params: { page, limit },
    });
  }

  findById(id: string): Observable<ProjectDto> {
    return this.http.get<ProjectDto>(`${apiConfig.baseUrl}/projects/${id}`);
  }

  create(request: ProjectRequestDto): Observable<ProjectDto> {
    return this.http.post<ProjectDto>(`${apiConfig.baseUrl}/projects`, request);
  }

  update(id: string, request: ProjectRequestDto): Observable<ProjectDto> {
    return this.http.put<ProjectDto>(`${apiConfig.baseUrl}/projects/${id}`, request);
  }

  delete(id: string): Observable<unknown> {
    return this.http.delete(`${apiConfig.baseUrl}/projects/${id}`);
  }

  listServices(projectId: string, page: number, limit: number): Observable<ProjectServiceListResponseDto> {
    return this.http.get<ProjectServiceListResponseDto>(`${apiConfig.baseUrl}/project-services`, {
      params: {
        page,
        limit,
        project_id: projectId,
      },
    });
  }

  deleteService(id: string): Observable<unknown> {
    return this.http.delete(`${apiConfig.baseUrl}/project-services/${id}`);
  }

  unlinkCustomerProject(id: string): Observable<unknown> {
    return this.http.delete(`${apiConfig.baseUrl}/customer-projects/${id}`);
  }
}
