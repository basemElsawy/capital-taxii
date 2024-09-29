import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from './Core/Services/translation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(
    protected translation: TranslateService,
    private translationService: TranslationService
  ) {
    translation.addLangs(['En', 'Ar']);
    translation.setDefaultLang('En');
    let startingLang = translationService.startingLanguage();
    translation.use(startingLang);
    translationService.setLanguage('En');
  }
  ngOnInit() {
    this.translationService.setLanguage(this.translation.currentLang);
  }
}
