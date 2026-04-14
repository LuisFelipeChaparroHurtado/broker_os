import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

type SolicitudStatus = 'approved' | 'pending' | 'resolved' | 'rejected';

interface Solicitud {
  id: string;
  title: string;
  date: string;
  status: SolicitudStatus;
}

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [],
  templateUrl: './solicitudes.component.html',
  styleUrl: './solicitudes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesComponent {
  readonly solicitudes = signal<readonly Solicitud[]>([
    { id: 'SOL-2024-001', title: 'Cambio de apalancamiento', date: '10 Feb 2026', status: 'approved' },
    { id: 'SOL-2024-002', title: 'Retiro especial',          date: '28 Feb 2026', status: 'pending'  },
    { id: 'SOL-2024-003', title: 'Soporte tecnico',          date: '15 Mar 2026', status: 'resolved' },
    { id: 'SOL-2024-004', title: 'Cambio de datos',          date: '02 Abr 2026', status: 'rejected' },
  ]);

  onNewRequest(): void { console.log('new request'); }
  onOpenRequest(s: Solicitud): void { console.log('open', s.id); }
}
