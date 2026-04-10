import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BrandPanelComponent, BrandPill } from '../../shared/brand-panel/brand-panel.component';
import { RegisterFormComponent, RegisterPayload } from './register-form/register-form.component';
import { ThemeToggleComponent } from '../../../../shared/components/theme-toggle/theme-toggle.component';

const REGISTER_PILLS: BrandPill[] = [
  { icon: 'check-circle', label: 'Verificación rápida'   },
  { icon: 'dollar',       label: 'Trading desde $100'    },
  { icon: 'chat',         label: 'Soporte personalizado' },
];

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [BrandPanelComponent, RegisterFormComponent, ThemeToggleComponent],
  templateUrl: './register.page.html',
  styleUrl: './register.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent {
  private readonly router = inject(Router);

  readonly isLoading    = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly registerPills = REGISTER_PILLS;
  readonly brandSubtitle =
    'Empieza a operar en mercados globales con una cuenta verificada, fondeo accesible y soporte dedicado desde el primer momento.';

  onRegister(payload: RegisterPayload): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    // TODO: wiring con AuthService
    setTimeout(() => {
      this.isLoading.set(false);
      console.log('Register payload:', payload);
    }, 1500);
  }

  onLoginLink(): void {
    this.router.navigate(['/auth/login']);
  }
}
