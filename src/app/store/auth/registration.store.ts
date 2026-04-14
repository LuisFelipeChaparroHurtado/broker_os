import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { AuthRegistrationService } from '../../core/services/auth/auth-registration.service';
import { RegistrationRequest } from '../../core/models/auth';
import { ToastService } from '../../shared/components/feedback/toast/toast.service';

type RegistrationStep = 'form' | 'verify';

/**
 * Flujo de registro:
 *   1. `register(dto)`          → crea cuenta, envía OTP al email, devuelve verification_token
 *   2. `verify(code)`           → confirma OTP y marca el usuario como verificado
 *   3. `resend(email)`          → reenvía OTP si el token expiró
 *
 * Todos los toasts de éxito usan el `message` del envelope del API —
 * nunca strings hardcodeados.
 */
@Injectable({ providedIn: 'root' })
export class RegistrationStore {
  private readonly api    = inject(AuthRegistrationService);
  private readonly auth   = inject(AuthService);
  private readonly toast  = inject(ToastService);
  private readonly router = inject(Router);

  private readonly _step              = signal<RegistrationStep>('form');
  private readonly _email             = signal<string | null>(null);
  private readonly _verificationToken = signal<string | null>(null);
  private readonly _loading           = signal<boolean>(false);
  private readonly _error             = signal<string | null>(null);

  readonly step    = this._step.asReadonly();
  readonly email   = this._email.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error   = this._error.asReadonly();

  readonly hasError = computed(() => this._error() !== null);

  register(dto: RegistrationRequest): void {
    this._loading.set(true);
    this._error.set(null);

    this.api
      .register(dto)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (res) => {
          this._verificationToken.set(res.data.verification_token);
          this._email.set(res.data.user.email);
          this._step.set('verify');
          this.auth.setToken(res.data.verification_token);
          this.toast.info(res.message);
        },
        error: (err) => this.handleError(err, 'No se pudo crear la cuenta'),
      });
  }

  verify(otp_code: string): void {
    if (!this._verificationToken()) {
      this._error.set('No hay registro pendiente de verificación');
      return;
    }

    this._loading.set(true);
    this._error.set(null);

    this.api
      .verify({ otp_code })
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (res) => {
          this.toast.success(res.message);
          // Navegamos primero y reseteamos después, para que no haya flash
          // del form entre el cambio de step y la transición de ruta.
          this.router.navigate(['/auth/login']).then(() => this.cancel());
        },
        error: (err) => this.handleError(err, 'Código OTP inválido'),
      });
  }

  resend(): void {
    const email = this._email();
    if (!email) return;

    this._loading.set(true);
    this._error.set(null);

    this.api
      .resend({ email })
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (res) => {
          this._verificationToken.set(res.data.verification_token);
          this.auth.setToken(res.data.verification_token);
          this.toast.info(res.message);
        },
        error: (err) => this.handleError(err, 'No se pudo reenviar el código'),
      });
  }

  cancel(): void {
    this._step.set('form');
    this._verificationToken.set(null);
    this._email.set(null);
    this._error.set(null);
    this.auth.clearToken();
  }

  clearError(): void {
    this._error.set(null);
  }

  private handleError(err: unknown, fallback: string): void {
    const msg = (err as { error?: { error?: { message?: string } } })?.error?.error?.message ?? fallback;
    this._error.set(msg);
    this.toast.error(msg);
  }
}
