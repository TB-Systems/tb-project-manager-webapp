import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppHeaderComponent } from '../app-header/app-header.component';
import { NavigationRailComponent } from '../navigation-rail/navigation-rail.component';

@Component({
  selector: 'app-shell',
  imports: [AppHeaderComponent, NavigationRailComponent, RouterOutlet],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent {}
