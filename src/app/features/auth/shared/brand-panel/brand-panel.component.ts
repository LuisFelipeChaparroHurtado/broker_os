import { Component, ChangeDetectionStrategy, input } from '@angular/core';

export type BrandPillIcon = 'shield' | 'lock' | 'clock' | 'check-circle' | 'dollar' | 'chat' | 'monitor';

export interface BrandPill {
  icon: BrandPillIcon;
  label: string;
}

const DEFAULT_PILLS: BrandPill[] = [
  { icon: 'shield', label: 'Autenticación 2FA'  },
  { icon: 'lock',   label: 'Cifrado AES-256'     },
  { icon: 'clock',  label: 'Sesiones protegidas' },
];

@Component({
  selector: 'app-brand-panel',
  standalone: true,
  templateUrl: './brand-panel.component.html',
  styleUrl: './brand-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandPanelComponent {
  readonly taglinePre    = input<string>('Tu portal de');
  readonly taglineMid    = input<string>('trading ');
  readonly taglineAccent = input<string>('profesional');
  readonly subtitle      = input<string>(
    'Gestiona cuentas, opera en mercados globales y analiza rendimiento en tiempo real desde una sola plataforma',
  );
  readonly pills = input<BrandPill[]>(DEFAULT_PILLS);
}
