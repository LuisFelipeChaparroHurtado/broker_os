import { Routes } from '@angular/router';

export const perfilRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/perfil/perfil.page').then(m => m.PerfilPageComponent),
  },
];
