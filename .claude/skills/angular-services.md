# Skill: Angular Services

## Regla Base
Un service tiene una responsabilidad. Si hace HTTP **y** maneja estado **y** transforma datos → dividirlo en 3 servicios.

---

## Tipos de Services

| Tipo | Responsabilidad | `providedIn` |
|------|----------------|--------------|
| **API Service** | Solo llamadas HTTP. Devuelve `Observable<T>`. Sin estado. | `'root'` |
| **Store / State Service** | Mantiene estado reactivo. Orquesta llamadas al API service. | `'root'` |
| **Domain Service** | Lógica de negocio pura (cálculos, transformaciones). Sin HTTP, sin estado. | `'root'` |
| **UI Service** | Modal, toast, loading. Estado de UI global. | `'root'` |

---

## API Service — Patrón Estricto

```typescript
// features/trades/services/trades-api.service.ts
@Injectable({ providedIn: 'root' })
export class TradesApiService {
  private readonly api = inject(ApiClient);

  // Todos los métodos devuelven Observable — sin subscribe aquí
  getAll(params: TradeFilters): Observable<PaginatedResponse<Trade>> {
    return this.api.getPaginated<Trade>('/trades', params);
  }

  getById(id: string): Observable<Trade> {
    return this.api.get<Trade>(`/trades/${id}`);
  }

  create(dto: CreateTradeDto): Observable<Trade> {
    return this.api.post<Trade>('/trades', dto);
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
@Injectable({ providedIn: 'root' })
export class TradesStore {
  // ─── Dependencias ──────────────────────────────
  private readonly api = inject(TradesApiService);

  // ─── Estado privado ────────────────────────────
  private readonly _trades  = signal<Trade[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error   = signal<string | null>(null);
  private readonly _total   = signal<number>(0);
  private readonly _filters = signal<TradeFilters>({});

  // ─── Estado público (readonly) ─────────────────
  readonly trades  = this._trades.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error   = this._error.asReadonly();
  readonly total   = this._total.asReadonly();

  // ─── Computed ──────────────────────────────────
  readonly openTrades   = computed(() => this._trades().filter(t => t.status === 'OPEN'));
  readonly totalPnL     = computed(() => this._trades().reduce((sum, t) => sum + t.pnl, 0));
  readonly hasError     = computed(() => this._error() !== null);

  // ─── Acciones ──────────────────────────────────
  loadAll(filters?: TradeFilters): void {
    if (filters) this._filters.set(filters);
    this._loading.set(true);
    this._error.set(null);

    this.api.getAll(this._filters()).pipe(
      finalize(() => this._loading.set(false))
    ).subscribe({
      next: res => {
        this._trades.set(res.data);
        this._total.set(res.total);
      },
      error: err => this._error.set(err.message)
    });
  }

  cancel(id: string): void {
    // Actualización optimista
    this._trades.update(list =>
      list.map(t => t.id === id ? { ...t, status: 'CANCELLED' as const } : t)
    );

    this.api.cancel(id).subscribe({
      error: () => {
        this._error.set('No se pudo cancelar la orden');
        this.loadAll(); // revertir
      }
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
@Injectable({ providedIn: 'root' })
export class TradeCalculationsService {
  // Sin inject, sin HTTP — solo lógica

  calculatePnL(trade: Trade): number {
    const diff = trade.side === 'BUY'
      ? trade.currentPrice - trade.entryPrice
      : trade.entryPrice - trade.currentPrice;
    return diff * trade.quantity;
  }

  calculatePnLPercent(trade: Trade): number {
    const pnl = this.calculatePnL(trade);
    return (pnl / (trade.entryPrice * trade.quantity)) * 100;
  }

  groupBySymbol(trades: Trade[]): Record<string, Trade[]> {
    return trades.reduce((acc, t) => {
      (acc[t.symbol] ??= []).push(t);
      return acc;
    }, {} as Record<string, Trade[]>);
  }
}
```

---

## UI Service — Estado de Interfaz

```typescript
// core/ui/toast.service.ts
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.snackBar.open(message, '✕', {
      duration: 3000,
      panelClass: ['toast', 'toast--success'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  error(message: string): void {
    this.snackBar.open(message, '✕', {
      duration: 5000,
      panelClass: ['toast', 'toast--error'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  info(message: string): void {
    this.snackBar.open(message, undefined, {
      duration: 3000,
      panelClass: ['toast', 'toast--info'],
    });
  }
}
```

---

## Anti-patrones en Services

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
```
