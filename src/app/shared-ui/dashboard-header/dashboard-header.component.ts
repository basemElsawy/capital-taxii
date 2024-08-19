import { Component } from '@angular/core';
import { AuthService } from '../../Core/auth/services/auth.service';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.scss',
})
export class DashboardHeaderComponent {
  constructor(private authService: AuthService) {}

  doLogOut() {
    this.authService.makeLogout();
  }
}
