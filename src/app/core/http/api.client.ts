import { Injectable, inject, InjectionToken } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

export interface ApiResponse<T> {
  data:       T;
  message?:   string;
  timestamp:  string;
}

export interface PaginatedResponse<T> {
  data:        T[];
  total:       number;
  page:        number;
  limit:       number;
  totalPages:  number;
}

@Injectable({ providedIn: 'root' })
export class ApiClient {
  private readonly http    = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  get<T>(path: string, params?: Record<string, string | number>): Observable<T> {
    return this.http
      .get<ApiResponse<T>>(`${this.baseUrl}${path}`, { params: this.toParams(params) })
      .pipe(map(r => r.data));
  }

  getPaginated<T>(
    path: string,
    params?: Record<string, string | number>
  ): Observable<PaginatedResponse<T>> {
    return this.http.get<PaginatedResponse<T>>(
      `${this.baseUrl}${path}`,
      { params: this.toParams(params) }
    );
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .post<ApiResponse<T>>(`${this.baseUrl}${path}`, body)
      .pipe(map(r => r.data));
  }

  patch<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .patch<ApiResponse<T>>(`${this.baseUrl}${path}`, body)
      .pipe(map(r => r.data));
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${path}`);
  }

  private toParams(obj?: Record<string, string | number>): HttpParams {
    if (!obj) return new HttpParams();
    return new HttpParams({ fromObject: Object.fromEntries(
      Object.entries(obj)
        .filter(([, v]) => v !== undefined && v !== null)
        .map(([k, v]) => [k, String(v)])
    )});
  }
}
