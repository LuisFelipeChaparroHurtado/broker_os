import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

interface FieldRow {
  label: string;
  value: string;
  mono?: boolean;
  verified?: boolean;
}

@Component({
  selector: 'app-datos-personales',
  standalone: true,
  imports: [],
  templateUrl: './datos-personales.component.html',
  styleUrl: './datos-personales.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatosPersonalesComponent {
  readonly user = signal({
    initials: 'CM',
    fullName: 'Carlos Andres Martinez Lopez',
    email: 'carlos.martinez@email.com',
    id: '08423',
    registeredAt: '10 Ene 2026',
    lastAccess: 'Hoy, 14:32',
  });

  readonly personal = signal<readonly FieldRow[]>([
    { label: 'Nombre',       value: 'Carlos Andres' },
    { label: 'Apellido',     value: 'Martinez Lopez' },
    { label: 'Email',        value: 'carlos.martinez@email.com', verified: true },
    { label: 'Telefono',     value: '+57 300 123 4567', mono: true },
    { label: 'Nacimiento',   value: '15/03/1988' },
    { label: 'Nacionalidad', value: 'Colombia' },
    { label: 'Documento',    value: 'CC 1.234.567.890', mono: true },
  ]);

  readonly address = signal<readonly FieldRow[]>([
    { label: 'Direccion',    value: 'Calle 100 #15-20 Apto 501' },
    { label: 'Ciudad',       value: 'Bogota' },
    { label: 'Departamento', value: 'Cundinamarca' },
    { label: 'Codigo Postal', value: '110111', mono: true },
    { label: 'Pais',         value: 'Colombia' },
  ]);

  onEditPersonal(): void { console.log('edit personal'); }
  onEditAddress(): void { console.log('edit address'); }
  onChangeAvatar(): void { console.log('change avatar'); }
}
