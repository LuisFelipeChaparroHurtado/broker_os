import { Routes } from '@angular/router';

export const perfilRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./perfil.page').then(m => m.PerfilPageComponent),
  },
];
