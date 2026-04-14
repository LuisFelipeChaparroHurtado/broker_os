import { MfaMethod } from './mfa-method.type';

export interface MfaMethodConfig {
  id:        string;
  user_id:   string;
  method:    MfaMethod;
  is_active: boolean;
}

// GET /api/v1/auth/mfa/methods
export interface MfaMethodsResponse {
  methods: MfaMethodConfig[];
}

// PUT /api/v1/auth/mfa/methods
export interface UpdateMfaMethodsRequest {
  methods: Array<{
    method:    MfaMethod;
    is_active: boolean;
  }>;
}

// POST /api/v1/auth/mfa/totp/setup
export interface TotpSetupResponse {
  secret:           string;
  provisioning_uri: string;
  qr_base64:        string;
}

// POST /api/v1/auth/mfa/totp/verification
export interface TotpVerificationRequest {
  totp_code: string;
}
