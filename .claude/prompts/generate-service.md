# Prompt: Generate Service

Usa este prompt para generar un service Angular. Especifica el tipo para que el LLM aplique el patrón correcto.

---

## Cómo invocar

```
Genera un service Angular de tipo "<TIPO>" para: "<DESCRIPCIÓN>"

## Contexto
Lee y aplica:
- claude/skills/angular-services.md       ← patrones por tipo de service
- claude/skills/angular-state.md          ← signals y estado
- claude/context/api-contracts.md         ← contratos de API disponibles
- claude/skills/angular-best-practices.md ← convenciones TypeScript

## Tipo de service
[ ] API Service    ← solo HTTP, devuelve Observable, sin estado
[ ] Store Service  ← estado con signals, orquesta el API service
[ ] Domain Service ← lógica de negocio pura, sin HTTP ni estado
[ ] UI Service     ← estado de interfaz (modal, toast, loading global)

## Especificación

### Nombre de clase
<NOMBRE>Service  |  <NOMBRE>Store  |  <NOMBRE>ApiService

### Ubicación
src/app/<core | features/X/services | features/X/store>/

### Entidad que maneja
```typescript
interface <ENTIDAD> {
  // definir aquí
}
```

### Operaciones requeridas (para API Service)
- <método HTTP> <endpoint> → <tipo retorno>
- <método HTTP> <endpoint> → <tipo retorno>

### Estado que mantiene (para Store Service)
- <campo>: <Tipo>   — <descripción>
- <campo>: <Tipo>   — <descripción>

### Computed que expone (para Store Service)
- <nombre>: <Tipo>  — <descripción de la derivación>

### Acciones / métodos públicos
- <método>(<params>): <retorno>  — <descripción>

### Reglas de negocio (si aplica)
<Describir constraints, validaciones o comportamiento especial>

## Reglas obligatorias
- providedIn: 'root'
- Sin any — TypeScript estricto
- API Service: NUNCA hace subscribe, siempre devuelve Observable<T>
- Store Service: estado privado con signal(), selectores públicos con asReadonly()
- Un único método privado patch() para mutar el estado del store
- Optimistic updates cuando aplique, con rollback en error
```

---

## Ejemplo 1 — API Service

```
Genera un service Angular de tipo "API Service" para: "Gestión de trades"

## Nombre: TradesApiService
## Ubicación: src/app/features/trades/services/

## Entidad
interface Trade {
  id: string; symbol: string; side: 'BUY'|'SELL';
  orderType: 'MARKET'|'LIMIT'|'STOP_LIMIT';
  status: 'OPEN'|'CLOSED'|'CANCELLED';
  entryPrice: number; currentPrice: number;
  quantity: number; pnl: number; timestamp: string;
}

## Operaciones
- GET  /trades          → PaginatedResponse<Trade>  (acepta TradeFilters)
- GET  /trades/:id      → ApiResponse<Trade>
- POST /trades          → ApiResponse<Trade>         (body: CreateTradeDto)
- DELETE /trades/:id    → void
```

---

## Ejemplo 2 — Store Service

```
Genera un service Angular de tipo "Store Service" para: "Estado de trades"

## Nombre: TradesStore
## Ubicación: src/app/features/trades/store/

## Entidad: Trade (ver arriba)

## Dependencias: TradesApiService

## Estado
- items:   Trade[]      — lista de trades cargados
- total:   number       — total para paginación
- loading: boolean      — petición en curso
- error:   string|null  — mensaje de error o null
- filters: TradeFilters — filtros activos

## Computed
- openTrades:    Trade[]  — items donde status === 'OPEN'
- totalPnL:      number   — suma de pnl de todos los items
- isEmpty:       boolean  — items.length === 0 && !loading

## Acciones
- loadAll(filters?: TradeFilters): void    — carga paginada
- cancel(id: string): void                 — cancela con optimistic update
- updateFilters(f: Partial<TradeFilters>): void
- clearError(): void
- refresh(): void
```

---

## Ejemplo 3 — Domain Service

```
Genera un service Angular de tipo "Domain Service" para: "Cálculos de P&L y métricas de trades"

## Nombre: TradeCalculationsService
## Ubicación: src/app/features/trades/services/

## Métodos
- calculatePnL(trade: Trade): number
  → (currentPrice - entryPrice) * quantity si BUY
  → (entryPrice - currentPrice) * quantity si SELL

- calculatePnLPercent(trade: Trade): number
  → (pnl / (entryPrice * quantity)) * 100

- groupBySymbol(trades: Trade[]): Record<string, Trade[]>

- getSummary(trades: Trade[]): TradeSummary
  → { total, open, closed, cancelled, totalPnL, winRate }

- formatPnL(value: number): string
  → '+$1,234.56' | '-$234.56'
```

---

## Checklist del output generado

- [ ] `@Injectable({ providedIn: 'root' })`
- [ ] Sin `any` — todos los tipos explícitos
- [ ] **API Service**: solo `Observable<T>` — cero subscribes internos
- [ ] **Store**: `_estado` privado signal, selectores `.asReadonly()`
- [ ] **Store**: método `patch()` privado como único punto de mutación
- [ ] **Store**: `finalize()` en calls HTTP para quitar loading
- [ ] **Store**: optimistic update con rollback en cancel/delete
- [ ] **Domain**: sin `inject()`, sin HTTP — solo lógica pura y testeada
