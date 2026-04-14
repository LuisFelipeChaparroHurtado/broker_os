export type CountryStatus = 'AC' | 'IN';
export type CountryType   = 'C';

export interface Country {
  id:               string;
  iso_code:         string;        // 'CO', 'US', ...
  name:             string;        // 'Colombia', 'United States', ...
  phone_indicator:  number;        // 57, 1, 34, ...
  type:             CountryType;
  postal_code?:     string;
  status:           CountryStatus;
  created_at:       string;
  updated_at:       string;
  flag?:            string;        // base64 SVG, solo si include_flag=true
}

export interface CountriesListParams {
  search?:          string;
  phone_indicator?: number;
  iso_code?:        string;
  status?:          CountryStatus;
  type?:            CountryType;
  include_flag?:    boolean;
}

/**
 * Wrapper paginado que devuelve el endpoint GET /v1/countries
 * — `data` = { items: Country[] }
 */
export interface CountriesListResponse {
  items: Country[];
}
