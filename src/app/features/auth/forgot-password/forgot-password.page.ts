import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

import { BrandPanelComponent, BrandPill } from '../shared/brand-panel/brand-panel.component';
import { ThemeToggleComponent } from '../../../shared/components/theme-toggle/theme-toggle.component';
import { TfaFormComponent } from '../shared/tfa-form/tfa-form.component';
import { ForgotPasswordFormComponent, ForgotPasswordPayload } from './forgot-password-form/forgot-password-form.component';
import { NewPasswordFormComponent } from './new-password-form/new-password-form.component';
import { PasswordRecoveryStore } from '../../../store/auth/password-recovery.store';

const RECOVERY_PILLS: BrandPill[] = [
  { icon: 'lock',         label: 'Proceso seguro'        },
  { icon: 'check-circle', label: 'Verificación por email' },
  { icon: 'clock',        label: 'Cambio inmediato'       },
];

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [
    BrandPanelComponent,
    ThemeToggleComponent,
    TfaFormComponent,
    ForgotPasswordFormComponent,
    NewPasswordFormComponent,
  ],
  templateUrl: './forgot-password.page.html',
  styleUrl: './forgot-password.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordPageComponent {
  private readonly router = inject(Router);
  private readonly store  = inject(PasswordRecoveryStore);

  readonly loading = this.store.loading;
  readonly error   = this.store.error;
  readonly step    = this.store.step;

  /** 'email' → 1, 'verify' → 2, 'reset'/'done' → 3 — para el step indicator. */
  readonly stepNumber = computed<1 | 2 | 3>(() => {
    switch (this.step()) {
      case 'email':  return 1;
      case 'verify': return 2;
      default:       return 3;
    }
  });

  readonly successState = computed(() => this.step() === 'done');

  readonly recoveryPills = RECOVERY_PILLS;
  readonly brandSubtitle =
    'Proceso seguro y rápido para restablecer tu contraseña. Recibirás un enlace de recuperación en tu correo registrado.';

  onRequestEmail(payload: ForgotPasswordPayload): void {
    this.store.start(payload.email);
  }

  onVerifyOtp(code: string): void {
    this.store.verify(code);
  }

  onResendCode(): void {
    this.store.resend();
  }

  onBackToEmail(): void {
    this.store.cancel();
  }

  onResetPassword(password: string): void {
    this.store.reset({
      new_password:     password,
      confirm_password: password,
    });
  }

  onLoginLink(): void {
    this.router.navigate(['/auth/login']);
  }
}
