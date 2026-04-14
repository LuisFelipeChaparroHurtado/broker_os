import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthStore } from '../../store/auth/auth.store';

/**
 * Bloquea las rutas de autenticación (`/auth/*`) cuando el usuario YA tiene
 * sesión activa. Si un usuario autenticado intenta volver a `/auth/login`
 * (ej. con la flecha de atrás del browser o escribiendo la URL) lo redirige
 * a `/demo`.
 */
export const noAuthGuard: CanActivateFn = (): boolean | UrlTree => {
  const authStore = inject(AuthStore);
  const router    = inject(Router);

  return authStore.isAuthenticated() ? router.createUrlTree(['/demo']) : true;
};
