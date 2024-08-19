import { Component } from '@angular/core';
import { SideNavComponent } from '../../shared-ui/side-nav/side-nav.component';
import { DashboardHeaderComponent } from '../../shared-ui/dashboard-header/dashboard-header.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-views',
  standalone: true,
  imports: [SideNavComponent, DashboardHeaderComponent, RouterModule],
  templateUrl: './views.component.html',
  styleUrl: './views.component.scss',
})
export class ViewsComponent {}
