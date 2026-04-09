# Skill: Angular Best Practices

## Las 10 Reglas del Proyecto

1. **`OnPush` siempre** — cada componente
2. **Sin `any`** — TypeScript estricto en todo
3. **Signals API** — `input()`, `output()`, `signal()`, `computed()`
4. **Un service, una responsabilidad** — ver `angular-services.md`
5. **Lazy loading** — todas las rutas de feature
6. **Variables CSS del DS** — usar siempre `var(--color-*)`, `var(--space-*)`, `var(--radius-*)`, `var(--font-*)` — nunca valores hardcodeados
7. **`takeUntilDestroyed`** — toda subscription tiene cleanup
8. **Sin lógica en templates** — computed en el .ts
9. **Interfaces antes de implementar** — definir tipos primero
10. **Test de renderizado mínimo** — todo componente tiene spec

---

## TypeScript Estricto

```typescript
// tsconfig.json — configuración obligatoria
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictPropertyInitialization": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### Tipos que siempre deben declararse explícitamente

```typescript
// ✅ Siempre tipar los returns de métodos públicos
getOpenTrades(): Trade[] {
  return this.trades().filter(t => t.status === 'OPEN');
}

// ✅ Siempre tipar signals
readonly count = signal<number>(0);

// ❌ Prohibido
const result: any = this.api.get('/trades');
function process(data) { ... }
```

---

## Performance — ChangeDetection

```typescript
// ✅ OnPush + signals = zero overhead de CD
@Component({ changeDetection: ChangeDetectionStrategy.OnPush })
export class MyComponent {
  // Angular solo re-renderiza cuando un signal cambia
  readonly data = input<Trade[]>([]);
  readonly count = computed(() => this.data().length);
}

// ✅ trackBy en ngFor — obligatorio en listas
<tr *ngFor="let trade of trades(); trackBy: trackById">

trackById(index: number, trade: Trade): string {
  return trade.id;
}
```

---

## Manejo de Errores

### En services — no capturar prematuramente
```typescript
// ✅ Dejar que el error suba al componente/store
getAll(): Observable<Trade[]> {
  return this.http.get<Trade[]>('/api/trades');
  // NO catchError aquí — el interceptor o el store lo manejan
}
```

### En stores — capturar y exponer como estado
```typescript
loadAll(): void {
  this.api.getAll().subscribe({
    next:  data => this._items.set(data),
    error: err  => this._error.set(err.message) // nunca throw desde subscribe
  });
}
```

### En componentes — mostrar al usuario
```html
<app-alert
  *ngIf="store.error()"
  type="error"
  [message]="store.error()!"
  (closed)="store.clearError()"
/>
```

---

## Formularios — Siempre Reactivos

```typescript
// ✅ Reactive Forms con tipos explícitos
interface OrderForm {
  symbol:   string;
  quantity: number;
  price:    number | null;
}

this.form = this.fb.group<OrderForm>({
  symbol:   ['', [Validators.required]],
  quantity: [0,  [Validators.required, Validators.min(0.0001)]],
  price:    [null],
});

// Acceder con tipos
const symbol = this.form.get('symbol')!.value; // string
```

---

## HTTP — Buenas Prácticas

```typescript
// ✅ Siempre tipado el response
this.http.get<Trade[]>('/api/trades')

// ✅ Usar params tipados — no string manipulation
this.http.get<Trade[]>('/api/trades', {
  params: new HttpParams({ fromObject: { page: '0', limit: '25' } })
})

// ✅ finalize para quitar loading en cualquier caso
this.api.getAll().pipe(
  finalize(() => this._loading.set(false))
).subscribe(...)

// ❌ Nunca construir URLs con template strings no sanitizadas
`/api/trades/${userInput}`  // posible injection
// ✅ Usar HttpParams o encodeURIComponent
```

---

## Imports — Ordenados y Agrupados

```typescript
// 1. Angular core
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// 2. Angular Material / terceros
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

// 3. Core del proyecto
import { ApiClient } from '@core/http/api.client';

// 4. Features / shared del proyecto
import { DataTableComponent } from '@shared/components/data-table/data-table.component';

// 5. Locales (mismo feature)
import { Trade } from '../models/trade.model';
import { TradesStore } from '../store/trades.store';
```

---

## Accesibilidad Mínima

```html
<!-- Botones con aria-label cuando solo tienen ícono -->
<button mat-icon-button aria-label="Cancelar orden" (click)="cancel()">
  <mat-icon>close</mat-icon>
</button>

<!-- Tablas con caption -->
<table mat-table [dataSource]="trades()">
  <caption class="sr-only">Lista de órdenes activas</caption>
  ...
</table>

<!-- Imágenes siempre con alt -->
<img [src]="logo" alt="Logo del broker" />
```

---

## Convenciones de Nombrado

| Artefacto | Convención | Ejemplo |
|-----------|-----------|---------|
| Clase de componente | `PascalCase` + sufijo | `TradeListPageComponent` |
| Selector | `app-` + `kebab-case` | `app-trade-list` |
| Clase de service | `PascalCase` + sufijo | `TradesStore`, `TradesApiService` |
| Signal privado | `_camelCase` | `_trades`, `_loading` |
| Signal público | `camelCase` | `trades`, `loading` |
| Observable | `camelCase$` | `trades$`, `filters$` |
| Interface/Type | `PascalCase` | `Trade`, `TradeFilters` |
| Archivo | `kebab-case` + tipo | `trade-list.page.ts`, `trades.store.ts` |
