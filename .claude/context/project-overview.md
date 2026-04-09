# Context: Project Overview — Broker OS

## Qué es este proyecto
**Broker OS** es una plataforma web de trading que permite a usuarios gestionar órdenes, monitorear posiciones en tiempo real, analizar el historial de operaciones y administrar su portafolio.

## Objetivo de la aplicación
- Visualizar y gestionar trades (órdenes de compra/venta) en tiempo real
- Monitorear posiciones abiertas con P&L en vivo
- Analizar historial de operaciones con filtros avanzados
- Administrar configuraciones de cuenta y risk management

---

## Stack Técnico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | Angular | 17+ |
| UI Library | Angular Material | 17+ |
| Estado | Angular Signals + RxJS | — |
| HTTP | Angular HttpClient | — |
| Estilos | SCSS + CSS Variables | — |
| Tiempo real | WebSocket (RxJS webSocket) | — |
| Testing | Jest + Testing Library | — |
| Build | Angular CLI + esbuild | — |

---

## Features del Sistema

### 1. Trades / Órdenes
- Lista de trades con filtros (símbolo, fecha, tipo, estado)
- Crear nueva orden (market, limit, stop-limit)
- Cancelar orden abierta
- Ver detalle de ejecución

### 2. Portfolio
- Posiciones abiertas con valor actual y P&L
- Distribución por activo
- Métricas: valor total, ganancia del día, exposición

### 3. Market Data
- Precios en tiempo real via WebSocket
- Historial de precios (chart)
- Order book

### 4. Settings
- Configuración de cuenta
- Preferencias de visualización
- Risk parameters (stop-loss default, max position size)

---

## Dominio — Modelos Clave

```typescript
// Trade — unidad de operación
interface Trade {
  id:           string;
  symbol:       string;           // 'BTCUSDT', 'ETHUSDT'
  side:         'BUY' | 'SELL';
  orderType:    'MARKET' | 'LIMIT' | 'STOP_LIMIT';
  status:       'OPEN' | 'CLOSED' | 'CANCELLED' | 'PARTIALLY_FILLED';
  entryPrice:   number;
  currentPrice: number;
  quantity:     number;
  pnl:          number;
  pnlPercent:   number;
  timestamp:    string;           // ISO 8601
  executedAt:   string | null;
}

// Position — posición consolidada por símbolo
interface Position {
  symbol:       string;
  side:         'LONG' | 'SHORT';
  size:         number;
  avgEntryPrice: number;
  currentPrice: number;
  value:        number;
  pnl:          number;
  pnlPercent:   number;
}

// Order — orden pendiente
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
```

---

## Contexto de Diseño

- **Tema**: Oscuro por defecto (`data-theme="dark"`) — light mode disponible
- **Densidad**: Compacta — mostrar mucha información en pantalla
- **Fuente UI**: `Raleway` (300, 400, 600, 700, 800)
- **Fuente datos/números**: `JetBrains Mono` — precios, P&L, cantidades, timestamps
- **Colores principales**: Violeta `rgb(142,49,237)` (accent) + Mint `#5CF7CB` (secundario/positivo)
- **Idioma UI**: Español
- **Formato de moneda**: USD con 2 decimales (`$1,234.56`)
- **Formato de fecha**: `dd/MM/yyyy HH:mm:ss` en tablas, `dd/MM/yy` en formularios
- **Color positivo (ganancia)**: `#22C55E` (verde)
- **Color negativo (pérdida)**: `#EF4444` (rojo)
- **Design System**: ver `.claude/context/ui-guidelines.md` para tokens completos

---

## Flujo de Datos Típico

```
Usuario interactúa
     ↓
Page Component (lee signals del Store)
     ↓
Store (orquesta, mantiene estado)
     ↓
API Service (solo HTTP)
     ↓
ApiClient (wrapper HttpClient)
     ↓
Backend REST / WebSocket
```
