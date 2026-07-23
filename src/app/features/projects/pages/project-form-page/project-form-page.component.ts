import { ChangeDetectionStrategy, Component, OnInit, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { FeedbackStateComponent } from '../../../../shared/feedback-state/feedback-state.component';
import { ProjectFacade } from '../../data-access/project.facade';
import { Project, ProjectFormValue } from '../../domain/project.model';

@Component({
  selector: 'app-project-form-page',
  imports: [
    FeedbackStateComponent,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './project-form-page.component.html',
  styleUrl: './project-form-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectFormPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly projects = inject(ProjectFacade);

  protected readonly projectId = this.route.snapshot.paramMap.get('id');
  protected readonly editing = this.projectId !== null;

  protected readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    slug: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/),
      ],
    }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(500)] }),
    repoUrl: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(500)] }),
  });

  constructor() {
    effect(() => {
      const project = this.projects.project();
      if (project && this.editing && !this.form.dirty) {
        this.patchForm(project);
      }
    });
  }

  ngOnInit(): void {
    this.projects.clearDetail();
    this.form.controls.slug.valueChanges.subscribe(() => this.applySlugMask());

    if (this.projectId) {
      this.projects.loadProject(this.projectId);
    }
  }

  protected retry(): void {
    if (this.projectId) {
      this.projects.loadProject(this.projectId);
    }
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.projects.saveProject(this.projectId, this.form.getRawValue() satisfies ProjectFormValue, (project) => {
      void this.router.navigate(['/projects', project.id]);
    });
  }

  private patchForm(project: Project): void {
    this.form.patchValue({
      name: project.name,
      slug: normalizeSlug(project.slug),
      description: project.description,
      repoUrl: project.repoUrl,
    });
  }

  private applySlugMask(): void {
    const control = this.form.controls.slug;
    const normalized = normalizeSlug(control.value);
    if (normalized !== control.value) {
      control.setValue(normalized, { emitEvent: false });
    }
  }
}

function normalizeSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/[.-]{2,}/g, '-')
    .replace(/^[.-]+|[.-]+$/g, '')
    .slice(0, 50);
}
