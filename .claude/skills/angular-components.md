# Skill: Angular Components

## Regla Base
Todo componente es `standalone: true` con `ChangeDetectionStrategy.OnPush`. Sin excepciones.

---

## Anatomía de un Componente

```typescript
@Component({
  selector: 'app-{{nombre}}',
  standalone: true,
  imports: [CommonModule, /* módulos AM/otros */],
  templateUrl: './{{nombre}}.component.html',
  styleUrl: './{{nombre}}.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class {{NOMBRE}}Component {
  // 1. Dependencias (inject en campo, no constructor)
  private readonly service  = inject({{NOMBRE}}Service);
  private readonly destroyRef = inject(DestroyRef);

  // 2. Inputs (API pública — signals)
  readonly data    = input.required<Trade[]>();
  readonly loading = input<boolean>(false);
  readonly config  = input<TableConfig>();

  // 3. Outputs
  readonly rowSelected = output<Trade>();
  readonly pageChange  = output<PageEvent>();

  // 4. Estado local (solo UI)
  readonly expanded = signal<boolean>(false);

  // 5. Computed (valores derivados — nunca calcular en template)
  readonly isEmpty    = computed(() => this.data().length === 0);
  readonly firstItem  = computed(() => this.data()[0] ?? null);

  // 6. Lifecycle con effects
  constructor() {
    effect(() => {
      // Reaccionar a cambios de signals
    });
  }

  // 7. Métodos públicos (handlers del template)
  onSelect(item: Trade): void {
    this.rowSelected.emit(item);
  }
}
```

---

## Tipos de Componentes y Cuándo Usar Cada Uno

### Page Component (Smart)
- Conectado al router (`loadComponent` en routes)
- Inyecta services y stores
- Pasa datos a sus hijos mediante `input()`
- **Nunca** tiene lógica de presentación — eso va en componentes hijos

```typescript
// trades/pages/trade-list/trade-list.page.ts
export class TradeListPageComponent {
  private readonly store = inject(TradesStore);

  // Expone signals del store directamente al template
  readonly trades  = this.store.trades;
  readonly loading = this.store.loading;
  readonly total   = this.store.total;

  constructor() {
    this.store.loadAll();
  }

  onRowAction(event: { action: string; row: Trade }): void {
    if (event.action === 'cancel') this.store.cancel(event.row.id);
    if (event.action === 'view')   this.router.navigate([event.row.id]);
  }
}
```

### Presentational Component (Dumb)
- Sin servicios de negocio
- Solo `input()` → renders → `output()`
- Vive en `shared/components/` si es genérico, o en `features/X/components/` si es específico

### Config-Driven Component
- Recibe un objeto de configuración tipado que lo describe completamente
- Patrón para tablas, formularios, dashboards configurables

---

## API de Inputs/Outputs — Siempre signals

```typescript
// ✅ Angular 17+ — signals API
readonly items   = input<Item[]>([]);          // con default
readonly label   = input.required<string>();   // requerido
readonly selected = output<Item>();

// ❌ Prohibido — API legacy
@Input() items: Item[] = [];
@Output() selected = new EventEmitter<Item>();
```

---

## Computed vs Template Logic

```html
<!-- ❌ Lógica en el template -->
<span>{{ data().filter(t => t.status === 'OPEN').length }} abiertos</span>

<!-- ✅ Computed en el .ts -->
```
```typescript
readonly openCount = computed(() =>
  this.data().filter(t => t.status === 'OPEN').length
);
```
```html
<span>{{ openCount() }} abiertos</span>
```

---

## Subscriptions — Siempre con cleanup

```typescript
constructor() {
  // ✅ takeUntilDestroyed usa DestroyRef internamente
  this.service.data$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(data => this.localData.set(data));
}
```

---

## SCSS — Variables siempre

```scss
:host { display: block; }   // Siempre declarar display

.mi-componente {
  background: var(--color-bg-surface);
  color: var(--color-text-primary);
  border: var(--stroke-thin) solid var(--color-border-subtle);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  font-family: var(--font-sans);
  // ❌ Nunca: background: #12100a; color: #fff; border-radius: 8px;
}

// Datos numéricos — siempre monospace
.price, .pnl, .quantity, .timestamp {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}
```

---

## Checklist de entrega

- [ ] `standalone: true`
- [ ] `ChangeDetectionStrategy.OnPush`
- [ ] Sin `any` — tipos explícitos en todo
- [ ] `input()` / `output()` signals, no decoradores legacy
- [ ] Subscriptions con `takeUntilDestroyed`
- [ ] Lógica compleja en `computed()`, no en el template
- [ ] SCSS con variables CSS, sin colores/tamaños hardcodeados
- [ ] Test básico de renderizado incluido
