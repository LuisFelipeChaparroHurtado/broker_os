import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../api.client';
import { RefreshTokenRequest, SessionTokens } from '../../models/auth';

/**
 * POST /api/v1/auth/token/refresh
 *
 * El refresh_token llega vía cookie HttpOnly por default. Solo pasar en body
 * como fallback (WebView sin cookies, etc).
 */
@Injectable({ providedIn: 'root' })
export class AuthTokenService {
  private readonly api = inject(ApiClient);

  private readonly endpoint = '/v1/auth/token/refresh';

  refresh(dto: RefreshTokenRequest = {}): Observable<SessionTokens> {
    return this.api.post<SessionTokens>(this.endpoint, dto);
  }
}
