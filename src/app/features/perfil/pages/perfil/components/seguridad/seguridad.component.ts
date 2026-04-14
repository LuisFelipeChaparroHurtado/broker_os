import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

type StrengthLevel = 'weak' | 'medium' | 'strong';
type DeviceType = 'desktop' | 'mobile';
type LoginStatus = 'success' | 'failed';

interface Device {
  type: DeviceType;
  name: string;
  location: string;
  lastActive: string;
  current?: boolean;
}

interface LoginRow {
  date: string;
  ip: string;
  device: string;
  location: string;
  status: LoginStatus;
}

@Component({
  selector: 'app-seguridad',
  standalone: true,
  imports: [],
  templateUrl: './seguridad.component.html',
  styleUrl: './seguridad.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeguridadComponent {
  readonly password = signal({
    lastChange: '15 Feb 2026',
    strength: 'strong' as StrengthLevel,
    strengthLabel: 'Fuerte',
  });

  readonly twoFactor = signal({
    method: 'Google Authenticator',
    active: true,
  });

  readonly pin = signal({
    configured: true,
  });

  readonly devices = signal<readonly Device[]>([
    { type: 'desktop', name: 'Chrome — macOS Sonoma',   location: 'Bogota, Colombia',   lastActive: 'Activo ahora',  current: true },
    { type: 'mobile',  name: 'Safari — iPhone 15 Pro', location: 'Bogota, Colombia',   lastActive: 'Hace 2 horas' },
    { type: 'desktop', name: 'Firefox — Windows 11',    location: 'Medellin, Colombia', lastActive: 'Hace 3 dias' },
  ]);

  readonly history = signal<readonly LoginRow[]>([
    { date: '13 Abr 2026, 14:32', ip: '190.85.XX.XX', device: 'Chrome / macOS',    location: 'Bogota',   status: 'success' },
    { date: '13 Abr 2026, 08:15', ip: '190.85.XX.XX', device: 'Safari / iOS',      location: 'Bogota',   status: 'success' },
    { date: '12 Abr 2026, 22:40', ip: '45.120.XX.XX', device: 'Firefox / Windows', location: 'Medellin', status: 'failed'  },
    { date: '10 Abr 2026, 19:05', ip: '190.85.XX.XX', device: 'Chrome / macOS',    location: 'Bogota',   status: 'success' },
    { date: '09 Abr 2026, 11:22', ip: '190.85.XX.XX', device: 'Safari / iOS',      location: 'Bogota',   status: 'success' },
  ]);

  onChangePassword(): void { console.log('change password'); }
  onToggle2FA(): void { console.log('toggle 2fa'); }
  onRegenerateCodes(): void { console.log('regenerate codes'); }
  onChangePin(): void { console.log('change pin'); }
  onCloseDevice(device: Device): void { console.log('close device', device.name); }
}
