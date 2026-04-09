# Skill: Angular State Management

## Cuándo usar qué

| Herramienta | Cuándo usarla |
|------------|---------------|
| `signal()` | Estado local del componente (UI state) |
| `computed()` | Valores derivados de signals — reemplaza pipes en .ts |
| `effect()` | Efectos secundarios reactivos (sync, logging, DOM) |
| `input()` signal | Datos que vienen del componente padre |
| `BehaviorSubject` | Estado en services que necesita interop con RxJS |
| `toSignal()` | Convertir Observable → Signal para usar en template |
| `toObservable()` | Convertir Signal → Observable para encadenar RxJS |

---

## Signal — Estado Local del Componente

```typescript
// Solo para estado de UI — nunca estado de negocio
readonly expanded     = signal<boolean>(false);
readonly activeTab    = signal<number>(0);
readonly searchQuery  = signal<string>('');
readonly selectedIds  = signal<Set<string>>(new Set());

// Mutar signals
this.expanded.set(true);
this.activeTab.update(tab => tab + 1);
this.selectedIds.update(set => new Set([...set, id]));
```

---

## Computed — Valores Derivados

```typescript
// Computed se recalcula automáticamente cuando cambian sus dependencias
readonly filteredTrades = computed(() =>
  this.trades().filter(t =>
    t.symbol.includes(this.searchQuery().toUpperCase())
  )
);

readonly summary = computed(() => ({
  total:  this.trades().length,
  open:   this.trades().filter(t => t.status === 'OPEN').length,
  profit: this.trades().filter(t => t.pnl > 0).length,
  loss:   this.trades().filter(t => t.pnl < 0).length,
}));

readonly isEmpty = computed(() => this.filteredTrades().length === 0);

// Computed encadenados
readonly hasProfit = computed(() => this.summary().profit > this.summary().loss);
```

---

## Effect — Efectos Secundarios

```typescript
constructor() {
  // Sync con localStorage
  effect(() => {
    localStorage.setItem('activeTab', String(this.activeTab()));
  });

  // Log para debugging (solo dev)
  effect(() => {
    if (!environment.production) {
      console.log('[TradesPage] trades =', this.trades());
    }
  });

  // Actualizar título del documento
  effect(() => {
    const count = this.openTrades().length;
    document.title = count > 0 ? `(${count}) Broker OS` : 'Broker OS';
  });
}
```

---

## Store Pattern — Signal-based (sin NgRx)

```typescript
@Injectable({ providedIn: 'root' })
export class TradesStore {
  // ─── Estado privado ─────────────────────────────────────────
  private readonly _state = signal<TradesState>({
    items:   [],
    total:   0,
    loading: false,
    error:   null,
    filters: { page: 0, limit: 25 },
  });

  // ─── Selectores públicos ────────────────────────────────────
  readonly items   = computed(() => this._state().items);
  readonly total   = computed(() => this._state().total);
  readonly loading = computed(() => this._state().loading);
  readonly error   = computed(() => this._state().error);
  readonly filters = computed(() => this._state().filters);

  // Selectores derivados
  readonly openItems   = computed(() => this.items().filter(t => t.status === 'OPEN'));
  readonly totalPnL    = computed(() => this.items().reduce((acc, t) => acc + t.pnl, 0));
  readonly pageCount   = computed(() => Math.ceil(this.total() / this.filters().limit));

  // ─── Único punto de mutación ────────────────────────────────
  private patch(partial: Partial<TradesState>): void {
    this._state.update(s => ({ ...s, ...partial }));
  }

  // ─── Acciones ───────────────────────────────────────────────
  setLoading(loading: boolean): void { this.patch({ loading }); }
  setError(error: string | null): void { this.patch({ error }); }
  setItems(items: Trade[], total: number): void { this.patch({ items, total, error: null }); }

  updateFilters(filters: Partial<TradeFilters>): void {
    this.patch({ filters: { ...this.filters(), ...filters } });
  }

  updateItem(id: string, changes: Partial<Trade>): void {
    this.patch({
      items: this.items().map(t => t.id === id ? { ...t, ...changes } : t)
    });
  }

  removeItem(id: string): void {
    this.patch({ items: this.items().filter(t => t.id !== id) });
  }
}

interface TradesState {
  items:   Trade[];
  total:   number;
  loading: boolean;
  error:   string | null;
  filters: TradeFilters;
}
```

---

## Interop RxJS ↔ Signals

```typescript
// Observable → Signal (para usar en template con OnPush)
private readonly api = inject(TradesApiService);
readonly trades = toSignal(this.api.getAll(), { initialValue: [] });

// Signal → Observable (para encadenar operadores RxJS)
private readonly query = signal('');
readonly results$ = toObservable(this.query).pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(q => this.api.search(q))
);

// Usar resultado de Observable como Signal de vuelta
readonly results = toSignal(this.results$, { initialValue: [] });
```

---

## Anti-patrones de Estado

```typescript
// ❌ Mutar arrays/objetos directamente
this._items.update(list => { list.push(newItem); return list; }); // no dispara CD

// ✅ Siempre crear nuevas referencias
this._items.update(list => [...list, newItem]);

// ❌ Leer signal fuera de contexto reactivo (en métodos async/setTimeout)
setTimeout(() => {
  const val = this.mySignal(); // puede ser stale
});

// ✅ Capturar el valor antes del async
const val = this.mySignal();
setTimeout(() => { /* usar val */ });

// ❌ Signals derivadas de efectos secundarios en computed
readonly sideEffect = computed(() => {
  this.someService.doSomething(); // ← efecto en computed — prohibido
  return this.data().length;
});
```
