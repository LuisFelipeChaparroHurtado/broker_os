import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

type NotifChannel = 'email' | 'push' | 'sms';

interface NotifRow {
  key: string;
  type: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}

interface GeneralRow {
  label: string;
  value: string;
  mono?: boolean;
  flag?: string;
}

@Component({
  selector: 'app-preferencias',
  standalone: true,
  imports: [],
  templateUrl: './preferencias.component.html',
  styleUrl: './preferencias.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreferenciasComponent {
  readonly general = signal<readonly GeneralRow[]>([
    { label: 'Idioma',       value: 'Espanol', flag: '🇪🇸' },
    { label: 'Zona horaria', value: 'UTC-5 Bogota', mono: true },
    { label: 'Moneda',       value: 'USD Dolar' },
  ]);

  readonly notifications = signal<NotifRow[]>([
    { key: 'depositos',    type: 'Depositos',    email: true,  push: true,  sms: true  },
    { key: 'retiros',      type: 'Retiros',      email: true,  push: true,  sms: false },
    { key: 'margin-call',  type: 'Margin Call',  email: true,  push: true,  sms: true  },
    { key: 'noticias',     type: 'Noticias',     email: true,  push: false, sms: false },
    { key: 'promociones',  type: 'Promociones',  email: false, push: false, sms: false },
  ]);

  toggleNotif(key: string, channel: NotifChannel): void {
    this.notifications.update(rows =>
      rows.map(row => row.key === key ? { ...row, [channel]: !row[channel] } : row),
    );
  }
}
