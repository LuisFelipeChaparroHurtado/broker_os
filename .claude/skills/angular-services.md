# Skill: Angular Services

## Regla Base

Un service tiene una responsabilidad. Si hace HTTP **y** maneja estado **y** transforma datos → dividirlo en 3 servicios.

**Regla de seguridad:** toda llamada a `/api/*` debe pasar por el `integrityInterceptor`. Ningún service firma manualmente — la firma vive en la capa HTTP.

---

## Arquitectura en Capas

```
┌─────────────────────────────────────────────┐
│  Components / Smart Containers              │
├─────────────────────────────────────────────┤
│  Store Services      (estado + orquestación)│
│  Domain Services     (lógica pura)          │
│  UI Services         (toast, modal, loader) │
├─────────────────────────────────────────────┤
│  API Services        (HTTP tipado)          │
├─────────────────────────────────────────────┤
│  ApiClient           (wrapper HttpClient)   │
├─────────────────────────────────────────────┤
│  HTTP Interceptors                          │
│    • authInterceptor                        │
│    • integrityInterceptor  ← X-Signature    │
│    • errorInterceptor                       │
└─────────────────────────────────────────────┘
```

---

## Tipos de Services

| Tipo                      | Responsabilidad                                                            | `providedIn` |
| ------------------------- | -------------------------------------------------------------------------- | ------------ |
| **API Service**           | Solo llamadas HTTP. Devuelve `Observable<T>`. Sin estado.                  | `'root'`     |
| **Store / State Service** | Mantiene estado reactivo. Orquesta llamadas al API service.                | `'root'`     |
| **Domain Service**        | Lógica de negocio pura (cálculos, transformaciones). Sin HTTP, sin estado. | `'root'`     |
| **UI Service**            | Modal, toast, loading. Estado de UI global.                                | `'root'`     |

---

## Estructura de Carpetas

```
src/app/
├── core/
│   ├── http/
│   │   ├── api-client.ts
│   │   └── interceptors/
│   │       ├── auth.interceptor.ts
│   │       ├── integrity.interceptor.ts   ← firma HMAC
│   │       └── error.interceptor.ts
│   └── ui/
│       ├── toast.service.ts
│       └── loader.service.ts
├── features/
│   └── trades/
│       ├── services/
│       │   ├── trades-api.service.ts
│       │   └── trade-calculations.service.ts
│       ├── store/
│       │   └── trades.store.ts
│       └── models/
│           └── trade.model.ts
└── shared/
    └── models/
```

---

## Integrity Interceptor — Firma HMAC-SHA256

Todo request hacia `/api/*` se firma automáticamente con tres headers: `X-Timestamp`, `X-Nonce`, `X-Signature`. La firma es `SHA256(path + timestamp + nonce + body)`.

```typescript
// core/http/interceptors/integrity.interceptor.ts
import { HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import sha256 from "crypto-js/sha256";
import hex from "crypto-js/enc-hex";

export const integrityInterceptor: HttpInterceptorFn = (req, next) => {
  const url = new URL(req.url, window.location.origin);
  const path = url.pathname;

  // Solo firmar rutas /api/*
  if (!path.startsWith("/api/")) {
    return next(req);
  }

  const timestamp = Date.now().toString();
  const nonce = crypto.randomUUID();
  const body = serializeBody(req);

  const message = path + timestamp + nonce + body;
  const signature = sha256(message).toString(hex);

  const signed = req.clone({
    setHeaders: {
      "X-Timestamp": timestamp,
      "X-Nonce": nonce,
      "X-Signature": signature,
    },
  });

  return next(signed);
};

function serializeBody(req: HttpRequest<unknown>): string {
  if (req.body == null) return "";
  if (typeof req.body === "string") return req.body;
  if (req.body instanceof FormData) return ""; // FormData no se firma
  return JSON.stringify(req.body);
}
```

**Registro en `app.config.ts`:**

```typescript
// app.config.ts
import { ApplicationConfig } from "@angular/core";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { authInterceptor } from "./core/http/interceptors/auth.interceptor";
import { integrityInterceptor } from "./core/http/interceptors/integrity.interceptor";
import { errorInterceptor } from "./core/http/interceptors/error.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        authInterceptor, // 1. añade Bearer token
        integrityInterceptor, // 2. firma el request YA con su token
        errorInterceptor, // 3. captura errores
      ]),
    ),
  ],
};
```

**Orden crítico:** `integrity` va **después** de `auth` para que el token ya esté en el request, pero **antes** de `error`. La firma se calcula sobre el request final que sale al servidor.

---

## ApiClient — Wrapper Tipado

```typescript
// core/http/api-client.ts
@Injectable({ providedIn: "root" })
export class ApiClient {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = "/api";

  get<T>(path: string, params?: Record<string, unknown>): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${path}`, { params: this.toParams(params) });
  }

  getPaginated<T>(path: string, params?: Record<string, unknown>): Observable<PaginatedResponse<T>> {
    return this.http.get<PaginatedResponse<T>>(`${this.baseUrl}${path}`, { params: this.toParams(params) });
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, body);
  }

  patch<T>(path: string, body: unknown): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${path}`, body);
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${path}`);
  }

  private toParams(obj?: Record<string, unknown>): HttpParams {
    let params = new HttpParams();
    if (!obj) return params;
    for (const [k, v] of Object.entries(obj)) {
      if (v != null) params = params.set(k, String(v));
    }
    return params;
  }
}
```

---

## API Service — Patrón Estricto

```typescript
// features/trades/services/trades-api.service.ts
@Injectable({ providedIn: "root" })
export class TradesApiService {
  private readonly api = inject(ApiClient);

  // Todos los métodos devuelven Observable — sin subscribe aquí
  // La firma X-Signature la añade el integrityInterceptor automáticamente
  getAll(params: TradeFilters): Observable<PaginatedResponse<Trade>> {
    return this.api.getPaginated<Trade>("/trades", params);
  }

  getById(id: string): Observable<Trade> {
    return this.api.get<Trade>(`/trades/${id}`);
  }

  create(dto: CreateTradeDto): Observable<Trade> {
    return this.api.post<Trade>("/trades", dto);
  }

  cancel(id: string): Observable<void> {
    return this.api.delete<void>(`/trades/${id}`);
  }

  update(id: string, dto: Partial<CreateTradeDto>): Observable<Trade> {
    return this.api.patch<Trade>(`/trades/${id}`, dto);
  }
}
```

---

## Store Service — Estado + Orquestación

```typescript
// features/trades/store/trades.store.ts
@Injectable({ providedIn: "root" })
export class TradesStore {
  // ─── Dependencias ──────────────────────────────
  private readonly api = inject(TradesApiService);

  // ─── Estado privado ────────────────────────────
  private readonly _trades = signal<Trade[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _total = signal<number>(0);
  private readonly _filters = signal<TradeFilters>({});

  // ─── Estado público (readonly) ─────────────────
  readonly trades = this._trades.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly total = this._total.asReadonly();

  // ─── Computed ──────────────────────────────────
  readonly openTrades = computed(() => this._trades().filter((t) => t.status === "OPEN"));
  readonly totalPnL = computed(() => this._trades().reduce((sum, t) => sum + t.pnl, 0));
  readonly hasError = computed(() => this._error() !== null);

  // ─── Acciones ──────────────────────────────────
  loadAll(filters?: TradeFilters): void {
    if (filters) this._filters.set(filters);
    this._loading.set(true);
    this._error.set(null);

    this.api
      .getAll(this._filters())
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: (res) => {
          this._trades.set(res.data);
          this._total.set(res.total);
        },
        error: (err) => this._error.set(err.message),
      });
  }

  cancel(id: string): void {
    // Actualización optimista
    this._trades.update((list) => list.map((t) => (t.id === id ? { ...t, status: "CANCELLED" as const } : t)));

    this.api.cancel(id).subscribe({
      error: () => {
        this._error.set("No se pudo cancelar la orden");
        this.loadAll(); // revertir
      },
    });
  }

  refresh(): void {
    this.loadAll(this._filters());
  }

  clearError(): void {
    this._error.set(null);
  }
}
```

---

## Domain Service — Lógica Pura

```typescript
// features/trades/services/trade-calculations.service.ts
@Injectable({ providedIn: "root" })
export class TradeCalculationsService {
  // Sin inject, sin HTTP — solo lógica

  calculatePnL(trade: Trade): number {
    const diff = trade.side === "BUY" ? trade.currentPrice - trade.entryPrice : trade.entryPrice - trade.currentPrice;
    return diff * trade.quantity;
  }

  calculatePnLPercent(trade: Trade): number {
    const pnl = this.calculatePnL(trade);
    return (pnl / (trade.entryPrice * trade.quantity)) * 100;
  }

  groupBySymbol(trades: Trade[]): Record<string, Trade[]> {
    return trades.reduce(
      (acc, t) => {
        (acc[t.symbol] ??= []).push(t);
        return acc;
      },
      {} as Record<string, Trade[]>,
    );
  }
}
```

---

## UI Service — Estado de Interfaz

```typescript
// core/ui/toast.service.ts
@Injectable({ providedIn: "root" })
export class ToastService {
  private readonly snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.snackBar.open(message, "✕", {
      duration: 3000,
      panelClass: ["toast", "toast--success"],
      horizontalPosition: "right",
      verticalPosition: "top",
    });
  }

  error(message: string): void {
    this.snackBar.open(message, "✕", {
      duration: 5000,
      panelClass: ["toast", "toast--error"],
      horizontalPosition: "right",
      verticalPosition: "top",
    });
  }

  info(message: string): void {
    this.snackBar.open(message, undefined, {
      duration: 3000,
      panelClass: ["toast", "toast--info"],
    });
  }
}
```

---

## Checklist — Antes de Mergear un Service

- [ ] Tiene **una sola** responsabilidad (API / Store / Domain / UI)
- [ ] `providedIn: 'root'` (o scope explícito)
- [ ] Dependencias con `inject()`, no constructor
- [ ] API services **no** hacen `subscribe` — devuelven `Observable<T>`
- [ ] Store services exponen signals con `.asReadonly()`
- [ ] Las rutas apuntan a `/api/*` para que el `integrityInterceptor` las firme
- [ ] Ningún service calcula `X-Signature` manualmente — eso es del interceptor
- [ ] Domain services son puros: sin `inject`, sin HTTP, sin estado

---

## Anti-patrones

```typescript
// ❌ Service que hace todo
@Injectable()
export class TradesService {
  getTrades() { /* HTTP */ }
  calculatePnL() { /* lógica */ }
  trades = signal([]);         // estado
  showToast() { /* UI */ }     // ui
}

// ❌ Subscribe dentro de un service que devuelve Observable
getAll(): Observable<Trade[]> {
  return this.http.get<Trade[]>('/trades').pipe(
    tap(data => this.localVar = data) // ← efecto secundario oculto
  );
}

// ✅ El service que maneja estado suscribe; el API service no
loadAll(): void {                     // ← Store service
  this.api.getAll().subscribe(data => this._trades.set(data));
}

// ❌ Firmar manualmente dentro del API service
create(dto: CreateTradeDto): Observable<Trade> {
  const ts = Date.now().toString();
  const sig = sha256('/api/trades' + ts + ...); // ← NO. Eso es del interceptor.
  return this.api.post('/trades', dto, { headers: { 'X-Signature': sig } });
}

// ✅ El API service no sabe nada de firmas
create(dto: CreateTradeDto): Observable<Trade> {
  return this.api.post<Trade>('/trades', dto); // interceptor firma solo
}

// ❌ Bypassing /api/ → el request sale sin firma
this.http.get('/trades'); // ← el interceptor lo ignora por no empezar con /api/

// ✅ Siempre a través del ApiClient
this.api.get<Trade[]>('/trades'); // → /api/trades, firmado
```
