// POST /api/v1/auth/phone
export interface PhoneSendOtpRequest {
  phone: string;
}

export interface PhoneSendOtpResponse {
  code_length: number;
  method:      'SMS';
}
