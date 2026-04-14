export interface AuthUser {
  id:          string;
  email:       string;
  first_name?: string;
  last_name?:  string;
  phone?:      string;
}

export interface SessionTokens {
  access_token:  string;
  refresh_token: string;
  token_type:    'bearer';
  user:          AuthUser;
}
