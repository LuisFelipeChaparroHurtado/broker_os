import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../api.client';
import {
  MfaMethodsResponse,
  TotpSetupResponse,
  TotpVerificationRequest,
  UpdateMfaMethodsRequest,
} from '../../models/auth';

/**
 * Endpoints (requieren Bearer access_token):
 *   GET  /api/v1/auth/mfa/methods            → lista métodos activos/inactivos
 *   PUT  /api/v1/auth/mfa/methods            → activa/desactiva (mínimo 1 activo)
 *   POST /api/v1/auth/mfa/totp/setup         → genera secret + QR para Google Authenticator
 *   POST /api/v1/auth/mfa/totp/verification  → confirma setup TOTP
 */
@Injectable({ providedIn: 'root' })
export class AuthMfaService {
  private readonly api = inject(ApiClient);

  private readonly endpoints = {
    methods:    '/v1/auth/mfa/methods',
    totpSetup:  '/v1/auth/mfa/totp/setup',
    totpVerify: '/v1/auth/mfa/totp/verification',
  } as const;

  listMethods(): Observable<MfaMethodsResponse> {
    return this.api.get<MfaMethodsResponse>(this.endpoints.methods);
  }

  updateMethods(dto: UpdateMfaMethodsRequest): Observable<MfaMethodsResponse> {
    return this.api.put<MfaMethodsResponse>(this.endpoints.methods, dto);
  }

  totpSetup(): Observable<TotpSetupResponse> {
    return this.api.post<TotpSetupResponse>(this.endpoints.totpSetup, {});
  }

  totpVerify(dto: TotpVerificationRequest): Observable<void> {
    return this.api.post<void>(this.endpoints.totpVerify, dto);
  }
}
