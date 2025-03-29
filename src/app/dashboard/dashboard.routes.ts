import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    children: [
      {
        path: 'home',
        title: 'Home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: '**',
        loadComponent: () => import('../common/pages/not-found/not-found.component').then(m => m.default),
      },
    ],
  },
] as Routes;
