import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

export type TfaMethod = 'sms' | 'email' | 'authenticator';

export interface TfaMethodOption {
  id:    TfaMethod;
  label: string;
  hint:  string;
}

const DEFAULT_METHODS: TfaMethodOption[] = [
  { id: 'email',         label: 'Email',         hint: 'Recomendado'        },
  { id: 'sms',           label: 'SMS',           hint: 'Mensaje al telefono' },
  { id: 'authenticator', label: 'Authenticator', hint: 'Codigo TOTP'        },
];

@Component({
  selector: 'app-tfa-method-selector',
  standalone: true,
  templateUrl: './tfa-method-selector.component.html',
  styleUrl: './tfa-method-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TfaMethodSelectorComponent {
  readonly selected = input<TfaMethod>('email');
  readonly disabled = input<boolean>(false);
  readonly label    = input<string>('Recibe tu codigo por:');
  readonly methods  = input<TfaMethodOption[]>(DEFAULT_METHODS);

  readonly selectedChange = output<TfaMethod>();

  select(method: TfaMethod): void {
    if (this.disabled()) return;
    this.selectedChange.emit(method);
  }
}
