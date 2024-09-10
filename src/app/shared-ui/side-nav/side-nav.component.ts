import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User } from '../../Core/interfaces/user.model';

import { jwtDecode } from 'jwt-decode';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../Core/Services/translation.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [RouterModule, TranslateModule, CommonModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavComponent implements OnInit {
  userData!: User;
  baseUrl = 'http://10.4.30.8:1222'; // Define the base URL for your image server
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
      return `${this.baseUrl}${this.userData.picture}`;
    }
    return '../../../assets/unknown.png'; // Return an empty string or a default image URL if picture is not available
  }
  get userImage() {
    return this.getFullImageUrl();
  }
}
