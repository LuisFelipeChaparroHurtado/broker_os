# Prompt: Generate Component

Usa este prompt para generar un componente Angular aislado — ya sea uno nuevo en `shared/`, uno específico de una feature, o una página.

---

## Cómo invocar

```
Genera un componente Angular para: "<DESCRIPCIÓN CORTA>"

## Contexto
Lee y aplica:
- claude/skills/angular-components.md     ← reglas base de componente
- claude/skills/angular-best-practices.md ← convenciones y tipos
- claude/context/ui-guidelines.md         ← design tokens y estados UI

## Tipo de componente
[ ] Page (Smart)       ← se conecta al router, inyecta services
[ ] Presentacional     ← solo inputs/outputs, sin services de negocio
[ ] Config-driven      ← recibe objeto de configuración

## Especificación

### Selector
app-<nombre-kebab-case>

### Ubicación
src/app/<shared/components | features/X/components | features/X/pages>/<nombre>/

### Inputs que recibe
- <nombre>: <Tipo>    — <descripción>
- <nombre>: <Tipo>    — <descripción>

### Outputs que emite
- <nombre>: <Tipo>    — <descripción>

### Comportamiento
<Describir qué hace el componente, qué muestra, cómo responde a eventos>

### Estado interno (si aplica)
<Variables locales de UI que necesita>

### Dependencias (solo para Page o si es imprescindible)
- <NombreService>

## Archivos a generar
- <nombre>.component.ts
- <nombre>.component.html
- <nombre>.component.scss
- <nombre>.component.spec.ts

## Reglas obligatorias
- standalone: true
- ChangeDetectionStrategy.OnPush
- Sin any — tipos explícitos
- input() / output() signals (no decoradores)
- SCSS con variables CSS del design system
- Genera código completo — no placeholders ni TODO
```

---

## Ejemplo 1 — Componente presentacional

```
Genera un componente Angular para: "Tarjeta de resumen de posición"

## Tipo: Presentacional

## Selector: app-position-card

## Ubicación: src/app/features/portfolio/components/position-card/

## Inputs
- position: Position     — datos de la posición a mostrar
- loading:  boolean      — mostrar skeleton cuando carga

## Outputs
- closePosition: Position — cuando el usuario hace click en "Cerrar"

## Comportamiento
Muestra en forma de tarjeta: símbolo, lado (LONG/SHORT), tamaño, precio de entrada, precio actual,
valor y P&L. El P&L debe ser verde si es positivo, rojo si es negativo.
Tiene un botón "Cerrar Posición" que emite el output closePosition.
Cuando loading=true, muestra un skeleton de tarjeta en lugar del contenido.

## Estado interno
Ninguno — es puramente presentacional.
```

---

## Ejemplo 2 — Componente config-driven (tabla)

```
Genera un componente Angular para: "Tabla dinámica de datos genérica"

## Tipo: Config-driven

## Selector: app-data-table

## Ubicación: src/app/shared/components/data-table/

## Inputs
- config:      TableConfig<T>  — configuración de columnas, acciones, paginación
- data:        T[]             — datos a mostrar
- loading:     boolean         — estado de carga
- totalItems:  number          — total para paginación

## Outputs
- rowAction:       { action: string; row: T }    — acción de fila
- pageChange:      { page: number; size: number } — cambio de página
- sortChange:      { column: string; direction: string }
- selectionChange: T[]

## Comportamiento
Ver claude/skills/dynamic-table.md para la especificación completa de TableConfig,
ColumnDef, RowAction y el template HTML.
```

---

## Checklist del output generado

- [ ] `standalone: true` con `imports` correctos
- [ ] `ChangeDetectionStrategy.OnPush`
- [ ] Ningún `any` — tipos en todos los parámetros y returns
- [ ] `input()` / `input.required()` / `output()` usados
- [ ] Template sin lógica compleja (computeds en .ts)
- [ ] SCSS usa solo variables CSS `var(--...)`
- [ ] `spec.ts` con al menos el test `should create`
- [ ] Subscriptions con `takeUntilDestroyed` si las hay
