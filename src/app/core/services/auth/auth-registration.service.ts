import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../api.client';
import { ApiResponse } from '../../models/common';
import {
  OtpCodeRequest,
  RegistrationRequest,
  RegistrationResendRequest,
  RegistrationResponse,
  VerificationTokenResponse,
} from '../../models/auth';

/**
 * Endpoints:
 *   POST /api/v1/auth/registration
 *   POST /api/v1/auth/registration/verification               (Bearer verification_token)
 *   POST /api/v1/auth/registration/verification/resend
 *
 * Todos devuelven el envelope completo para que el store pueda leer `message`
 * y pasarlo al toast.
 */
@Injectable({ providedIn: 'root' })
export class AuthRegistrationService {
  private readonly api = inject(ApiClient);

  private readonly endpoints = {
    register: '/v1/auth/registration',
    verify:   '/v1/auth/registration/verification',
    resend:   '/v1/auth/registration/verification/resend',
  } as const;

  register(dto: RegistrationRequest): Observable<ApiResponse<RegistrationResponse>> {
    console.log('[AuthRegistrationService.register] payload →', dto);
    console.log('[AuthRegistrationService.register] payload (json) →', JSON.stringify(dto, null, 2));
    return this.api.postFull<RegistrationResponse>(this.endpoints.register, dto);
  }

  verify(dto: OtpCodeRequest): Observable<ApiResponse<null>> {
    return this.api.postFull<null>(this.endpoints.verify, dto);
  }

  resend(dto: RegistrationResendRequest): Observable<ApiResponse<VerificationTokenResponse>> {
    return this.api.postFull<VerificationTokenResponse>(this.endpoints.resend, dto);
  }
}
