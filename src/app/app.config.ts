import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { routes } from './app.routes';
import { API_BASE_URL } from './core/services/api.client';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error-handler.interceptor';
import { hmacIntegrityInterceptor } from './core/interceptors/hmac-integrity.interceptor';
import { environment } from '../environments/environment';
import { AuthStore } from './store/auth/auth.store';
import { AuthTokenService } from './core/services/auth/auth-token.service';

/**
 * Al arrancar la app, si hay un `refresh_token` persistido en localStorage,
 * intentamos obtener un `access_token` nuevo vía `/auth/token/refresh`.
 * Esto bloquea el bootstrap de Angular hasta que el refresh responde,
 * garantizando que cuando el router se active ya sabemos si el usuario
 * está autenticado o no (evita redirects parpadeantes).
 */
function restoreSessionOnInit(): Promise<unknown> {
  const authStore    = inject(AuthStore);
  const tokenService = inject(AuthTokenService);

  const refreshToken = authStore.getPersistedRefreshToken();
  if (!refreshToken) return Promise.resolve();

  return firstValueFrom(
    tokenService.refresh({ refresh_token: refreshToken }).pipe(
      tap((tokens) => authStore.setSession(tokens)),
      catchError(() => {
        // refresh_token expirado o revocado → empezamos en logout
        authStore.clearSession();
        return of(null);
      }),
    ),
  );
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor, hmacIntegrityInterceptor])),
    { provide: API_BASE_URL, useValue: environment.apiUrl },
    provideAppInitializer(restoreSessionOnInit),
  ],
};
