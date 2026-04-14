import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BrandPanelComponent, BrandPill } from '../shared/brand-panel/brand-panel.component';
import { RegisterFormComponent, RegisterPayload } from './register-form/register-form.component';
import { TfaFormComponent } from '../shared/tfa-form/tfa-form.component';
import { ThemeToggleComponent } from '../../../shared/components/theme-toggle/theme-toggle.component';
import { RegistrationStore } from '../../../store/auth/registration.store';

const REGISTER_PILLS: BrandPill[] = [
  { icon: 'check-circle', label: 'Verificación rápida'   },
  { icon: 'dollar',       label: 'Trading desde $100'    },
  { icon: 'chat',         label: 'Soporte personalizado' },
];

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [BrandPanelComponent, RegisterFormComponent, TfaFormComponent, ThemeToggleComponent],
  templateUrl: './register.page.html',
  styleUrl: './register.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent {
  private readonly router = inject(Router);
  private readonly store  = inject(RegistrationStore);

  readonly loading = this.store.loading;
  readonly error   = this.store.error;
  readonly step    = this.store.step;

  readonly registerPills = REGISTER_PILLS;
  readonly brandSubtitle =
    'Empieza a operar en mercados globales con una cuenta verificada, fondeo accesible y soporte dedicado desde el primer momento.';

  onRegister(payload: RegisterPayload): void {
    this.store.register({
      first_name:       payload.nombre,
      last_name:        payload.apellido,
      email:            payload.email,
      password:         payload.password,
      confirm_password: payload.password,
      phone:            `${payload.codigoPais}${payload.telefono}`,
      country_id:       payload.pais,
      birth_date:       payload.fechaNacimiento,
      address:          payload.direccion,
    });
  }

  onVerifyOtp(code: string): void {
    this.store.verify(code);
  }

  onResendCode(): void {
    this.store.resend();
  }

  onBackToForm(): void {
    this.store.cancel();
  }

  onLoginLink(): void {
    this.router.navigate(['/auth/login']);
  }
}
