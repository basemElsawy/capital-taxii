import { Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { MapComponent } from '../map/map.component';
import { ViewsComponent } from './views.component';
import { DriversComponent } from '../Drivers/Drivers.component';
import { UsersComponent } from '../users/users.component';
import { VehicleComponent } from '../vehicle/vehicle.component';
import { SettingsComponent } from '../settings/settings.component';
import { authguardGuard } from '../guard-interceptor/auth.guard';
import { ClientsComponent } from '../clients/clients.component';
import { StationsPricesComponent } from '../stations-prices/stations-prices.component';
import { StationsComponent } from '../stations/stations.component';
import { ShiftsComponent } from '../shifts/shifts.component';
import { ZonesComponent } from '../zones/zones.component';
import { PermissionsComponent } from '../permissions/permissions.component';
import { RolesComponent } from '../roles/roles.component';
import { TablePricesComponent } from '../table-prices/table-prices.component';
import { VehicleServiceTypeComponent } from '../vehicle-service-type/vehicle-service-type.component';
import { PeakTimeComponent } from '../peak-time/peak-time.component';
import { ReportsComponent } from '../reports/reports.component';
import { PromoCodeComponent } from '../promo-code/promo-code.component';
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'map',
  },

  {
    path: '',
    canActivate: [authguardGuard],
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
      {
        path: 'clients',
        component: ClientsComponent,
      },

      {
        path: 'vehicle',
        component: VehicleComponent,
      },
      {
        path: 'stations',
        component: StationsComponent,
      },
      {
        path: 'stationsPrices',
        component: StationsPricesComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
      {
        path: 'shifts',
        component: ShiftsComponent,
      },
      {
        path: 'zones',
        component: ZonesComponent,
      },
      {
        path: 'permissions',
        component: PermissionsComponent,
      },
      {
        path: 'roles',
        component: RolesComponent,
      },
      {
        path: 'tablePrices',
        component: TablePricesComponent,
      },
      {
        path: 'vehicleServiceType',
        component: VehicleServiceTypeComponent,
      },
      {
        path: 'peakTime',
        component: PeakTimeComponent,
      },
      {
        path: 'reports',
        component: ReportsComponent,
      },
      {
        path: 'promoCode',
        component: PromoCodeComponent,
      },
    ],
  },
];
