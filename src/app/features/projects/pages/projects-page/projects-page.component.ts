import { ChangeDetectionStrategy, Component, HostListener, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FeedbackStateComponent } from '../../../../shared/feedback-state/feedback-state.component';
import { ProjectFacade } from '../../data-access/project.facade';

@Component({
  selector: 'app-projects-page',
  imports: [FeedbackStateComponent, RouterLink],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsPageComponent implements OnInit {
  protected readonly projects = inject(ProjectFacade);

  ngOnInit(): void {
    this.projects.loadProjects();
  }

  @HostListener('window:scroll')
  protected onScroll(): void {
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.scrollHeight - 240;
    if (scrollPosition >= threshold) {
      this.projects.loadMoreProjects();
    }
  }

  protected retry(): void {
    this.projects.loadProjects();
  }

  protected projectStatusLabel(status: number): string {
    return projectStatusLabels[status] ?? 'Desconhecido';
  }
}

const projectStatusLabels: Record<number, string> = {
  1: 'Backlog',
  2: 'Discovery',
  3: 'Desenvolvimento',
  4: 'Staging',
  5: 'Live',
  6: 'Pausado',
  7: 'Down',
  8: 'Arquivado',
};
