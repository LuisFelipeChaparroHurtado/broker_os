import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AuthUser, SessionTokens } from '../../core/models/auth';

/** Clave usada en localStorage para persistir la sesión entre recargas. */
const SESSION_STORAGE_KEY = 'brokeros.session';

/**
 * Payload que se persiste en localStorage. Intencionalmente NO guarda
 * `access_token` — ese vive solo en memoria para reducir superficie XSS.
 * En cada boot, el `APP_INITIALIZER` usa el `refresh_token` para obtener
 * un access_token nuevo vía `/auth/token/refresh`.
 */
interface PersistedSession {
  refresh_token: string;
  user:          AuthUser;
}

/**
 * Estado del usuario autenticado.
 *
 * ─ Memoria ───────────────────────────────────────────────────
 *   _accessToken  → signal<string | null>   (nunca persistido)
 *   _user         → signal<AuthUser | null>
 *
 * ─ localStorage ──────────────────────────────────────────────
 *   brokeros.session → { refresh_token, user }
 *
 * Flujo de vida:
 *   1. Login exitoso → `setSession(tokens)` → guarda todo
 *   2. F5 del browser → memoria se pierde → `APP_INITIALIZER` lee
 *      `getPersistedRefreshToken()`, llama `/auth/token/refresh`,
 *      vuelve a llamar `setSession` con los tokens frescos
 *   3. Logout → `clearSession()` → limpia todo
 *
 * El `authInterceptor` siempre lee de `AuthService.token()`, que esta
 * store mantiene sincronizado con el `_accessToken`.
 */
@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly auth   = inject(AuthService);
  private readonly router = inject(Router);

  private readonly _user        = signal<AuthUser | null>(null);
  private readonly _accessToken = signal<string | null>(null);

  readonly user        = this._user.asReadonly();
  readonly accessToken = this._accessToken.asReadonly();

  readonly isAuthenticated = computed(() => this._accessToken() !== null);

  /**
   * Lee el `refresh_token` persistido sin tocar el estado del store.
   * Usado por el `APP_INITIALIZER` durante el bootstrap para decidir si
   * debe intentar restaurar la sesión o arrancar en estado logout.
   */
  getPersistedRefreshToken(): string | null {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as PersistedSession;
      return parsed?.refresh_token ?? null;
    } catch {
      this.clearStorage();
      return null;
    }
  }

  /** Llamado por LoginStore y por el APP_INITIALIZER tras un refresh exitoso. */
  setSession(tokens: SessionTokens): void {
    this._accessToken.set(tokens.access_token);
    this._user.set(tokens.user);
    this.auth.setToken(tokens.access_token);
    this.persist({ refresh_token: tokens.refresh_token, user: tokens.user });
  }

  clearSession(): void {
    this._accessToken.set(null);
    this._user.set(null);
    this.auth.clearToken();
    this.clearStorage();
  }

  logoutAndRedirect(): void {
    this.clearSession();
    this.router.navigate(['/auth/login']);
  }

  private persist(session: PersistedSession): void {
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Quota exceeded o storage no disponible — ignoramos silenciosamente.
    }
  }

  private clearStorage(): void {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // idem
    }
  }
}
