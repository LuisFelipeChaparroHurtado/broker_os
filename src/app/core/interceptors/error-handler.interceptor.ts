import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../shared/components/feedback/toast/toast.service';
import { AuthStore } from '../../store/auth/auth.store';

/**
 * Intercepta errores HTTP y muestra toasts SOLO para errores transversales:
 *   - 0         sin red
 *   - 500, 503  problemas de backend/infra
 *   - 401       SOLO si el usuario tenía sesión activa (token caducó mid-uso).
 *               Si el 401 viene de un login fallido / registro / recovery,
 *               lo maneja el store del flujo con el mensaje real del backend.
 *
 * Los errores de dominio (4xx de los flujos de auth) los muestra cada store
 * con contexto en el banner inline — el interceptor NO toastea esos para
 * evitar mensajes falsos como "Sesión expirada" cuando en realidad fue
 * "Credenciales inválidas".
 *
 * Envelope real del backend: `{ success: false, http_status, error: { code, message, detail? } }`
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast     = inject(ToastService);
  const authStore = inject(AuthStore);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const backendMsg = err.error?.error?.message as string | undefined;

      switch (err.status) {
        case 0:
          toast.error('Sin conexión', 'Revisa tu conexión a internet');
          break;

        case 401:
          // Solo mostrar "Sesión expirada" si el usuario tenía sesión activa.
          // En flujos de login/OTP/recovery el store del flujo muestra el
          // mensaje real del backend en el banner inline.
          if (authStore.isAuthenticated()) {
            toast.error('Sesión expirada', backendMsg ?? 'Inicia sesión nuevamente');
            authStore.logoutAndRedirect();
          }
          break;

        case 500:
        case 503:
          toast.error('Error del servidor', backendMsg ?? 'Por favor intenta más tarde');
          break;

        default:
          // 403, 404, 409, 422, 429 → los maneja el store del flujo correspondiente.
          // Otros 5xx → fallback genérico.
          if (err.status >= 500) {
            toast.error('Error', backendMsg ?? err.message);
          }
      }
      return throwError(() => err);
    }),
  );
};
