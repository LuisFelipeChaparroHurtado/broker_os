import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { BrandPanelComponent, BrandPill } from '../../shared/brand-panel/brand-panel.component';
import { LoginFormComponent, LoginSubmitPayload } from './login-form/login-form.component';
import { TfaFormComponent } from '../../shared/tfa-form/tfa-form.component';
import { ThemeToggleComponent } from '../../../../shared/components/theme-toggle/theme-toggle.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [BrandPanelComponent, LoginFormComponent, TfaFormComponent,ThemeToggleComponent],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  private readonly router = inject(Router);
  readonly currentStep = signal<1 | 2>(1);
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly brandPills: BrandPill[] = [
    { icon: 'monitor', label: 'MT5 Integrado'       },
    { icon: 'chat',    label: 'Soporte 24/7'        },
    { icon: 'dollar',  label: 'Retiros Instantaneos' },
  ];

  onLogin(payload: LoginSubmitPayload): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    console.log('Login con metodo 2FA:', payload.method);
    // Simulate API call
    setTimeout(() => {
      this.isLoading.set(false);
      this.currentStep.set(2);
    }, 1500);
  }

  onVerify2FA(code: string): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    setTimeout(() => {
      this.isLoading.set(false);
      if (code === '000000') {
        this.errorMessage.set('Código incorrecto. Inténtalo de nuevo.');
      } else {
        // Navigate to dashboard
        console.log('2FA verified, redirect to dashboard');
      }
    }, 1500);
  }

  onBackToLogin(): void {
    this.currentStep.set(1);
    this.errorMessage.set(null);
  }

  onRegisterLink(): void {
    this.router.navigate(['/auth/register']);
  }

  onForgotPasswordLink(): void {
    this.router.navigate(['/auth/forgot-password']);
  }
}
