import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { BrandPanelComponent, BrandPill } from '../../shared/brand-panel/brand-panel.component';
import { ThemeToggleComponent } from '../../../../shared/components/theme-toggle/theme-toggle.component';
import { ForgotPasswordFormComponent } from './forgot-password-form/forgot-password-form.component';
import { EmailSentComponent } from './email-sent/email-sent.component';
import { NewPasswordFormComponent } from './new-password-form/new-password-form.component';

type RecoveryStep = 1 | 2 | 3;

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
    ForgotPasswordFormComponent,
    EmailSentComponent,
    NewPasswordFormComponent,
  ],
  templateUrl: './forgot-password.page.html',
  styleUrl: './forgot-password.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordPageComponent {
  private readonly router = inject(Router);

  readonly currentStep  = signal<RecoveryStep>(1);
  readonly isLoading    = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successState = signal(false);
  readonly email        = signal<string>('');

  readonly recoveryPills = RECOVERY_PILLS;
  readonly brandSubtitle =
    'Proceso seguro y rápido para restablecer tu contraseña. Recibirás un enlace de recuperación en tu correo registrado.';

  onRequestEmail(email: string): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    setTimeout(() => {
      this.isLoading.set(false);
      this.email.set(email);
      this.currentStep.set(2);
    }, 1500);
  }

  onResend(): void {
    // TODO: wiring con AuthService.requestPasswordReset(email)
    console.log('Reenviar enlace a:', this.email());
  }

  onHaveCode(): void {
    this.currentStep.set(3);
    this.errorMessage.set(null);
  }

  onBackToStep1(): void {
    this.currentStep.set(1);
    this.errorMessage.set(null);
  }

  onResetPassword(password: string): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    // TODO: wiring con AuthService.resetPassword({ email, password, token })
    setTimeout(() => {
      this.isLoading.set(false);
      this.successState.set(true);
      setTimeout(() => this.router.navigate(['/auth/login']), 1500);
    }, 1500);
  }

  onLoginLink(): void {
    this.router.navigate(['/auth/login']);
  }
}
