import { Injectable, inject, InjectionToken } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse, PaginatedResponse } from '../models/common';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

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

  /**
   * Igual que `post`, pero devuelve el envelope completo
   * (`{ success, http_status, message, data }`) en vez de solo `data`.
   * Usar cuando el consumidor necesita el `message` del backend
   * (ej. mostrarlo en un toast).
   */
  postFull<T>(path: string, body: unknown): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${path}`, body);
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .put<ApiResponse<T>>(`${this.baseUrl}${path}`, body)
      .pipe(map(r => r.data));
  }

  /** Igual que `put`, pero devuelve el envelope completo (para leer `message`). */
  putFull<T>(path: string, body: unknown): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}${path}`, body);
  }

  patch<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .patch<ApiResponse<T>>(`${this.baseUrl}${path}`, body)
      .pipe(map(r => r.data));
  }

  delete<T>(path: string): Observable<T> {
    return this.http
      .delete<ApiResponse<T>>(`${this.baseUrl}${path}`)
      .pipe(map(r => r.data));
  }

  private toParams(obj?: Record<string, string | number>): HttpParams {
    if (!obj) return new HttpParams();
    return new HttpParams({
      fromObject: Object.fromEntries(
        Object.entries(obj)
          .filter(([, v]) => v !== undefined && v !== null)
          .map(([k, v]) => [k, String(v)]),
      ),
    });
  }
}
