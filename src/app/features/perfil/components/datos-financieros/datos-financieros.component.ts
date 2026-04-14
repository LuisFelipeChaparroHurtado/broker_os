import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

type MethodKind = 'visa' | 'bank' | 'crypto';

interface WithdrawMethod {
  kind: MethodKind;
  brand: string;
  reference: string;
  description: string;
  mono?: boolean;
  isDefault?: boolean;
}

interface FiscalRow {
  label: string;
  value: string;
  mono?: boolean;
}

@Component({
  selector: 'app-datos-financieros',
  standalone: true,
  imports: [],
  templateUrl: './datos-financieros.component.html',
  styleUrl: './datos-financieros.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatosFinancierosComponent {
  readonly methods = signal<readonly WithdrawMethod[]>([
    { kind: 'visa',   brand: 'VISA', reference: 'Visa ····4532', description: 'Tarjeta de credito', mono: true, isDefault: true },
    { kind: 'bank',   brand: 'DAV',  reference: 'Banco Davivienda', description: 'CTA 0123456789', mono: false },
    { kind: 'crypto', brand: '₿',    reference: 'BTC Wallet', description: '1A1zP...7nGz', mono: false },
  ]);

  readonly fiscal = signal<readonly FiscalRow[]>([
    { label: 'NIT / RUT',   value: '1.234.567.890-1', mono: true },
    { label: 'Pais fiscal', value: 'Colombia' },
  ]);

  onAddMethod(): void { console.log('add method'); }
  onDeleteMethod(m: WithdrawMethod): void { console.log('delete method', m.reference); }
  onUpdateFiscal(): void { console.log('update fiscal'); }
}
