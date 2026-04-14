# Prompt: Crear `AuthService` + `AuthStore`

Sigue el skill **Angular Services**. Asume que `integrityInterceptor`, `authInterceptor` y `ApiClient` ya existen en `core/http/`. **Ningún service firma manualmente** — el interceptor inyecta `X-Timestamp`, `X-Nonce` y `X-Signature` para todo request a `/api/*`.

---

## Contrato del Backend

### 1. Iniciar sesión (solicitar OTP)

```
POST {{base_url}}/api/v1/auth/session
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "••••••••",
  "mfa_method": "EMAIL"
}
```

**Respuesta esperada (200):**

```json
{
  "session_token": "tmp_xxx",
  "mfa_method": "EMAIL",
  "expires_in": 300
}
```

### 2. Verificar OTP

```
POST {{base_url}}/api/v1/auth/session/otp/verification
Content-Type: application/json
Authorization: Bearer <session_token>

{
  "otp_code": "482917"
}
```

**Respuesta esperada (200):**

```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "user": { "id": "...", "email": "...", "name": "..." }
}
```

---

## Integridad de Mensaje — Recordatorio

Ambos endpoints están bajo `/api/*` → el `integrityInterceptor` los firma automáticamente. La firma es:

```
SHA256(path + timestamp + nonce + body)
```

- `path` → `/api/v1/auth/session` o `/api/v1/auth/session/otp/verification`
- `timestamp` → `Date.now().toString()`
- `nonce` → `crypto.randomUUID()`
- `body` → `JSON.stringify(requestBody)`

Headers añadidos por el interceptor:

- `X-Timestamp`
- `X-Nonce`
- `X-Signature`

**No escribir firmas en el service.** Si el request sale sin firma es porque el path no empieza con `/api/` o el interceptor no está registrado en `app.config.ts`.

---

## Estructura a Crear

```
src/app/features/auth/
├── models/
│   └── auth.model.ts
├── services/
│   └── auth-api.service.ts
└── store/
    └── auth.store.ts
```

---

## Modelos

```typescript
// features/auth/models/auth.model.ts
export type MfaMethod = "EMAIL" | "SMS" | "TOTP";

export interface LoginRequest {
  email: string;
  password: string;
  mfa_method: MfaMethod;
}

export interface LoginResponse {
  session_token: string;
  mfa_method: MfaMethod;
  expires_in: number;
}

export interface OtpVerificationRequest {
  otp_code: string;
}

export interface OtpVerificationResponse {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}
```

---

## API Service — Solo HTTP

```typescript
// features/auth/services/auth-api.service.ts
@Injectable({ providedIn: "root" })
export class AuthApiService {
  private readonly api = inject(ApiClient);

  // POST /api/v1/auth/session
  login(dto: LoginRequest): Observable<LoginResponse> {
    return this.api.post<LoginResponse>("/v1/auth/session", dto);
  }

  // POST /api/v1/auth/session/otp/verification
  verifyOtp(dto: OtpVerificationRequest): Observable<OtpVerificationResponse> {
    return this.api.post<OtpVerificationResponse>("/v1/auth/session/otp/verification", dto);
  }

  // DELETE /api/v1/auth/session  (logout)
  logout(): Observable<void> {
    return this.api.delete<void>("/v1/auth/session");
  }
}
```

> El `ApiClient` ya antepone `/api` al `baseUrl`, por eso los paths empiezan en `/v1/...`.

---

## Store Service — Estado + Orquestación

```typescript
// features/auth/store/auth.store.ts
@Injectable({ providedIn: "root" })
export class AuthStore {
  // ─── Dependencias ──────────────────────────────
  private readonly api = inject(AuthApiService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  // ─── Estado privado ────────────────────────────
  private readonly _user = signal<AuthUser | null>(null);
  private readonly _accessToken = signal<string | null>(null);
  private readonly _sessionToken = signal<string | null>(null); // temporal pre-OTP
  private readonly _mfaMethod = signal<MfaMethod | null>(null);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _awaitingOtp = signal<boolean>(false);

  // ─── Estado público (readonly) ─────────────────
  readonly user = this._user.asReadonly();
  readonly accessToken = this._accessToken.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly awaitingOtp = this._awaitingOtp.asReadonly();
  readonly mfaMethod = this._mfaMethod.asReadonly();

  // ─── Computed ──────────────────────────────────
  readonly isAuthenticated = computed(() => this._accessToken() !== null);
  readonly hasError = computed(() => this._error() !== null);

  // ─── Acciones ──────────────────────────────────

  /** Paso 1: email + password → dispara envío de OTP */
  login(email: string, password: string, mfa_method: MfaMethod = "EMAIL"): void {
    this._loading.set(true);
    this._error.set(null);

    this.api
      .login({ email, password, mfa_method })
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (res) => {
          this._sessionToken.set(res.session_token);
          this._mfaMethod.set(res.mfa_method);
          this._awaitingOtp.set(true);
          this.toast.info(`Código enviado vía ${res.mfa_method}`);
        },
        error: (err) => {
          this._error.set(err?.error?.message ?? "Credenciales inválidas");
          this.toast.error(this._error()!);
        },
      });
  }

  /** Paso 2: código OTP → tokens finales */
  verifyOtp(otp_code: string): void {
    if (!this._sessionToken()) {
      this._error.set("No hay sesión pendiente de verificación");
      return;
    }

    this._loading.set(true);
    this._error.set(null);

    this.api
      .verifyOtp({ otp_code })
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (res) => {
          this._accessToken.set(res.access_token);
          this._user.set(res.user);
          this._sessionToken.set(null);
          this._awaitingOtp.set(false);
          this._mfaMethod.set(null);
          this.toast.success(`Bienvenido, ${res.user.name}`);
          this.router.navigate(["/dashboard"]);
        },
        error: (err) => {
          this._error.set(err?.error?.message ?? "Código OTP inválido");
          this.toast.error(this._error()!);
        },
      });
  }

  logout(): void {
    this.api.logout().subscribe({
      complete: () => this.reset(),
    });
  }

  clearError(): void {
    this._error.set(null);
  }

  private reset(): void {
    this._user.set(null);
    this._accessToken.set(null);
    this._sessionToken.set(null);
    this._mfaMethod.set(null);
    this._awaitingOtp.set(false);
    this._error.set(null);
    this.router.navigate(["/login"]);
  }
}
```

---

## Uso en Componentes

```typescript
// features/auth/pages/login.page.ts
@Component({
  /* ... */
})
export class LoginPage {
  private readonly store = inject(AuthStore);

  readonly loading = this.store.loading;
  readonly error = this.store.error;
  readonly awaitingOtp = this.store.awaitingOtp;

  onLogin(email: string, password: string): void {
    this.store.login(email, password, "EMAIL");
  }

  onVerifyOtp(code: string): void {
    this.store.verifyOtp(code);
  }
}
```

---

## Checklist de Verificación

- [ ] `AuthApiService` solo hace HTTP, devuelve `Observable<T>`, no tiene `subscribe`
- [ ] `AuthStore` suscribe y maneja signals con `.asReadonly()`
- [ ] Ningún `sha256`, `X-Signature` ni `crypto-js` aparece en `features/auth/` — eso vive en `core/http/interceptors/integrity.interceptor.ts`
- [ ] Ambos endpoints se llaman vía `ApiClient`, por lo tanto salen hacia `/api/v1/auth/...` y el interceptor los firma
- [ ] `authInterceptor` inyecta `Authorization: Bearer <session_token>` en el paso 2 (OTP) antes de que firme `integrityInterceptor`
- [ ] Modelos tipados, sin `any`
- [ ] Errores capturados en el Store, mostrados vía `ToastService`

---

## Verificación Manual (DevTools → Network)

Al enviar `POST /api/v1/auth/session`, el request debe incluir:

```
X-Timestamp: 1760000000000
X-Nonce: 550e8400-e29b-41d4-a716-446655440000
X-Signature: a3f5c8...  (64 chars hex)
Content-Type: application/json
```

Si falta cualquiera de estos tres headers → el interceptor no está corriendo o el path no empieza con `/api/`.
