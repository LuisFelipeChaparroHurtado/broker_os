import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../api.client';
import { ApiResponse } from '../../models/common';
import {
  LoginRequest,
  LoginResendRequest,
  OtpCodeRequest,
  SessionTokens,
  VerificationTokenResponse,
} from '../../models/auth';

/**
 * Endpoints:
 *   POST   /api/v1/auth/session                        (login paso 1)
 *   POST   /api/v1/auth/session/otp/verification       (Bearer verification_token → tokens)
 *   POST   /api/v1/auth/session/otp/resend             (Bearer verification_token)
 *   DELETE /api/v1/auth/session                        (Bearer access_token)
 *
 * Los tres primeros devuelven el envelope completo (`ApiResponse<T>`) para que
 * el store pueda leer `message` y pasarlo al toast. El cuarto (logout) solo
 * necesita `data` porque no dispara toast.
 */
@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private readonly api = inject(ApiClient);

  private readonly endpoints = {
    session:   '/v1/auth/session',
    verifyOtp: '/v1/auth/session/otp/verification',
    resendOtp: '/v1/auth/session/otp/resend',
  } as const;

  login(dto: LoginRequest): Observable<ApiResponse<VerificationTokenResponse>> {
    return this.api.postFull<VerificationTokenResponse>(this.endpoints.session, dto);
  }

  verifyOtp(dto: OtpCodeRequest): Observable<ApiResponse<SessionTokens>> {
    return this.api.postFull<SessionTokens>(this.endpoints.verifyOtp, dto);
  }

  resendOtp(dto: LoginResendRequest = {}): Observable<ApiResponse<VerificationTokenResponse>> {
    return this.api.postFull<VerificationTokenResponse>(this.endpoints.resendOtp, dto);
  }

  logout(): Observable<void> {
    return this.api.delete<void>(this.endpoints.session);
  }
}
