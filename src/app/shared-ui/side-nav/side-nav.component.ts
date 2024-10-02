import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User } from '../../Core/interfaces/user.model';

import { jwtDecode } from 'jwt-decode';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../Core/Services/translation.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment.development';
@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [RouterModule, TranslateModule, CommonModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavComponent implements OnInit {
  userData!: User;
  permissions: any;
  baseUrl = environment.base_url; // Define the base URL for your image server
  imgUrl = environment.image; // Define the base URL for your image server

  lang!: string;
  constructor(
    private translationService: TranslationService,
    private translate: TranslateService
  ) {}
  ngOnInit(): void {
    this.getUserDataFromStorage();
    this.languageSetter();
    console.log(this.lang);
  }
  getUserDataFromStorage() {
    const userJson = localStorage.getItem('user');
    const userRolesData = localStorage.getItem('roles');

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
    if (userRolesData) {
      try {
        let userRoles = JSON.parse(userRolesData);
        this.permissions = [];
        const excludedUrls = [
          '/home/permissions',
          '/home/roles',
          '/home/vehicleServiceType',
          '/home/tablePrices',
          '/home/stationsPrices',
          '/home/users',
          '/home/shifts',
          '/home/zones',
          '/home/peakTime',
          '/home/stations',
          '/home/vehicle',
        ];
        // Loop through each role and collect the permissions
        userRoles.forEach((role: any) => {
          role.permissions.forEach((permission: any) => {
            // Check if the permission URL is not in the excluded URLs
            if (!excludedUrls.includes(permission.url)) {
              this.permissions.push(permission); // Add permission if the URL is not excluded
            }
          });
        });
      } catch (error) {
        console.error('Failed to parse user data from localStorage', error);
        // Handle parsing error or set a default value if necessary
      }
    } else {
      console.warn('No user data found in localStorage');
      // Handle the case where no user data is found
    }
  }
  languageSetter() {
    if (!this.lang) {
      this.lang = this.translate.currentLang;
    }
    this.translationService.getLanguage.subscribe((value: string) => {
      console.log(value);
      this.lang = value;
    });
  }

  getFullImageUrl(): string {
    if (this.userData?.picture) {
      return `${this.imgUrl}${this.userData.picture}`;
    }
    return '../../../assets/unknown.png'; // Return an empty string or a default image URL if picture is not available
  }
  get userImage() {
    return this.getFullImageUrl();
  }
}
