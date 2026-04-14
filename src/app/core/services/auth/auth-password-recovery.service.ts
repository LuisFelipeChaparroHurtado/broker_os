import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../api.client';
import { ApiResponse } from '../../models/common';
import {
  OtpCodeRequest,
  PasswordRecoveryRequest,
  PasswordRecoveryVerificationResponse,
  ResetPasswordRequest,
  VerificationTokenResponse,
} from '../../models/auth';

/**
 * Endpoints:
 *   POST /api/v1/auth/password-recovery
 *   POST /api/v1/auth/password-recovery/verification   (Bearer verification_token)
 *   POST /api/v1/auth/password-recovery/resend         (Bearer verification_token)
 *   PUT  /api/v1/auth/password-recovery                (Bearer password_reset_token)
 *
 * Todos devuelven el envelope completo para que el store pueda leer `message`
 * y pasarlo al toast.
 */
@Injectable({ providedIn: 'root' })
export class AuthPasswordRecoveryService {
  private readonly api = inject(ApiClient);

  private readonly endpoints = {
    root:   '/v1/auth/password-recovery',
    verify: '/v1/auth/password-recovery/verification',
    resend: '/v1/auth/password-recovery/resend',
  } as const;

  start(dto: PasswordRecoveryRequest): Observable<ApiResponse<VerificationTokenResponse | null>> {
    return this.api.postFull<VerificationTokenResponse | null>(this.endpoints.root, dto);
  }

  verify(dto: OtpCodeRequest): Observable<ApiResponse<PasswordRecoveryVerificationResponse>> {
    return this.api.postFull<PasswordRecoveryVerificationResponse>(this.endpoints.verify, dto);
  }

  resend(): Observable<ApiResponse<VerificationTokenResponse>> {
    return this.api.postFull<VerificationTokenResponse>(this.endpoints.resend, {});
  }

  reset(dto: ResetPasswordRequest): Observable<ApiResponse<null>> {
    return this.api.putFull<null>(this.endpoints.root, dto);
  }
}
