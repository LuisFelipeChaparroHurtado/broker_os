import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../api.client';
import {
  OtpCodeRequest,
  PhoneSendOtpRequest,
  PhoneSendOtpResponse,
} from '../../models/auth';

/**
 * Endpoints (requieren Bearer access_token):
 *   POST /api/v1/auth/phone                  → envía OTP por SMS
 *   POST /api/v1/auth/phone/verification     → confirma OTP y marca teléfono verificado
 */
@Injectable({ providedIn: 'root' })
export class AuthPhoneService {
  private readonly api = inject(ApiClient);

  private readonly endpoints = {
    phone:  '/v1/auth/phone',
    verify: '/v1/auth/phone/verification',
  } as const;

  sendOtp(dto: PhoneSendOtpRequest): Observable<PhoneSendOtpResponse> {
    return this.api.post<PhoneSendOtpResponse>(this.endpoints.phone, dto);
  }

  verify(dto: OtpCodeRequest): Observable<void> {
    return this.api.post<void>(this.endpoints.verify, dto);
  }
}
