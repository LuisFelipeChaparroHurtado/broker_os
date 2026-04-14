import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

type DocAction = 'download' | 'view';

interface DocItem {
  name: string;
  date: string;
  action: DocAction;
}

interface DocGroup {
  title: string;
  subtitle: string;
  items: readonly DocItem[];
}

@Component({
  selector: 'app-documentos',
  standalone: true,
  imports: [],
  templateUrl: './documentos.component.html',
  styleUrl: './documentos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentosComponent {
  readonly groups = signal<readonly DocGroup[]>([
    {
      title: 'Contratos',
      subtitle: 'Documentos legales y contractuales',
      items: [
        { name: 'Contrato de apertura de cuenta', date: 'Firmado 10 Ene 2026',  action: 'download' },
        { name: 'Acuerdo de apalancamiento',      date: 'Firmado 12 Ene 2026',  action: 'download' },
        { name: 'Politica de privacidad',         date: 'Aceptada 10 Ene 2026', action: 'view'     },
        { name: 'Terminos y condiciones',         date: 'Aceptados 10 Ene 2026', action: 'view'    },
      ],
    },
    {
      title: 'Estados de Cuenta',
      subtitle: 'Reportes mensuales de actividad',
      items: [
        { name: 'Estado de Cuenta — Marzo 2026',   date: 'Generado 01 Abr 2026', action: 'download' },
        { name: 'Estado de Cuenta — Febrero 2026', date: 'Generado 01 Mar 2026', action: 'download' },
        { name: 'Estado de Cuenta — Enero 2026',   date: 'Generado 01 Feb 2026', action: 'download' },
      ],
    },
  ]);

  onDocAction(item: DocItem): void { console.log(item.action, item.name); }
}
