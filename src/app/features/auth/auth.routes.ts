import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPageComponent),
  },
  // {
  //   path: 'register',
  //   loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPageComponent),
  // },
  // {
  //   path: 'forgot-password',
  //   loadComponent: () => import('./pages/forgot-password/forgot-password.page').then(m => m.ForgotPasswordPageComponent),
  // },
];
