# Context: UI Guidelines — BrokerOS Design System Final

## Principios de Diseño
1. **Dark first** — entorno de trading profesional, uso prolongado (`data-theme="dark"` por defecto)
2. **Densidad compacta** — máxima información visible sin scroll innecesario
3. **Datos monospace** — precios, cantidades, P&L, timestamps → siempre `var(--font-mono)`
4. **Color semántico** — verde = ganancia, rojo = pérdida, nunca invertir esto
5. **Estado siempre visible** — loading, error, empty — nunca dejar al usuario sin feedback

---

## Fuentes

```scss
--font-sans: 'Raleway', sans-serif;       // UI general: labels, títulos, botones
--font-mono: 'JetBrains Mono', monospace; // Datos: precios, P&L, cantidades, timestamps
```

Google Fonts: `Raleway:wght@300;400;600;700;800` · `JetBrains+Mono:wght@400;500;700`

---

## Design Tokens — Variables CSS Globales

```scss
:root {
  // ── Fondos ────────────────────────────────────────────
  --color-bg-page:      rgb(8, 7, 22);
  --color-bg-surface:   rgb(18, 15, 38);
  --color-bg-elevated:  rgba(100, 30, 210, 0.22);

  // ── Accent — Violeta (primario) ───────────────────────
  --color-accent-200:   #C4B0FF;
  --color-accent-400:   #6D28D9;
  --color-accent-500:   rgb(142, 49, 237);  // acción principal
  --color-accent-600:   #7C31C7;
  --color-accent-900:   rgba(142, 49, 237, 0.28);

  // ── Mint (secundario / datos positivos) ───────────────
  --color-mint-100:     #CFFFF4;
  --color-mint-200:     #9AFCE4;
  --color-mint-400:     #72FAD8;
  --color-mint-500:     #5CF7CB;  // brand mint — foco de inputs, active states
  --color-mint-700:     #1EDBA6;
  --color-mint-900:     rgba(92, 247, 203, 0.12);

  // ── Texto ─────────────────────────────────────────────
  --color-text-primary:   #FFFFFF;
  --color-text-secondary: rgba(240, 240, 252, 0.55);
  --color-text-muted:     rgba(240, 240, 252, 0.30);

  // ── Bordes ────────────────────────────────────────────
  --color-border-subtle:  rgba(255, 255, 255, 0.06);
  --color-border-strong:  rgba(255, 255, 255, 0.14);

  // ── Semánticos ────────────────────────────────────────
  --color-success:      #22C55E;
  --color-success-bg:   rgba(34, 197, 94, 0.10);
  --color-danger:       #EF4444;
  --color-danger-bg:    rgba(239, 68, 68, 0.10);
  --color-warning:      #F59E0B;
  --color-warning-bg:   rgba(245, 158, 11, 0.10);
  --color-info:         #38BDF8;
  --color-info-bg:      rgba(56, 189, 248, 0.10);

  // ── Espaciado ─────────────────────────────────────────
  --space-1:   4px;
  --space-2:   8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-6:  24px;
  --space-8:  32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-24: 96px;

  // ── Sombras ───────────────────────────────────────────
  --shadow-xs: 0 1px 3px rgba(0, 0, 0, 0.50);
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.60);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.70);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.75);
  --shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.85);

  // ── Border Radius ─────────────────────────────────────
  --radius-none: 0px;
  --radius-xs:   4px;
  --radius-sm:   6px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-xl:   16px;
  --radius-full: 9999px;

  // ── Stroke / Border Width ─────────────────────────────
  --stroke-thin:   1px;
  --stroke-base:   1.5px;
  --stroke-medium: 2px;
  --stroke-thick:  3px;

  // ── Transiciones ──────────────────────────────────────
  --transition-fast:   100ms ease;
  --transition-normal: 200ms ease;
  --transition-slow:   350ms ease;
}
```

### Light Mode — Overrides clave
```scss
[data-theme="light"] {
  --color-bg-page:        #EEF0F5;
  --color-bg-surface:     #F6F7FA;
  --color-text-primary:   #1A1D2E;
  --color-text-secondary: #4A4D62;
  --color-text-muted:     #7C7E90;
  --color-accent-400:     #7C13B0;   // morado (8.2:1 on white)
  --color-accent-500:     #6B0F98;
  --color-mint-700:       #0A7A55;   // verde tormenta (5.7:1 on white)
}
// En light mode: botones primarios → background sólido #7C13B0 (sin gradiente)
// En light mode: focus ring → 0 0 0 3px rgba(124,19,176,0.12) (violeta)
```

---

## Gradientes del Sistema

### Primarios — CTA y acciones
```scss
// Botón primario (dark mode)
background: linear-gradient(135deg, #7C31C7 0%, #6D28D9 100%);
box-shadow: 0 4px 20px rgba(124,49,199,0.45);

// Botón primario hover (dark mode)
background: linear-gradient(135deg, #8E31ED 0%, #7C31C7 100%);
box-shadow: 0 6px 28px rgba(142,49,237,0.55);

// CTA secundario (Mint)
background: linear-gradient(135deg, #5CF7CB 0%, #1EDBA6 100%);
// Texto: rgb(5,4,14) — oscuro para contraste

// Signature Gradient — identidad de marca Broker OS
background: linear-gradient(135deg, rgb(142,49,237) 0%, #1EDBA6 100%);
box-shadow: 0 4px 16px rgba(142,49,237,0.30), 0 4px 16px rgba(92,247,203,0.20);
// Uso: logo, FAB del chat, elementos de identidad
```

### Estructurales — Fondos
```scss
// Fondo de página (dark)
background: linear-gradient(160deg, rgb(10,8,28) 0%, rgb(5,4,14) 60%, rgb(2,1,8) 100%);
background-attachment: fixed;

// Sidebar (dark)
background: linear-gradient(180deg, rgb(10,8,28) 0%, rgb(5,4,14) 100%);
border-right: 1px solid rgba(92,247,203,0.09);

// Item activo sidebar/selección
background: linear-gradient(90deg, rgba(142,49,237,0.10) 0%, rgba(92,247,203,0.05) 100%);
border-left: 3px solid #5CF7CB;

// Divisor de sección
background: linear-gradient(90deg, rgba(92,247,203,0.25) 0%, rgba(142,49,237,0.15) 50%, transparent 100%);

// Fondo de página (light)
background: linear-gradient(160deg, #E8EBF2 0%, #EEF0F5 55%, #F2F4F9 100%);

// Sidebar (light)
background: linear-gradient(180deg, #E2E6EF 0%, #D9DEE9 100%);
```

### Decorativos — Cards y superficies
```scss
// Card estándar (dark)
background: linear-gradient(135deg, rgb(18,15,38) 0%, rgba(75,20,180,0.22) 100%);
border: 1px solid rgba(92,247,203,0.10);

// Card hover glow
border-color: rgba(92,247,203,0.30);
box-shadow: 0 8px 32px rgba(92,247,203,0.07);
transform: translateY(-2px);

// Elevated glow / hero sections
background: radial-gradient(ellipse at 50% 120%, rgba(92,247,203,0.12) 0%, rgba(142,49,237,0.10) 60%, transparent 80%);

// Progress bar
background: linear-gradient(90deg, #7C31C7 0%, #6D28D9 100%);

// Spacing bar visual
background: linear-gradient(90deg, #7C31C7 0%, #6D28D9 100%);
```

---

## Tipografía — Escala Completa

### Sans (Raleway) — Texto de UI
| Rol | Tamaño | Peso | Line-height | Notas |
|-----|--------|------|-------------|-------|
| Display XL | 40px | 300 Light | 1.1 | `letter-spacing: -0.02em` |
| Heading 1 | 28px | 600 SemiBold | 1.2 | `letter-spacing: -0.01em` |
| Heading 2 | 22px | 600 SemiBold | 1.25 | `letter-spacing: -0.005em` |
| Heading 3 | 18px | 600 SemiBold | 1.3 | — |
| Heading 4 | 15px | 600 SemiBold | 1.4 | — |
| Body MD | 14px | 400 Regular | 1.6 | texto principal |
| Body SM | 13px | 400 Regular | 1.55 | texto secundario |
| Caption | 11px | 500 Medium | 1.4 | `letter-spacing: 0.06em` |
| Overline | 10px | 600 SemiBold | 1.4 | UPPERCASE · `letter-spacing: 0.12em` |

### Mono (JetBrains Mono) — Datos numéricos
| Rol | Tamaño | Peso | Uso |
|-----|--------|------|-----|
| Data LG | 24px | 700 Bold | Precio principal · `letter-spacing: -0.01em` |
| Data MD | 16px | 600 SemiBold | P&L, valores importantes |
| Data SM | 13px | 500 Medium | Pares, volumen, porcentajes |
| Inline | ~0.92em | — | `.mono-num` · `font-variant-numeric: tabular-nums` |

```scss
// REGLA: SIEMPRE monospace para cualquier dato numérico
.price, .quantity, .pnl, .timestamp, .mono-num {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}
```

---

## Componentes — CSS Completo

> Todos los estilos `.ds-*` están definidos en el Design System. Copiar estas clases directamente.

### Inputs & Forms

```scss
// Campo base
.ds-field    { display: flex; flex-direction: column; gap: 6px; }
.ds-label    { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-muted); }
.ds-helper   { font-size: 11px; color: var(--color-text-muted); font-family: var(--font-mono); }
.ds-error-text { font-size: 11px; color: #EF4444; font-family: var(--font-mono); }

// Input
.ds-input {
  background: rgba(8,7,22,0.7);
  border: 1.5px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  font-size: 14px;
  padding: 10px 14px;
  width: 220px;
  outline: none;
  transition: border-color .15s, box-shadow .15s;
}
.ds-input::placeholder { color: var(--color-text-muted); }

// ⚠️ IMPORTANTE: En dark mode, el focus usa MINT (#5CF7CB), no violeta
.ds-input:focus, .ds-input--focus {
  border-color: #5CF7CB;
  box-shadow: 0 0 0 3px rgba(92,247,203,0.14);
}
.ds-input--error   { border-color: #EF4444 !important; box-shadow: 0 0 0 3px rgba(239,68,68,0.12) !important; }
.ds-input--success { border-color: #22C55E !important; box-shadow: 0 0 0 3px rgba(34,197,94,0.12) !important; }
.ds-input--disabled { opacity: .40; cursor: not-allowed; pointer-events: none; }
.ds-input--sm { padding: 7px 12px; font-size: 13px; width: 180px; }
.ds-input--lg { padding: 13px 16px; font-size: 15px; width: 260px; }

// Input con icono
.ds-input-wrapper    { position: relative; display: inline-flex; align-items: center; }
.ds-input-icon-left  { position: absolute; left: 12px; color: var(--color-text-muted); pointer-events: none; }
.ds-input-icon-right { position: absolute; right: 12px; color: var(--color-text-muted); pointer-events: none; }
// Con icono izquierdo: agregar padding-left: 40px al .ds-input
// Con icono derecho: agregar clase .ds-input--icon-right (padding-left: 14px, padding-right: 40px)

// Textarea
.ds-textarea {
  background: rgba(8,7,22,0.7);
  border: 1.5px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  font-size: 14px;
  padding: 10px 14px;
  width: 300px;
  min-height: 100px;
  resize: vertical;
  line-height: 1.6;
}
.ds-textarea:focus, .ds-textarea--focus { border-color: #5CF7CB; box-shadow: 0 0 0 3px rgba(92,247,203,0.14); }
.ds-char-counter { font-size: 11px; font-family: var(--font-mono); color: var(--color-text-muted); text-align: right; width: 300px; }

// Select
.ds-select-wrapper { position: relative; display: inline-flex; align-items: center; width: 220px; }
.ds-select {
  appearance: none;
  background: rgba(8,7,22,0.7);
  border: 1.5px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  font-size: 14px;
  padding: 10px 38px 10px 14px;
  width: 100%;
}
.ds-select:focus { border-color: #5CF7CB; box-shadow: 0 0 0 3px rgba(92,247,203,0.14); }
.ds-select-chevron { position: absolute; right: 12px; color: var(--color-text-muted); pointer-events: none; }

// Dropdown panel
.ds-dropdown-panel  { background: rgb(18,15,38); border: 1px solid rgba(92,247,203,0.18); border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); width: 220px; overflow: hidden; }
.ds-dropdown-item   { padding: 10px 14px; font-size: 13px; color: var(--color-text-secondary); transition: background .1s, color .1s; }
.ds-dropdown-item:hover, .ds-dropdown-item--hover { background: rgba(92,247,203,0.06); color: #fff; }
.ds-dropdown-item--active { color: #5CF7CB; background: rgba(92,247,203,0.10); font-weight: 600; }

// Multi-select
.ds-multi-input { background: rgba(8,7,22,0.7); border: 1.5px solid var(--color-border-strong); border-radius: var(--radius-md); padding: 6px 10px; width: 300px; display: flex; flex-wrap: wrap; gap: 6px; min-height: 44px; }
.ds-multi-input--focus { border-color: #5CF7CB; box-shadow: 0 0 0 3px rgba(92,247,203,0.14); }
.ds-multi-chip { background: rgba(92,247,203,0.12); color: #5CF7CB; border: 1px solid rgba(92,247,203,0.25); border-radius: var(--radius-full); padding: 3px 8px 3px 10px; font-size: 12px; font-weight: 600; }
.ds-multi-chip-x { cursor: pointer; opacity: .7; font-size: 10px; }

// Checkbox
.ds-checkbox-box { width: 18px; height: 18px; border-radius: 4px; border: 1.5px solid var(--color-border-strong); background: rgba(8,7,22,0.7); }
.ds-checkbox-box--checked      { background: linear-gradient(135deg, #7C31C7 0%, #6D28D9 100%); border-color: transparent; }
.ds-checkbox-box--indeterminate { background: rgba(92,247,203,0.15); border-color: #5CF7CB; }
.ds-checkbox-label { font-size: 14px; color: var(--color-text-secondary); }

// Radio
.ds-radio-circle { width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid var(--color-border-strong); background: rgba(8,7,22,0.7); }
.ds-radio-circle--selected { border-color: #5CF7CB; background: rgba(92,247,203,0.08); }
.ds-radio-dot   { width: 8px; height: 8px; border-radius: 50%; background: #5CF7CB; }
.ds-radio-label { font-size: 14px; color: var(--color-text-secondary); }

// Switch
.ds-switch-track        { width: 44px; height: 24px; border-radius: 12px; background: rgba(255,255,255,0.12); position: relative; transition: background .2s; }
.ds-switch-track--on    { background: linear-gradient(90deg, #7C31C7 0%, #6D28D9 100%); }
.ds-switch-thumb        { width: 18px; height: 18px; border-radius: 50%; background: #fff; position: absolute; top: 3px; left: 3px; transition: transform .2s; box-shadow: 0 1px 4px rgba(0,0,0,.4); }
.ds-switch-track--on .ds-switch-thumb { transform: translateX(20px); }
// Small variant: .ds-switch-track--sm (34×18px, thumb 13×13px, translateX(16px))

// Slider
.ds-slider { -webkit-appearance: none; width: 100%; height: 4px; border-radius: 2px; background: rgba(255,255,255,0.12); }
.ds-slider::-webkit-slider-thumb { width: 18px; height: 18px; border-radius: 50%; background: linear-gradient(135deg,#7C31C7 0%,#6D28D9 100%); box-shadow: 0 0 8px rgba(124,49,199,0.60); }
.ds-slider-value { font-family: var(--font-mono); font-size: 13px; font-weight: 700; color: #5CF7CB; text-align: center; }

// Date Picker
.ds-datepicker { background: rgb(18,15,38); border: 1px solid rgba(92,247,203,0.18); border-radius: var(--radius-xl); padding: var(--space-4); width: 280px; box-shadow: var(--shadow-lg); }
.ds-datepicker-day--today    { color: #5CF7CB; font-weight: 700; }
.ds-datepicker-day--selected { background: linear-gradient(135deg,#7C31C7 0%,#6D28D9 100%); color: #fff; font-weight: 700; }
.ds-datepicker-day:hover     { background: rgba(92,247,203,0.08); color: #fff; }

// File Upload
.ds-file-zone { border: 2px dashed rgba(92,247,203,0.25); border-radius: var(--radius-xl); padding: var(--space-8); width: 300px; }
.ds-file-zone:hover, .ds-file-zone--hover { border-color: rgba(92,247,203,0.55); background: rgba(92,247,203,0.04); }
.ds-file-zone--active { border-color: #5CF7CB; background: rgba(92,247,203,0.08); }
.ds-file-icon { width: 44px; height: 44px; border-radius: var(--radius-lg); background: rgba(92,247,203,0.10); }
.ds-file-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: rgba(92,247,203,0.06); border: 1px solid rgba(92,247,203,0.15); border-radius: var(--radius-md); }

// Autocomplete
.ds-autocomplete-panel { background: rgb(18,15,38); border: 1px solid rgba(92,247,203,0.18); border-radius: 0 0 var(--radius-lg) var(--radius-lg); border-top: none; width: 260px; box-shadow: var(--shadow-md); }
.ds-autocomplete-item:hover, .ds-autocomplete-item--active { background: rgba(92,247,203,0.06); color: #fff; }
.ds-autocomplete-match { color: #5CF7CB; font-weight: 700; }
```

### Botones

```scss
.ds-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  border: none; border-radius: var(--radius-md);
  font-family: var(--font-sans); font-weight: 600; font-size: 14px;
  padding: 10px 20px; cursor: pointer;
  transition: box-shadow .2s, transform .15s, opacity .15s;
  white-space: nowrap; letter-spacing: 0.01em; line-height: 1;
}

// Variantes
.ds-btn--primary {
  background: linear-gradient(135deg, #7C31C7 0%, #6D28D9 100%);
  color: #fff;
  box-shadow: 0 3px 14px rgba(124,49,199,0.50), inset 0 1px 0 rgba(255,255,255,0.18);
}
.ds-btn--primary:hover {
  background: linear-gradient(135deg, #8E31ED 0%, #7C31C7 100%);
  box-shadow: 0 5px 22px rgba(142,49,237,0.65), inset 0 1px 0 rgba(255,255,255,0.22);
  transform: translateY(-1px);
}
.ds-btn--secondary { background: #fff; color: rgb(142,49,237); border: 1.5px solid rgba(142,49,237,0.50); }
.ds-btn--secondary:hover { background: #FAF7FF; border-color: rgb(142,49,237); }
.ds-btn--ghost   { background: #fff; color: rgba(8,7,22,0.60); border: 1.5px solid rgba(8,7,22,0.14); }
.ds-btn--danger  { background: #fff; color: #DC2626; border: 1.5px solid rgba(220,38,38,0.40); }
.ds-btn--mint    { background: #fff; color: #1EDBA6; border: 1.5px solid rgba(30,219,166,0.45); }
.ds-btn--mint:hover { background: #F0FFFB; border-color: #1EDBA6; }

// Tamaños
.ds-btn--sm { padding: 7px 14px; font-size: 12px; border-radius: var(--radius-sm); }
.ds-btn--lg { padding: 13px 28px; font-size: 15px; border-radius: var(--radius-lg); }

// Estados
.ds-btn:disabled, .ds-btn--disabled { opacity: .38; cursor: not-allowed; pointer-events: none; }
.ds-btn--loading { pointer-events: none; opacity: .75; }

// Icono
.ds-btn--icon       { padding: 10px; width: 40px; height: 40px; }
.ds-btn--icon-round { border-radius: 50%; }

// FAB
.ds-btn--fab {
  width: 56px; height: 56px; border-radius: 50%; padding: 0;
  background: linear-gradient(135deg, #7C31C7 0%, #6D28D9 100%);
  color: #fff; font-size: 22px;
  box-shadow: 0 4px 20px rgba(124,49,199,0.55), 0 8px 24px rgba(0,0,0,0.30);
}
.ds-btn--fab:hover {
  background: linear-gradient(135deg, #8E31ED 0%, #7C31C7 100%);
  box-shadow: 0 6px 28px rgba(142,49,237,0.65);
  transform: translateY(-2px) scale(1.04);
}
.ds-btn--fab-sm { width: 40px; height: 40px; font-size: 16px; }
.ds-btn--fab-lg { width: 68px; height: 68px; font-size: 26px; }

// Spinner (dentro de botón cargando)
.ds-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.30); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
```

### Links y Menús

```scss
.ds-link       { color: #5CF7CB; text-decoration: none; font-size: 14px; border-bottom: 1px solid transparent; transition: border-color .15s; }
.ds-link:hover { border-bottom-color: #5CF7CB; opacity: .85; }
.ds-link--muted       { color: var(--color-text-secondary); }
.ds-link--muted:hover { color: #5CF7CB; border-bottom-color: #5CF7CB; }

.ds-menu       { background: rgb(18,15,38); border: 1px solid rgba(92,247,203,0.18); border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); width: 200px; padding: 4px 0; }
.ds-menu-item  { display: flex; align-items: center; gap: 10px; padding: 9px 14px; font-size: 13px; color: var(--color-text-secondary); }
.ds-menu-item:hover, .ds-menu-item--hover { background: rgba(92,247,203,0.06); color: #fff; }
.ds-menu-item--active  { color: #5CF7CB; background: rgba(92,247,203,0.08); }
.ds-menu-item--danger:hover { background: rgba(239,68,68,0.08); color: #F87171; }
.ds-menu-divider { height: 1px; background: var(--color-border-subtle); margin: 4px 0; }
.ds-menu-label   { font-size: 10px; font-weight: 700; letter-spacing: 0.10em; text-transform: uppercase; color: var(--color-text-muted); padding: 8px 14px 4px; }
```

### Navegación

```scss
// Navbar
.ds-navbar      { background: rgb(10,8,28); border-bottom: 1px solid rgba(92,247,203,0.09); padding: 0 var(--space-6); display: flex; align-items: center; height: 56px; gap: var(--space-6); }
.ds-navbar-item { padding: 6px 12px; font-size: 13px; color: var(--color-text-secondary); border-radius: var(--radius-sm); }
.ds-navbar-item:hover  { color: #fff; background: rgba(255,255,255,0.05); }
.ds-navbar-item.active { color: #5CF7CB; background: rgba(92,247,203,0.08); font-weight: 600; }
.ds-navbar-body { background: rgb(14,12,30); border: 1px solid rgba(92,247,203,0.08); border-top: none; border-radius: 0 0 var(--radius-lg) var(--radius-lg); padding: var(--space-6); }

// Tabs — Underline
.ds-tabs     { display: flex; border-bottom: 1px solid var(--color-border-subtle); }
.ds-tab      { padding: 10px 18px; font-size: 13px; color: var(--color-text-muted); border: none; border-bottom: 2px solid transparent; background: none; margin-bottom: -1px; transition: color .15s, border-color .15s; }
.ds-tab:hover { color: var(--color-text-secondary); }
.ds-tab.active { color: #5CF7CB; border-bottom-color: #5CF7CB; font-weight: 600; }
.ds-tab-badge  { background: rgba(92,247,203,0.15); color: #5CF7CB; font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: var(--radius-full); margin-left: 6px; }

// Tabs — Pill
.ds-tabs--pill { border-bottom: none; background: rgba(8,7,22,0.6); padding: 4px; border-radius: var(--radius-full); gap: 2px; }
.ds-tabs--pill .ds-tab { border-radius: var(--radius-full); border-bottom: none; margin-bottom: 0; padding: 7px 16px; color: rgba(240,240,252,0.55); }
.ds-tabs--pill .ds-tab.active { background: linear-gradient(135deg,#7C31C7 0%,#6D28D9 100%); color: #fff; font-weight: 700; box-shadow: 0 2px 10px rgba(124,49,199,0.45); }

// Breadcrumbs
.ds-breadcrumb-item         { font-size: 13px; color: var(--color-text-muted); cursor: pointer; transition: color .15s; }
.ds-breadcrumb-item:hover   { color: #5CF7CB; }
.ds-breadcrumb-current      { font-size: 13px; color: var(--color-text-secondary); font-weight: 500; }
.ds-breadcrumb-sep          { font-size: 12px; color: var(--color-text-muted); opacity: .4; }

// Pagination
.ds-page-btn        { width: 36px; height: 36px; border-radius: var(--radius-md); background: none; border: 1px solid var(--color-border-subtle); color: var(--color-text-secondary); font-family: var(--font-mono); font-size: 13px; }
.ds-page-btn:hover  { border-color: rgba(92,247,203,0.35); color: #fff; }
.ds-page-btn.active { background: linear-gradient(135deg,#7C31C7 0%,#6D28D9 100%); color: #fff; border-color: transparent; font-weight: 700; box-shadow: 0 2px 10px rgba(124,49,199,0.45); }
.ds-page-btn:disabled { opacity: .35; cursor: not-allowed; }

// Stepper
.ds-step-circle    { width: 36px; height: 36px; border-radius: 50%; border: 2px solid var(--color-border-strong); background: rgba(8,7,22,0.8); font-family: var(--font-mono); font-size: 13px; font-weight: 700; color: var(--color-text-muted); }
.ds-step--completed .ds-step-circle { background: rgba(92,247,203,0.15); border-color: #5CF7CB; color: #5CF7CB; }
.ds-step--active .ds-step-circle    { background: linear-gradient(135deg,#7C31C7 0%,#6D28D9 100%); border-color: transparent; color: #fff; box-shadow: 0 0 16px rgba(124,49,199,0.55); }
.ds-step-label         { font-size: 11px; font-weight: 600; color: var(--color-text-muted); margin-top: 8px; }
.ds-step--active .ds-step-label { color: #5CF7CB; }
.ds-step-connector { height: 1px; background: var(--color-border-subtle); }
.ds-step--completed .ds-step-connector, .ds-step--active .ds-step-connector { background: rgba(92,247,203,0.4); }
```

### Feedback

```scss
// Alerts
.ds-alert           { display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; border-radius: var(--radius-lg); border: 1px solid transparent; font-size: 13px; max-width: 480px; }
.ds-alert--success  { background: rgba(34,197,94,0.08);   border-color: rgba(34,197,94,0.25);  color: #4ADE80; }
.ds-alert--error    { background: rgba(239,68,68,0.08);   border-color: rgba(239,68,68,0.25);  color: #F87171; }
.ds-alert--warning  { background: rgba(245,158,11,0.08);  border-color: rgba(245,158,11,0.25); color: #FBBF24; }
.ds-alert--info     { background: rgba(56,189,248,0.08);  border-color: rgba(56,189,248,0.25); color: #60A5FA; }
.ds-alert--mint     { background: rgba(92,247,203,0.08);  border-color: rgba(92,247,203,0.25); color: #5CF7CB; }
.ds-alert-title     { font-weight: 700; font-size: 13px; margin-bottom: 3px; }
.ds-alert-text      { color: rgba(255,255,255,0.55); font-size: 12px; }

// Toasts
.ds-toast        { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: var(--radius-lg); background: rgb(24,20,50); border: 1px solid rgba(92,247,203,0.14); box-shadow: var(--shadow-lg); min-width: 300px; max-width: 380px; }
.ds-toast-dot--success { background: #22C55E; box-shadow: 0 0 8px rgba(34,197,94,0.5); }
.ds-toast-dot--error   { background: #EF4444; box-shadow: 0 0 8px rgba(239,68,68,0.5); }
.ds-toast-dot--info    { background: #38BDF8; box-shadow: 0 0 8px rgba(56,189,248,0.5); }
.ds-toast-dot--mint    { background: #5CF7CB; box-shadow: 0 0 8px rgba(92,247,203,0.5); }
.ds-toast-title { font-weight: 600; color: #fff; margin-bottom: 2px; }
.ds-toast-sub   { color: var(--color-text-muted); font-size: 12px; font-family: var(--font-mono); }

// Modal
.ds-modal-preview { background: rgb(14,12,30); border: 1px solid rgba(92,247,203,0.14); border-radius: var(--radius-xl); width: 420px; overflow: hidden; box-shadow: var(--shadow-xl); }
.ds-modal-header  { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 0; }
.ds-modal-title   { font-size: 18px; font-weight: 600; color: #fff; letter-spacing: -0.005em; }
.ds-modal-close   { width: 28px; height: 28px; border-radius: 50%; background: rgba(255,255,255,0.08); border: none; color: var(--color-text-muted); }
.ds-modal-body    { padding: 16px 24px 20px; font-size: 14px; color: var(--color-text-secondary); line-height: 1.6; }
.ds-modal-footer  { padding: 0 24px 20px; display: flex; justify-content: flex-end; gap: 10px; }

// Popover / Tooltip
.ds-popover  { background: rgb(22,18,44); border: 1px solid rgba(92,247,203,0.18); border-radius: var(--radius-lg); padding: 12px 16px; font-size: 13px; color: var(--color-text-secondary); box-shadow: var(--shadow-md); max-width: 240px; line-height: 1.55; }
.ds-tooltip  { background: rgb(14,12,30); border: 1px solid rgba(92,247,203,0.14); border-radius: var(--radius-sm); padding: 6px 10px; font-size: 12px; color: var(--color-text-secondary); white-space: nowrap; }

// Progress Bar
.ds-progress-track      { height: 6px; background: rgba(255,255,255,0.08); border-radius: var(--radius-full); overflow: hidden; }
.ds-progress-fill       { height: 100%; border-radius: var(--radius-full); background: linear-gradient(90deg,#7C31C7 0%,#6D28D9 100%); transition: width .3s ease; }
.ds-progress-track--sm  { height: 4px; } // también aplica a .ds-progress-fill dentro
.ds-progress-track--lg  { height: 10px; }
.ds-progress-pct        { font-family: var(--font-mono); font-size: 12px; font-weight: 700; color: #5CF7CB; }
.ds-progress-indeterminate .ds-progress-fill { width: 40% !important; animation: indeterminate 1.4s ease infinite; }

// Skeleton
.ds-skeleton      { border-radius: var(--radius-md); background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(92,247,203,0.06) 50%, rgba(255,255,255,0.04) 75%); background-size: 200% 100%; animation: shimmer 1.6s infinite; }
.ds-skeleton-card { background: rgb(18,15,38); border: 1px solid rgba(92,247,203,0.06); border-radius: var(--radius-xl); padding: var(--space-6); }

// Empty State
.ds-empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: var(--space-12) var(--space-8); gap: var(--space-4); }
.ds-empty-icon  { width: 56px; height: 56px; border-radius: var(--radius-xl); background: rgba(92,247,203,0.08); border: 1px solid rgba(92,247,203,0.15); font-size: 24px; }
.ds-empty-title { font-size: 16px; font-weight: 600; color: #fff; }
.ds-empty-text  { font-size: 13px; color: var(--color-text-muted); max-width: 260px; line-height: 1.6; }
```

### Data Display

```scss
// Tabla
.ds-table-wrapper { background: rgb(14,12,30); border: 1px solid rgba(92,247,203,0.08); border-radius: var(--radius-xl); overflow: hidden; }
.ds-table-header  { display: flex; align-items: center; justify-content: space-between; padding: 16px 18px; border-bottom: 1px solid rgba(92,247,203,0.08); }
.ds-table-title   { font-size: 14px; font-weight: 600; color: #fff; }
.ds-table th { font-size: 10px; font-weight: 700; letter-spacing: 0.10em; text-transform: uppercase; color: var(--color-text-muted); padding: 10px 14px; border-bottom: 1px solid var(--color-border-subtle); cursor: pointer; user-select: none; }
.ds-table td { font-size: 13px; color: var(--color-text-secondary); padding: 11px 14px; border-bottom: 1px solid rgba(255,255,255,0.04); }
.ds-table tr:hover td { background: rgba(92,247,203,0.03); color: #fff; }
.ds-table th.sort-asc::after  { content: ' ↑'; color: #5CF7CB; }
.ds-table th.sort-desc::after { content: ' ↓'; color: #5CF7CB; }

// Helpers de celda — CRÍTICO para trading
.ds-td-mono     { font-family: var(--font-mono); font-size: 13px; }
.ds-td-positive { color: #22C55E; font-family: var(--font-mono); font-weight: 600; } // P&L positivo
.ds-td-negative { color: #EF4444; font-family: var(--font-mono); font-weight: 600; } // P&L negativo
.ds-td-mint     { color: #5CF7CB; font-family: var(--font-mono); font-weight: 600; } // valor destacado

// Badges inline (en tablas)
.ds-badge-sm      { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: var(--radius-full); font-size: 10px; font-weight: 700; letter-spacing: 0.06em; }
.ds-badge-buy     { background: rgba(34,197,94,0.12);  color: #22C55E; }   // BUY
.ds-badge-sell    { background: rgba(239,68,68,0.12);  color: #EF4444; }   // SELL
.ds-badge-pending { background: rgba(245,158,11,0.12); color: #F59E0B; }   // PENDING
.ds-badge-active  { background: rgba(92,247,203,0.12); color: #5CF7CB; }   // OPEN/ACTIVE

// Lista
.ds-list      { background: rgb(14,12,30); border: 1px solid rgba(92,247,203,0.08); border-radius: var(--radius-xl); overflow: hidden; }
.ds-list-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.04); cursor: pointer; transition: background .12s; }
.ds-list-item:hover { background: rgba(92,247,203,0.04); }
.ds-list-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg,#7C31C7 0%,#6D28D9 100%); }
.ds-list-name   { font-size: 13px; font-weight: 600; color: #fff; }
.ds-list-sub    { font-size: 11px; color: var(--color-text-muted); font-family: var(--font-mono); }
.ds-list-value  { font-family: var(--font-mono); font-size: 13px; font-weight: 700; text-align: right; }

// Card de estadísticas
.ds-card       { background: linear-gradient(135deg, rgb(18,15,38) 0%, rgba(75,20,180,0.22) 100%); border: 1px solid rgba(92,247,203,0.10); border-radius: var(--radius-xl); padding: var(--space-6); transition: border-color .2s, box-shadow .2s, transform .18s; }
.ds-card:hover { border-color: rgba(92,247,203,0.30); box-shadow: 0 8px 32px rgba(92,247,203,0.07); transform: translateY(-2px); }
.ds-card-stat-label         { font-size: 10px; font-weight: 700; letter-spacing: 0.10em; text-transform: uppercase; color: var(--color-text-muted); }
.ds-card-stat-value         { font-family: var(--font-mono); font-size: 24px; font-weight: 700; color: #fff; letter-spacing: -0.01em; }
.ds-card-stat-change--pos   { color: #22C55E; font-family: var(--font-mono); font-size: 12px; font-weight: 600; }
.ds-card-stat-change--neg   { color: #EF4444; font-family: var(--font-mono); font-size: 12px; font-weight: 600; }
.ds-card-stat-change--mint  { color: #5CF7CB; font-family: var(--font-mono); font-size: 12px; font-weight: 600; }

// Accordion
.ds-accordion          { background: rgb(14,12,30); border: 1px solid rgba(92,247,203,0.08); border-radius: var(--radius-xl); overflow: hidden; }
.ds-accordion-trigger  { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 15px 20px; background: none; border: none; font-size: 14px; font-weight: 600; color: var(--color-text-secondary); }
.ds-accordion-trigger:hover  { color: #fff; background: rgba(92,247,203,0.03); }
.ds-accordion-trigger.open   { color: #5CF7CB; }
.ds-accordion-icon     { transition: transform .22s ease; }
.ds-accordion-trigger.open .ds-accordion-icon { transform: rotate(180deg); color: #5CF7CB; }
.ds-accordion-body     { max-height: 0; overflow: hidden; transition: max-height .28s ease-out; }
.ds-accordion-body.open { max-height: 300px; }
.ds-accordion-content  { padding: 0 20px 16px; font-size: 13px; color: var(--color-text-muted); line-height: 1.65; }

// Tags & Chips
.ds-tag           { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: var(--radius-full); font-size: 12px; font-weight: 600; letter-spacing: 0.04em; }
.ds-tag--default  { background: rgba(255,255,255,0.08);  color: var(--color-text-secondary); border: 1px solid rgba(255,255,255,0.10); }
.ds-tag--mint     { background: rgba(92,247,203,0.12);   color: #5CF7CB;  border: 1px solid rgba(92,247,203,0.25); }
.ds-tag--violet   { background: rgba(142,49,237,0.20);   color: #C4B0FF;  border: 1px solid rgba(142,49,237,0.35); }
.ds-tag--success  { background: rgba(34,197,94,0.10);    color: #22C55E;  border: 1px solid rgba(34,197,94,0.25); }
.ds-tag--danger   { background: rgba(239,68,68,0.10);    color: #EF4444;  border: 1px solid rgba(239,68,68,0.25); }
.ds-tag--warning  { background: rgba(245,158,11,0.10);   color: #F59E0B;  border: 1px solid rgba(245,158,11,0.25); }
.ds-tag--info     { background: rgba(56,189,248,0.10);   color: #60A5FA;  border: 1px solid rgba(56,189,248,0.25); }
.ds-tag--lg       { padding: 6px 14px; font-size: 13px; border-radius: var(--radius-md); }
.ds-tag--dot::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.ds-tag-x         { cursor: pointer; opacity: .65; font-size: 11px; }

// Charts
.ds-chart-wrapper   { background: rgb(14,12,30); border: 1px solid rgba(92,247,203,0.08); border-radius: var(--radius-xl); padding: var(--space-6); }
.ds-chart-title     { font-size: 14px; font-weight: 600; color: #fff; }
.ds-chart-value     { font-family: var(--font-mono); font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -0.01em; }
.ds-chart-change    { font-family: var(--font-mono); font-size: 12px; font-weight: 700; color: #22C55E; }
.ds-tf-btn          { padding: 4px 10px; border-radius: var(--radius-sm); font-size: 11px; font-weight: 600; font-family: var(--font-mono); border: none; background: none; color: var(--color-text-muted); }
.ds-tf-btn.active   { background: rgba(92,247,203,0.12); color: #5CF7CB; }
```

---

## Colores de P&L — Trading

```scss
.pnl {
  font-family: var(--font-mono);
  font-weight: 600;
  font-variant-numeric: tabular-nums;

  &--positive { color: #22C55E; }   // ganancia
  &--negative { color: #EF4444; }   // pérdida
  &--neutral  { color: var(--color-text-secondary); }
}
```

```typescript
readonly pnlClass = computed(() => {
  const pnl = this.trade().pnl;
  if (pnl > 0) return 'pnl--positive';
  if (pnl < 0) return 'pnl--negative';
  return 'pnl--neutral';
});
```

### Badges de Estado de Trade
| Status | Clase | Color |
|--------|-------|-------|
| `OPEN` | `.ds-badge-active` | Mint `#5CF7CB` |
| `CLOSED` | `.ds-tag--default` | Gris |
| `CANCELLED` | `.ds-badge-pending` | Amarillo `#F59E0B` |
| `PARTIALLY_FILLED` | `.ds-badge-pending` | Amarillo |

### Badges de Lado
| Side | Clase | Color |
|------|-------|-------|
| `BUY` | `.ds-badge-buy` | Verde `#22C55E` |
| `SELL` | `.ds-badge-sell` | Rojo `#EF4444` |

---

## Layout de Páginas

### Estructura base
```html
<div class="page">
  <header class="page__header">
    <p class="section-module-label">Módulo · Sección</p>
    <h1 class="page__title">Título</h1>
    <div class="page__actions">
      <button class="ds-btn ds-btn--primary">Nueva Orden</button>
    </div>
  </header>
  <section class="page__content">...</section>
</div>
```

```scss
.page {
  display: flex; flex-direction: column; gap: var(--space-4);
  padding: var(--space-6); height: 100%;
  &__header { display: flex; align-items: center; justify-content: space-between; }
  &__title  { font-family: var(--font-sans); font-size: 22px; font-weight: 600; color: var(--color-text-primary); letter-spacing: -0.005em; margin: 0; }
  &__content { flex: 1; overflow: hidden; }
}

.section-module-label {
  font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--color-mint-500); margin-bottom: var(--space-3);
}

.section-divider {
  height: 1px;
  background: linear-gradient(90deg, rgba(92,247,203,0.25) 0%, rgba(142,49,237,0.15) 50%, transparent 100%);
  margin: var(--space-12) 0;
}
```

### Scrollbar personalizado
```scss
::-webkit-scrollbar       { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(92,247,203,0.15); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(92,247,203,0.30); }
```

---

## Estados de UI — Obligatorios

```html
<app-skeleton *ngIf="store.loading()" type="table" [rows]="10" />

<app-alert
  *ngIf="store.error() && !store.loading()"
  type="error"
  [message]="store.error()!"
  (closed)="store.clearError()"
/>

<ng-container *ngIf="!store.loading() && !store.error()">
  <app-empty-state
    *ngIf="store.isEmpty()"
    icon="receipt_long"
    title="Sin operaciones"
    message="No hay trades para los filtros seleccionados"
    actionLabel="Nueva Orden"
    (action)="openNewOrder()"
  />
  <app-data-table
    *ngIf="!store.isEmpty()"
    [config]="tableConfig"
    [data]="store.trades()"
    [totalItems]="store.total()"
    (rowAction)="onRowAction($event)"
  />
</ng-container>
```

---

## SCSS — Reglas de Escritura

```scss
// ✅ Siempre variables del design system
.componente {
  background: var(--color-bg-surface);
  color: var(--color-text-primary);
  border: var(--stroke-thin) solid var(--color-border-subtle);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  font-family: var(--font-sans);
  box-shadow: var(--shadow-md);
}

// ✅ Datos numéricos — siempre monospace
.price, .pnl, .quantity, .timestamp {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

// ❌ Nunca hardcodear valores del sistema
.mal { background: #12100a; color: #fff; border-radius: 8px; padding: 16px; }
```

---

## Angular Material — Tema

```scss
@use '@angular/material' as mat;
$broker-theme: mat.define-theme((
  color: (theme-type: dark, primary: mat.$violet-palette),
  typography: (brand-family: 'Raleway', plain-family: 'Raleway'),
  density: (scale: -1),
));
html { @include mat.all-component-themes($broker-theme); }
```
