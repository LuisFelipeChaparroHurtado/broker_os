import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [noAuthGuard],
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes),
  },

  {
    path: 'app',
    loadComponent: () => import('./layout/shell/shell.component').then(m => m.ShellComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.dashboardRoutes),
      },
      {
        path: 'perfil',
        loadChildren: () => import('./features/perfil/perfil.routes').then(m => m.perfilRoutes),
      },
    ],
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell-old/shell.component').then(m => m.ShellComponent),
    children: [
      {
        path: '',
        redirectTo: 'demo',
        pathMatch: 'full',
      },
      {
        path: 'demo',
        loadComponent: () => import('./features/demo/demo.page').then(m => m.DemoPageComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
