import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AuthFacade } from '../../../features/auth/data-access/auth.facade';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeaderComponent {
  private readonly auth = inject(AuthFacade);
  readonly menuClick = output<void>();

  logout(): void {
    this.auth.logout();
  }
}
