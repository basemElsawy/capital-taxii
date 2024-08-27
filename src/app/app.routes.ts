import { Routes } from '@angular/router';
import { authguardGuard } from './Components/guard-interceptor/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth',
  },
  {
    path: 'auth',
    loadChildren: () => import('./Core/auth/auth.routes').then((m) => m.routes),
  },

  {
    path: 'home',
    canActivate: [authguardGuard],
    loadChildren: () =>
      import('./Components/views/Views.routes').then((m) => m.routes),
  },
];
