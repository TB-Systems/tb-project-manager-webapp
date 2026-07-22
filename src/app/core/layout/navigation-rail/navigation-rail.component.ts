import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavigationItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-navigation-rail',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navigation-rail.component.html',
  styleUrl: './navigation-rail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationRailComponent {
  protected readonly items: NavigationItem[] = [
    { label: 'Dashboard', icon: 'space_dashboard', route: '/dashboard' },
    { label: 'Clientes', icon: 'identity_platform', route: '/customers' },
    { label: 'Projetos', icon: 'assignment', route: '/projects' },
  ];
}
