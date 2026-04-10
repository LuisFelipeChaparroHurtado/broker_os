import { Component, ChangeDetectionStrategy, input } from '@angular/core';

export type BrandPillIcon = 'shield' | 'lock' | 'clock' | 'check-circle' | 'dollar' | 'chat';

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
  readonly taglinePre    = input<string>('Acceso seguro');
  readonly taglineMid    = input<string>('a tu ');
  readonly taglineAccent = input<string>('cuenta');
  readonly subtitle      = input<string>(
    'Protegemos tu cuenta con autenticación de dos factores, cifrado de grado militar y sesiones seguras.',
  );
  readonly pills = input<BrandPill[]>(DEFAULT_PILLS);
}
