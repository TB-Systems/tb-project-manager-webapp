import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { FeedbackStateComponent } from '../../../../shared/feedback-state/feedback-state.component';
import { ProjectApi } from '../../data-access/project.api';
import {
  mapProjectServiceDto,
  mapProjectServiceFormToRequest,
  mapProjectServiceFormToUpdateRequest,
} from '../../data-access/project.mapper';
import { ProjectService, ProjectServiceFormValue } from '../../domain/project.model';

@Component({
  selector: 'app-project-service-form-page',
  imports: [FeedbackStateComponent, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule, RouterLink],
  templateUrl: './project-service-form-page.component.html',
  styleUrl: './project-service-form-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectServiceFormPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projectsApi = inject(ProjectApi);

  protected readonly serviceId = this.route.snapshot.paramMap.get('id');
  protected readonly editing = this.serviceId !== null;
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly saveError = signal<string | null>(null);
  protected readonly projectId = signal(this.route.snapshot.queryParamMap.get('project_id') ?? '');
  private readonly currentStatus = signal(1);

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(100)] }),
    type: new FormControl(1, { nonNullable: true, validators: [Validators.required] }),
    url: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(500)] }),
    repoUrl: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(500)] }),
    healthCheckUrl: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(500)] }),
  });

  ngOnInit(): void {
    if (this.serviceId) {
      this.load();
    }
  }

  protected load(): void {
    if (!this.serviceId) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.projectsApi
      .findServiceById(this.serviceId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => this.patchForm(mapProjectServiceDto(response)),
        error: () => this.error.set('Nao foi possivel carregar o servico.'),
      });
  }

  protected save(): void {
    if (this.form.invalid || !this.projectId()) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.saveError.set(null);
    const value = this.form.getRawValue() satisfies ProjectServiceFormValue;
    const operation = this.serviceId
      ? this.projectsApi.updateService(
          this.serviceId,
          mapProjectServiceFormToUpdateRequest(this.projectId(), value, this.currentStatus()),
        )
      : this.projectsApi.createService(mapProjectServiceFormToRequest(this.projectId(), value));

    operation.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: (response) => void this.router.navigate(['/projects', response.project_id]),
      error: () => this.saveError.set('Nao foi possivel salvar o servico.'),
    });
  }

  private patchForm(service: ProjectService): void {
    this.projectId.set(service.projectId);
    this.currentStatus.set(service.status);
    this.form.patchValue({
      name: service.name,
      type: service.type,
      url: service.url,
      repoUrl: service.repoUrl,
      healthCheckUrl: service.healthCheckUrl,
    });
  }
}
