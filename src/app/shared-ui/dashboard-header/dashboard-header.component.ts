import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Core/auth/services/auth.service';
import { User } from '../../Core/interfaces/user.model';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.scss',
})
export class DashboardHeaderComponent implements OnInit {
  userData!: User;

  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        this.userData = JSON.parse(userJson) as User; // Parse and cast to User type
      } catch (error) {
        console.error('Failed to parse user data from localStorage', error);
        // Handle parsing error or set a default value if necessary
      }
    } else {
      console.warn('No user data found in localStorage');
      // Handle the case where no user data is found
    }
  }

  doLogOut() {
    this.authService.makeLogout();
  }
}
