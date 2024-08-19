import { Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { MapComponent } from '../map/map.component';
import { ViewsComponent } from './views.component';
import { DriversComponent } from '../Drivers/Drivers.component';
import { UsersComponent } from '../users/users.component';
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'map',
  },

  {
    path: '',
    component: ViewsComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'map', component: MapComponent },
      {
        path: 'drivers',
        component: DriversComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
    ],
  },
];
