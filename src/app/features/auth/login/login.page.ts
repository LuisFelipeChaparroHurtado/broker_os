import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BrandPanelComponent, BrandPill } from '../shared/brand-panel/brand-panel.component';
import { LoginFormComponent, LoginSubmitPayload } from './login-form/login-form.component';
import { TfaFormComponent } from '../shared/tfa-form/tfa-form.component';
import { ThemeToggleComponent } from '../../../shared/components/theme-toggle/theme-toggle.component';
import { TfaMethod } from '../shared/tfa-method-selector/tfa-method-selector.component';
import { LoginStore } from '../../../store/auth/login.store';
import { MfaMethod } from '../../../core/models/auth';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [BrandPanelComponent, LoginFormComponent, TfaFormComponent, ThemeToggleComponent],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  private readonly router = inject(Router);
  private readonly store  = inject(LoginStore);

  readonly loading     = this.store.loading;
  readonly error       = this.store.error;
  readonly awaitingOtp = this.store.awaitingOtp;

  readonly brandPills: BrandPill[] = [
    { icon: 'monitor', label: 'MT5 Integrado'       },
    { icon: 'chat',    label: 'Soporte 24/7'        },
    { icon: 'dollar',  label: 'Retiros Instantaneos' },
  ];

  onLogin(payload: LoginSubmitPayload): void {
    this.store.login(payload.email, payload.password, toMfaMethod(payload.method));
  }

  onVerify2FA(code: string): void {
    this.store.verifyOtp(code);
  }

  onResendCode(): void {
    this.store.resendOtp();
  }

  onBackToLogin(): void {
    this.store.cancel();
  }

  onRegisterLink(): void {
    this.router.navigate(['/auth/register']);
  }

  onForgotPasswordLink(): void {
    this.router.navigate(['/auth/forgot-password']);
  }
}

function toMfaMethod(m: TfaMethod): MfaMethod {
  switch (m) {
    case 'sms':           return 'SMS';
    case 'authenticator': return 'TOTP';
    default:              return 'EMAIL';
  }
}
