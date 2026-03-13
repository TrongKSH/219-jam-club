import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/landing/landing.component').then((m) => m.LandingComponent) },
  {
    path: 'admin',
    children: [
      { path: 'login', loadComponent: () => import('./pages/admin/login/login.component').then((m) => m.LoginComponent) },
      {
        path: '',
        loadComponent: () => import('./pages/admin/admin-layout.component').then((m) => m.AdminLayoutComponent),
        canActivate: [authGuard],
        children: [
          { path: '', redirectTo: 'events', pathMatch: 'full' },
          { path: 'contact', loadComponent: () => import('./pages/admin/content-editor/content-editor.component').then((m) => m.ContentEditorComponent) },
          { path: 'events', loadComponent: () => import('./pages/admin/events-manager/events-manager.component').then((m) => m.EventsManagerComponent) },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
