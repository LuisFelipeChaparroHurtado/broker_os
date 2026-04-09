# Context: API Contracts

## Base URL
```
DEV:  http://localhost:3000/api
PROD: https://api.brokeros.com/api
```

Configurado via `environment.apiUrl` e inyectado con `API_BASE_URL` InjectionToken.

---

## Convenciones Generales

### Request Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
Accept: application/json
```

### Respuesta Exitosa — Paginada
```typescript
interface PaginatedResponse<T> {
  data:       T[];
  total:      number;      // total de items en DB
  page:       number;      // página actual (0-indexed)
  limit:      number;      // items por página
  totalPages: number;
}
```

### Respuesta Exitosa — Item Único
```typescript
interface ApiResponse<T> {
  data:      T;
  message?:  string;
  timestamp: string;       // ISO 8601
}
```

### Respuesta de Error
```typescript
interface ApiError {
  code:      string;       // 'TRADE_NOT_FOUND', 'INSUFFICIENT_FUNDS'
  message:   string;       // Mensaje legible
  details?:  Record<string, string[]>;  // errores por campo (422)
  timestamp: string;
}
```

### Códigos HTTP
| Código | Significado | Acción en frontend |
|--------|-------------|-------------------|
| `200` | OK | Procesar data |
| `201` | Created | Procesar data + toast success |
| `400` | Bad Request | Mostrar mensaje de error |
| `401` | Unauthorized | Redirect a /login |
| `403` | Forbidden | Toast "Sin permisos" |
| `404` | Not Found | Mostrar empty state |
| `422` | Validation Error | Mostrar errores en formulario |
| `500` | Server Error | Toast "Error interno" + log |

---

## Endpoints — Trades

### GET /trades
Lista paginada de trades con filtros.

**Query params:**
```typescript
interface TradeFilters {
  page?:      number;    // default: 0
  limit?:     number;    // default: 25, max: 100
  symbol?:    string;    // 'BTCUSDT'
  side?:      'BUY' | 'SELL';
  status?:    'OPEN' | 'CLOSED' | 'CANCELLED';
  dateFrom?:  string;    // ISO 8601
  dateTo?:    string;    // ISO 8601
  sortBy?:    keyof Trade;
  sortDir?:   'asc' | 'desc';
}
```

**Response:** `PaginatedResponse<Trade>`

---

### GET /trades/:id
Detalle de un trade.

**Response:** `ApiResponse<Trade>`

---

### POST /trades
Crear nueva orden.

**Body:**
```typescript
interface CreateTradeDto {
  symbol:    string;                         // required
  side:      'BUY' | 'SELL';                // required
  orderType: 'MARKET' | 'LIMIT' | 'STOP_LIMIT';  // required
  quantity:  number;                         // required, > 0
  price?:    number;                         // required si LIMIT o STOP_LIMIT
  stopPrice?: number;                        // required si STOP_LIMIT
  notes?:    string;                         // max 500 chars
}
```

**Response:** `ApiResponse<Trade>` (201)

**Errores posibles:**
- `422` con `details.symbol: ['Símbolo no soportado']`
- `422` con `details.quantity: ['Fondos insuficientes']`

---

### DELETE /trades/:id
Cancelar orden (solo si `status === 'OPEN'`).

**Response:** `204 No Content`

**Errores posibles:**
- `404` si el trade no existe
- `400` con `code: 'TRADE_NOT_CANCELLABLE'` si ya está cerrado

---

## Endpoints — Portfolio

### GET /portfolio/positions
Posiciones actuales abiertas.

**Response:** `ApiResponse<Position[]>`

### GET /portfolio/summary
Métricas de portafolio.

**Response:**
```typescript
ApiResponse<{
  totalValue:    number;
  dailyPnL:      number;
  dailyPnLPct:   number;
  totalPnL:      number;
  openPositions: number;
  marginUsed:    number;
  marginAvail:   number;
}>
```

---

## Endpoints — Market Data

### GET /market/symbols
Lista de símbolos disponibles para operar.

**Response:** `ApiResponse<{ symbol: string; name: string; minQty: number; tickSize: number }[]>`

### GET /market/price/:symbol
Precio actual de un símbolo.

**Response:** `ApiResponse<{ symbol: string; price: number; change24h: number; volume24h: number }>`

---

## WebSocket — Real-time

### Conectar
```
ws://localhost:3000/ws
```

### Autenticar
```typescript
// Enviar tras conectar
{ type: 'auth', token: '<jwt>' }
```

### Suscribir a precios
```typescript
// Cliente → Servidor
{ type: 'subscribe', channel: 'price', symbol: 'BTCUSDT' }

// Servidor → Cliente (en streaming)
{ type: 'price', symbol: 'BTCUSDT', price: 43210.55, timestamp: '...' }
```

### Suscribir a estado de órdenes
```typescript
// Cliente → Servidor
{ type: 'subscribe', channel: 'orders' }

// Servidor → Cliente
{ type: 'order_update', trade: Trade }
```

---

## Autenticación

### POST /auth/login
```typescript
// Body
{ email: string; password: string }

// Response
ApiResponse<{
  accessToken:  string;   // JWT, expira en 1h
  refreshToken: string;   // expira en 7d
  user: { id: string; email: string; name: string }
}>
```

### POST /auth/refresh
```typescript
// Body
{ refreshToken: string }

// Response
ApiResponse<{ accessToken: string }>
```
