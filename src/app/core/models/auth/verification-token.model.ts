import { MfaMethod } from './mfa-method.type';

/**
 * Respuesta común a todos los endpoints que disparan envío de OTP:
 * - POST /auth/session           (login)
 * - POST /auth/session/otp/resend
 * - POST /auth/registration/verification/resend
 * - POST /auth/password-recovery
 * - POST /auth/password-recovery/resend
 *
 * `verification_token` es un JWT de 15 min que autoriza el siguiente paso
 * (se envía como `Authorization: Bearer <verification_token>`).
 */
export interface VerificationTokenResponse {
  code_length:        number;
  method:             MfaMethod;
  verification_token: string;
}

export interface OtpCodeRequest {
  otp_code: string;
}
