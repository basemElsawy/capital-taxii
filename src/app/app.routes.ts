import { Routes } from '@angular/router';

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
    loadChildren: () =>
      import('./Components/views/Views.routes').then((m) => m.routes),
  },
];
