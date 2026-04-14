/**
 * POST /api/v1/auth/token/refresh
 *
 * El refresh_token llega automáticamente vía cookie HttpOnly. Solo se pasa en
 * el body como fallback si el browser no soporta cookies (ej. WebView).
 */
export interface RefreshTokenRequest {
  refresh_token?: string;
}
