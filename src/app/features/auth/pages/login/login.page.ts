import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { BrandPanelComponent } from '../../shared/brand-panel/brand-panel.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { TfaFormComponent } from '../../shared/tfa-form/tfa-form.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [BrandPanelComponent, LoginFormComponent, TfaFormComponent],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  readonly currentStep = signal<1 | 2>(1);
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  onLogin(credentials: { email: string; password: string }): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
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
}
