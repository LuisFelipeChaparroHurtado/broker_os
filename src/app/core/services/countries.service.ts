import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiClient } from './api.client';
import {
  CountriesListParams,
  CountriesListResponse,
  Country,
} from '../models/common';

/**
 * Endpoints: GET /api/v1/countries [?search, iso_code, phone_indicator, status, type, include_flag]
 *            GET /api/v1/countries/{id}
 *
 * Data de referencia pública — no requiere Authorization, solo la firma HMAC.
 */
@Injectable({ providedIn: 'root' })
export class CountriesService {
  private readonly api = inject(ApiClient);

  private readonly endpoint = '/v1/countries';

  list(params: CountriesListParams = { status: 'AC' }): Observable<Country[]> {
    return this.api
      .get<CountriesListResponse>(this.endpoint, this.toQueryParams(params))
      .pipe(map((r) => r.items));
  }

  getById(id: string): Observable<Country> {
    return this.api.get<Country>(`${this.endpoint}/${id}`);
  }

  private toQueryParams(
    p: CountriesListParams,
  ): Record<string, string | number> {
    const q: Record<string, string | number> = {};
    if (p.search !== undefined)          q['search']          = p.search;
    if (p.phone_indicator !== undefined) q['phone_indicator'] = p.phone_indicator;
    if (p.iso_code !== undefined)        q['iso_code']        = p.iso_code;
    if (p.status !== undefined)          q['status']          = p.status;
    if (p.type !== undefined)            q['type']            = p.type;
    if (p.include_flag !== undefined)    q['include_flag']    = String(p.include_flag);
    return q;
  }
}
