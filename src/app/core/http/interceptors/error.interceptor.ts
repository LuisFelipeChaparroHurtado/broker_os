import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../../shared/components/feedback/toast/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      switch (err.status) {
        case 401:
          toast.error('Sesión expirada', 'Por favor inicia sesión nuevamente');
          break;
        case 403:
          toast.error('Sin permisos', 'No tienes acceso a este recurso');
          break;
        case 404:
          // dejar que el componente lo maneje con empty state
          break;
        case 422:
          toast.error('Error de validación', err.error?.message ?? 'Revisa los campos del formulario');
          break;
        case 500:
          toast.error('Error del servidor', 'Por favor intenta más tarde');
          break;
        default:
          if (err.status >= 400) {
            toast.error('Error', err.error?.message ?? err.message);
          }
      }
      return throwError(() => err);
    })
  );
};
