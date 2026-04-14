import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {
  readonly eyebrow = signal('Vista general');
  readonly title = signal('Dashboard');
  readonly subtitle = signal('Resumen general de tu cuenta, rendimiento y actividad reciente.');
  readonly placeholderTitle = signal('Contenido de Dashboard');
  readonly placeholderSub = signal('Widgets de resumen, estadísticas y actividad');
}
