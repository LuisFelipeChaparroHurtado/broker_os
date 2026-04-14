import { MfaMethod } from './mfa-method.type';

// POST /api/v1/auth/session
export interface LoginRequest {
  email:       string;
  password:    string;
  mfa_method?: MfaMethod;
}

// POST /api/v1/auth/session/otp/resend
export interface LoginResendRequest {
  method?:  MfaMethod;
  purpose?: string;
}
