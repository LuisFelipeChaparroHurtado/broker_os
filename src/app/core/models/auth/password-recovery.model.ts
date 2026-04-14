// POST /api/v1/auth/password-recovery
export interface PasswordRecoveryRequest {
  email: string;
}

// POST /api/v1/auth/password-recovery/verification
export interface PasswordRecoveryVerificationResponse {
  verification_token: string;
}

// PUT /api/v1/auth/password-recovery
export interface ResetPasswordRequest {
  new_password:     string;
  confirm_password: string;
}
