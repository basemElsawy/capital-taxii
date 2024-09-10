import { Component } from '@angular/core';
import { SideNavComponent } from '../../shared-ui/side-nav/side-nav.component';
import { DashboardHeaderComponent } from '../../shared-ui/dashboard-header/dashboard-header.component';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../Core/Services/translation.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-views',
  standalone: true,
  imports: [
    SideNavComponent,
    DashboardHeaderComponent,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './views.component.html',
  styleUrl: './views.component.scss',
})
export class ViewsComponent {
  language!: string;
  constructor(
    private translationService: TranslationService,
    private translate: TranslateService
  ) {}
  ngOnInit() {
    this.currentLanguageSetter();
  }
  currentLanguageSetter() {
    this.translationService.getLanguage.subscribe((value: string) => {
      this.language = value;
    });
    this.language = this.translate.currentLang;
  }

  get currentLanguage() {
    return this.language;
  }
}
