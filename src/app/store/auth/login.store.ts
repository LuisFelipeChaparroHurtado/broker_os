import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { AuthSessionService } from '../../core/services/auth/auth-session.service';
import { LoginRequest, LoginResendRequest, MfaMethod } from '../../core/models/auth';
import { ToastService } from '../../shared/components/feedback/toast/toast.service';
import { AuthStore } from './auth.store';

/**
 * Orquesta el flujo de login de 2 pasos:
 *   1. `login(email, password, method)` → backend envía OTP y devuelve `verification_token`
 *   2. `verifyOtp(code)`                 → backend devuelve `access_token` + `refresh_token`
 *
 * Durante el flujo (entre paso 1 y 2) el `verification_token` se inyecta en
 * `AuthService` para que `authInterceptor` lo añada como `Bearer` en el paso 2.
 *
 * Todos los toasts de éxito usan el `message` del envelope del API —
 * nunca strings hardcodeados.
 */
@Injectable({ providedIn: 'root' })
export class LoginStore {
  private readonly api       = inject(AuthSessionService);
  private readonly auth      = inject(AuthService);
  private readonly authStore = inject(AuthStore);
  private readonly toast     = inject(ToastService);
  private readonly router    = inject(Router);

  private readonly _verificationToken = signal<string | null>(null);
  private readonly _codeLength        = signal<number>(6);
  private readonly _method            = signal<MfaMethod | null>(null);
  private readonly _awaitingOtp       = signal<boolean>(false);
  private readonly _loading           = signal<boolean>(false);
  private readonly _error             = signal<string | null>(null);

  readonly codeLength  = this._codeLength.asReadonly();
  readonly method      = this._method.asReadonly();
  readonly awaitingOtp = this._awaitingOtp.asReadonly();
  readonly loading     = this._loading.asReadonly();
  readonly error       = this._error.asReadonly();

  readonly hasError = computed(() => this._error() !== null);

  /** Paso 1 — envía credenciales y dispara OTP. */
  login(email: string, password: string, mfa_method: MfaMethod = 'EMAIL'): void {
    this._loading.set(true);
    this._error.set(null);

    const dto: LoginRequest = { email, password, mfa_method };

    this.api
      .login(dto)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (res) => {
          this._verificationToken.set(res.data.verification_token);
          this._codeLength.set(res.data.code_length);
          this._method.set(res.data.method);
          this._awaitingOtp.set(true);
          this.auth.setToken(res.data.verification_token);
          this.toast.info(res.message);
        },
        error: (err) => this.handleError(err, 'Credenciales inválidas'),
      });
  }

  /** Paso 2 — verifica el código OTP y abre la sesión. */
  verifyOtp(otp_code: string): void {
    if (!this._verificationToken()) {
      this._error.set('No hay sesión pendiente de verificación');
      return;
    }

    this._loading.set(true);
    this._error.set(null);

    this.api
      .verifyOtp({ otp_code })
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (res) => {
          this.authStore.setSession(res.data);
          this.toast.success(res.message);
          // Navegamos PRIMERO y reseteamos después para que la vista de OTP
          // siga renderizando hasta que /demo esté listo. Evita el flash del
          // form de login entre el cambio de step y la transición de ruta.
          this.router.navigate(['/demo']).then(() => this.reset());
        },
        error: (err) => this.handleError(err, 'Código OTP inválido'),
      });
  }

  /** Reenvía el OTP (máximo 3 veces por flujo, lo valida el backend). */
  resendOtp(payload: LoginResendRequest = {}): void {
    if (!this._verificationToken()) return;

    this._loading.set(true);
    this._error.set(null);

    this.api
      .resendOtp(payload)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (res) => {
          this._verificationToken.set(res.data.verification_token);
          this._codeLength.set(res.data.code_length);
          this._method.set(res.data.method);
          this.auth.setToken(res.data.verification_token);
          this.toast.info(res.message);
        },
        error: (err) => this.handleError(err, 'No se pudo reenviar el código'),
      });
  }

  cancel(): void {
    this.reset();
    this.auth.clearToken();
  }

  clearError(): void {
    this._error.set(null);
  }

  private reset(): void {
    this._verificationToken.set(null);
    this._awaitingOtp.set(false);
    this._method.set(null);
    this._error.set(null);
  }

  private handleError(err: unknown, fallback: string): void {
    const msg = (err as { error?: { error?: { message?: string } } })?.error?.error?.message ?? fallback;
    this._error.set(msg);
    this.toast.error(msg);
  }
}
