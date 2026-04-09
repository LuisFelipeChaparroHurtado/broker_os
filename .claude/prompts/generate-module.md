# Prompt: Generate Module (Feature completa)

Usa este prompt cuando necesites generar una feature completa de Angular desde cero.

---

## Cómo invocar

Copia y pega el bloque de abajo, reemplazando los valores entre `< >`:

```
Genera una feature Angular completa para el módulo "<NOMBRE_FEATURE>".

## Contexto del proyecto
Lee y aplica:
- claude/context/project-overview.md      ← dominio y stack
- claude/context/api-contracts.md         ← endpoints disponibles
- claude/context/ui-guidelines.md         ← design tokens y patrones UI
- claude/skills/angular-architecture.md   ← estructura de carpetas
- claude/skills/angular-services.md       ← patrón API service + Store
- claude/skills/angular-state.md          ← signals y estado
- claude/skills/angular-components.md     ← reglas de componentes
- claude/skills/angular-best-practices.md ← convenciones y tipos

## Feature a generar
Nombre: <NOMBRE_FEATURE>
Descripción: <QUÉ HACE ESTA FEATURE>

## Entidad principal
```typescript
interface <ENTIDAD> {
  // pegar o describir la interfaz aquí
}
```

## Endpoints que usa
- GET  <ENDPOINT>  → lista paginada
- POST <ENDPOINT>  → crear
- DELETE <ENDPOINT>/:id → eliminar

## Pantallas requeridas
1. Lista: tabla con filtros, paginación y acciones por fila
2. Detalle: vista de un item (modal o página separada)
3. Formulario: crear/editar el item

## Archivos a generar (en orden)
1. `src/app/features/<nombre>/models/<nombre>.model.ts`
2. `src/app/features/<nombre>/services/<nombre>-api.service.ts`
3. `src/app/features/<nombre>/store/<nombre>.store.ts`
4. `src/app/features/<nombre>/pages/<nombre>-list/<nombre>-list.page.ts` + .html + .scss
5. `src/app/features/<nombre>/pages/<nombre>-list/<nombre>-list.page.spec.ts`
6. `src/app/features/<nombre>/<nombre>.routes.ts`

## Reglas obligatorias
- Todos los componentes: standalone: true + ChangeDetectionStrategy.OnPush
- Sin any — TypeScript estricto
- Inputs con input() signal, outputs con output()
- La tabla debe usar app-data-table de shared/components con TableConfig
- El formulario debe usar app-dynamic-form de shared/components con FormConfig
- Estados: loading, error, empty siempre implementados
- Genera código completo y funcional — no esqueletos vacíos
```

---

## Ejemplo de invocación real

```
Genera una feature Angular completa para el módulo "orders".

## Contexto del proyecto
[ver archivos arriba]

## Feature a generar
Nombre: orders
Descripción: Gestión de órdenes pendientes (limit y stop-limit). Permite ver, crear y cancelar órdenes que aún no se han ejecutado.

## Entidad principal
interface Order {
  id:        string;
  symbol:    string;
  side:      'BUY' | 'SELL';
  type:      'LIMIT' | 'STOP_LIMIT';
  price:     number;
  quantity:  number;
  status:    'PENDING' | 'TRIGGERED' | 'CANCELLED';
  createdAt: string;
}

## Endpoints que usa
- GET    /orders          → lista paginada (OrderFilters)
- POST   /orders          → crear (CreateOrderDto)
- DELETE /orders/:id      → cancelar

## Pantallas requeridas
1. Lista: tabla con símbolo, tipo, precio, cantidad, estado y botón cancelar
2. Formulario: modal para crear nueva orden (symbol, side, type, price, quantity)

## Archivos a generar
[listado completo arriba]
```

---

## Checklist de validación del output

Antes de aceptar el código generado, verificar:

- [ ] Todos los archivos listados están generados
- [ ] `standalone: true` en todos los componentes
- [ ] `ChangeDetectionStrategy.OnPush` en todos
- [ ] El store tiene `_state` privado y selectores públicos readonly
- [ ] El API service solo hace HTTP y devuelve `Observable<T>` — sin subscribe
- [ ] La tabla usa `TableConfig<Order>` con `app-data-table`
- [ ] El formulario usa `FormConfig<CreateOrderDto>` con `app-dynamic-form`
- [ ] Los 4 estados UI están implementados (loading, error, empty, data)
- [ ] Las rutas están en `orders.routes.ts` con lazy loading
