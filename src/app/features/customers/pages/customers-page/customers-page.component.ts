import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-customers-page',
  imports: [MatCardModule],
  templateUrl: './customers-page.component.html',
  styleUrl: './customers-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersPageComponent {}
