import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _token = signal<string | null>(
    localStorage.getItem('access_token')
  );

  readonly token      = this._token.asReadonly();
  readonly isLoggedIn = computed(() => !!this._token());

  setToken(token: string): void {
    localStorage.setItem('access_token', token);
    this._token.set(token);
  }

  clearToken(): void {
    localStorage.removeItem('access_token');
    this._token.set(null);
  }
}
