# Skill: Angular Architecture

## Versión Target
Angular 17+ — standalone components obligatorios, NO NgModules para features nuevas.

---

## Estructura de Carpetas Canónica

```
src/
├── app/
│   ├── core/                        ← Singleton services, guards, interceptors
│   │   ├── auth/
│   │   │   ├── auth.guard.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.model.ts
│   │   ├── http/
│   │   │   ├── api.client.ts
│   │   │   └── interceptors/
│   │   │       ├── auth.interceptor.ts
│   │   │       └── error.interceptor.ts
│   │   └── models/                  ← Tipos globales compartidos
│   │
│   ├── shared/                      ← Componentes UI reutilizables
│   │   ├── components/
│   │   │   ├── data-table/
│   │   │   ├── dynamic-form/
│   │   │   ├── btn/
│   │   │   ├── alert/
│   │   │   ├── badge/
│   │   │   └── modal/
│   │   └── pipes/
│   │
│   └── features/                    ← Un directorio por feature de negocio
│       ├── trades/
│       │   ├── models/              ← trade.model.ts
│       │   ├── services/            ← trades.service.ts
│       │   ├── store/               ← trades.store.ts (si aplica)
│       │   ├── components/          ← Componentes privados del feature
│       │   └── pages/               ← trade-list.page.ts, trade-detail.page.ts
│       ├── portfolio/
│       ├── orders/
│       └── settings/
│
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
│
└── styles/
    ├── _variables.scss
    ├── _mixins.scss
    └── _reset.scss
```

---

## Routing — Lazy Loading por Feature

```typescript
// app.routes.ts
export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'trades',
    pathMatch: 'full'
  },
  {
    path: 'trades',
    loadChildren: () => import('./features/trades/trades.routes').then(m => m.TRADES_ROUTES)
  },
  {
    path: 'portfolio',
    loadChildren: () => import('./features/portfolio/portfolio.routes').then(m => m.PORTFOLIO_ROUTES)
  },
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];

// features/trades/trades.routes.ts
export const TRADES_ROUTES: Routes = [
  {
    path: '',
    component: TradeListPageComponent   // standalone, ChangeDetectionStrategy.OnPush
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/trade-detail/trade-detail.page').then(m => m.TradeDetailPageComponent)
  }
];
```

---

## app.config.ts — Bootstrap sin AppModule

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideAnimationsAsync(),
    { provide: API_BASE_URL, useValue: environment.apiUrl },
  ]
};
```

---

## Reglas de Arquitectura

| Regla | Motivo |
|-------|--------|
| `core/` solo tiene providers `{ providedIn: 'root' }` | Evitar instancias duplicadas |
| `shared/` solo expone componentes `standalone: true` | Composición sin NgModule |
| `features/` no importa de otros `features/` | Evitar acoplamiento cruzado |
| Los `pages/` no contienen lógica — delegan al service | Separación de responsabilidades |
| Lazy loading en todas las rutas de feature | Performance — chunk splitting |

---

## Jerarquía de Dependencias

```
pages → services → api.client → HttpClient
pages → store    → services
pages → shared/components   (solo para UI)
components (shared) → NUNCA importan de features/
```
