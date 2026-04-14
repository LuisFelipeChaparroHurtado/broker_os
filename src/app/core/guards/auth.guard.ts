import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthStore } from '../../store/auth/auth.store';

/**
 * Bloquea rutas autenticadas y redirige a `/auth/login` si el usuario
 * no tiene una sesión activa.
 *
 * Se aplica al shell del layout protegido.
 */
export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  const authStore = inject(AuthStore);
  const router    = inject(Router);

  return authStore.isAuthenticated() ? true : router.createUrlTree(['/auth/login']);
};
