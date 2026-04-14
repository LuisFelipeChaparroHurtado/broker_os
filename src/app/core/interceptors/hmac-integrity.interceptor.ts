import { HttpInterceptorFn } from '@angular/common/http';
import { from, switchMap } from 'rxjs';

/**
 * Firma cada request que contenga `/api/` en su path con:
 *   X-Timestamp, X-Nonce, X-Signature
 *
 * Signature = SHA256(path + timestamp + nonce + body)
 *
 * Funciona tanto con `/api/v1/...` como con `/dev/api/v1/...` (staging),
 * porque usa el `pathname` completo tal y como el backend lo recibe.
 *
 * Debe registrarse DESPUÉS de cualquier interceptor que mute el body,
 * de lo contrario la firma no coincidirá con lo que llega al backend.
 */
export const hmacIntegrityInterceptor: HttpInterceptorFn = (req, next) => {
  const path = extractPath(req.url);
  if (!path.includes('/api/')) return next(req);

  const ts    = Date.now().toString();
  const nonce = crypto.randomUUID();
  const body  = serializeBody(req.body);
  const msg   = path + ts + nonce + body;

  return from(sha256Hex(msg)).pipe(
    switchMap((signature) =>
      next(
        req.clone({
          setHeaders: {
            'X-Timestamp': ts,
            'X-Nonce':     nonce,
            'X-Signature': signature,
          },
        }),
      ),
    ),
  );
};

function extractPath(url: string): string {
  try {
    return new URL(url, window.location.origin).pathname;
  } catch {
    const q = url.indexOf('?');
    return q === -1 ? url : url.slice(0, q);
  }
}

function serializeBody(body: unknown): string {
  if (body === null || body === undefined) return '';
  if (typeof body === 'string') return body;
  if (body instanceof FormData || body instanceof Blob || body instanceof ArrayBuffer) return '';
  return JSON.stringify(body);
}

async function sha256Hex(message: string): Promise<string> {
  const bytes = new TextEncoder().encode(message);
  const hash  = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
