import { Injectable, computed, signal } from '@angular/core';

/**
 * Token holder minimalista usado por `authInterceptor`.
 *
 * Almacena el bearer token en memoria (signal) — nunca en localStorage,
 * siguiendo la recomendación del API BrokerOS:
 *   "access_token → Memory/State (NUNCA localStorage)"
 *
 * El refresh_token vive en cookie HttpOnly, no lo tocamos desde JS.
 *
 * El token aquí guardado puede ser:
 *   - un `verification_token` durante flujos de login/registro/recovery
 *   - un `access_token` cuando el usuario ya está autenticado
 * El interceptor no distingue entre ambos — ambos se envían como
 * `Authorization: Bearer <token>`.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _token = signal<string | null>(null);

  readonly token      = this._token.asReadonly();
  readonly isLoggedIn = computed(() => this._token() !== null);

  setToken(token: string): void {
    this._token.set(token);
  }

  clearToken(): void {
    this._token.set(null);
  }
}
