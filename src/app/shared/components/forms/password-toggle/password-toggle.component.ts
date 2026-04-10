import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-password-toggle',
  standalone: true,
  templateUrl: './password-toggle.component.html',
  styleUrl: './password-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordToggleComponent {
  readonly visible    = input<boolean>(false);
  readonly ariaLabel  = input<string>('Mostrar contraseña');

  readonly toggle = output<void>();

  onClick(): void {
    this.toggle.emit();
  }
}
