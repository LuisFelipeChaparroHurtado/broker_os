import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes),
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell.component').then(m => m.ShellComponent),
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
    redirectTo: '',
  },
];
