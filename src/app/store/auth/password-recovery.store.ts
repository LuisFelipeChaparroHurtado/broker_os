import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { AuthPasswordRecoveryService } from '../../core/services/auth/auth-password-recovery.service';
import { ResetPasswordRequest } from '../../core/models/auth';
import { ToastService } from '../../shared/components/feedback/toast/toast.service';

type RecoveryStep = 'email' | 'verify' | 'reset' | 'done';

/**
 * Flujo de recuperación de contraseña (3 pasos):
 *   1. `start(email)`        → API envía OTP (siempre 200 para anti-enumeration)
 *   2. `verify(code)`        → API devuelve password_reset_token
 *   3. `reset(new, confirm)` → API persiste la nueva contraseña
 *
 * Todos los toasts de éxito usan el `message` del envelope del API —
 * nunca strings hardcodeados.
 */
@Injectable({ providedIn: 'root' })
export class PasswordRecoveryStore {
  private readonly api    = inject(AuthPasswordRecoveryService);
  private readonly auth   = inject(AuthService);
  private readonly toast  = inject(ToastService);
  private readonly router = inject(Router);

  private readonly _step              = signal<RecoveryStep>('email');
  private readonly _email             = signal<string | null>(null);
  private readonly _verificationToken = signal<string | null>(null);
  private readonly _loading           = signal<boolean>(false);
  private readonly _error             = signal<string | null>(null);

  readonly step    = this._step.asReadonly();
  readonly email   = this._email.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error   = this._error.asReadonly();

  readonly hasError = computed(() => this._error() !== null);

  start(email: string): void {
    this._loading.set(true);
    this._error.set(null);

    this.api
      .start({ email })
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (res) => {
          this._email.set(email);
          // El API devuelve `null` en data si el email no existe (anti-enumeration).
          // Igual avanzamos al siguiente paso para no revelar si existe o no.
          if (res.data?.verification_token) {
            this._verificationToken.set(res.data.verification_token);
            this.auth.setToken(res.data.verification_token);
          }
          this._step.set('verify');
          this.toast.info(res.message);
        },
        error: (err) => this.handleError(err, 'No se pudo procesar la solicitud'),
      });
  }

  verify(otp_code: string): void {
    if (!this._verificationToken()) {
      this._error.set('Código inválido o expirado');
      return;
    }

    this._loading.set(true);
    this._error.set(null);

    this.api
      .verify({ otp_code })
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (res) => {
          // Reemplazamos el verification_token por el password_reset_token
          this._verificationToken.set(res.data.verification_token);
          this.auth.setToken(res.data.verification_token);
          this._step.set('reset');
          this.toast.success(res.message);
        },
        error: (err) => this.handleError(err, 'Código OTP inválido'),
      });
  }

  resend(): void {
    if (!this._verificationToken()) return;

    this._loading.set(true);
    this._error.set(null);

    this.api
      .resend()
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

  reset(dto: ResetPasswordRequest): void {
    this._loading.set(true);
    this._error.set(null);

    this.api
      .reset(dto)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (res) => {
          this.toast.success(res.message);
          // Navegamos primero y reseteamos después, para no flashear pasos.
          this.router.navigate(['/auth/login']).then(() => this.cancel());
        },
        error: (err) => this.handleError(err, 'No se pudo actualizar la contraseña'),
      });
  }

  cancel(): void {
    this._step.set('email');
    this._email.set(null);
    this._verificationToken.set(null);
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
