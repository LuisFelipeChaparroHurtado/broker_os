// POST /api/v1/auth/registration
export interface RegistrationRequest {
  email:            string;
  first_name:       string;
  last_name:        string;
  password:         string;
  confirm_password: string;
  phone?:           string;  // formato: '+<indicator><número>', ej. '+573001234567'
  country_id?:      string;  // UUID del país (de GET /v1/countries)
  birth_date?:      string;  // ISO date 'YYYY-MM-DD'
  address?:         string;
}

export interface RegistrationResponse {
  user: {
    id:    string;
    email: string;
  };
  verification_token: string;
  otp_sent:           boolean;
}

// POST /api/v1/auth/registration/verification/resend
export interface RegistrationResendRequest {
  email: string;
}
