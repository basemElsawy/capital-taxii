import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User } from '../../Core/interfaces/user.model';

import { jwtDecode } from 'jwt-decode';
@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavComponent implements OnInit {
  userData!: User;
  baseUrl = 'http://10.4.30.8:1222'; // Define the base URL for your image server

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
  getFullImageUrl(): string {
    if (this.userData?.picture) {
      return `${this.baseUrl}${this.userData.picture}`;
    }
    return ''; // Return an empty string or a default image URL if picture is not available
  }
}
