/**
 * Envelope de respuesta del backend BrokerOS.
 *
 * Éxito:  { success: true,  http_status, message, data }
 * Error:  { success: false, http_status, error: { code, message, detail? } }
 */
export interface ApiResponse<T> {
  success:     true;
  http_status: number;
  message:     string;
  data:        T;
}

export interface ApiErrorResponse {
  success:     false;
  http_status: number;
  error:       ApiError;
}

export interface ApiError {
  code:    string;
  message: string;
  detail?: unknown;
}

export interface PaginatedResponse<T> {
  data:        T[];
  total:       number;
  page:        number;
  limit:       number;
  totalPages:  number;
}
