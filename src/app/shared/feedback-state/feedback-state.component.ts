import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-feedback-state',
  imports: [MatProgressSpinnerModule],
  templateUrl: './feedback-state.component.html',
  styleUrl: './feedback-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackStateComponent {
  readonly mode = input.required<'loading' | 'error' | 'empty'>();
  readonly title = input('');
  readonly message = input('');
  readonly actionLabel = input('Tentar novamente');

  readonly action = output<void>();
}
