import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Core/auth/services/auth.service';
import { User } from '../../Core/interfaces/user.model';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../Core/Services/translation.service';
import { LocaleSettings } from 'primeng/calendar';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.scss',
})
export class DashboardHeaderComponent implements OnInit {
  userData!: User;
  isLangOpen: boolean = false;
  selectedLang!: string;

  constructor(
    private authService: AuthService,
    private translate: TranslateService,
    private translationService: TranslationService
  ) {
    this.selectedLang = translate.currentLang as string;
  }

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

  changeLangHandler(lang: any) {
    this.selectedLang = lang;
    this.translationService.setLanguage(this.selectedLang);
    this.translate.use(this.selectedLang);
  }

  openLangMenu() {
    this.isLangOpen = !this.isLangOpen;
  }
}
