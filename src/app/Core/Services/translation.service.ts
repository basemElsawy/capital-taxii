import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private language: Subject<string> = new Subject();
  languageChangeDetector: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private translate: TranslateService) {}

  setLanguage(newLang: string) {
    localStorage.setItem('language', newLang);

    this.language.next(newLang);
  }

  startingLanguage() {
    if (localStorage.getItem('language')) {
      let lang = <string>localStorage.getItem('language');
      this.setLanguage(lang);
      return lang;
    } else {
      this.setLanguage('Ar');
      return 'Ar';
    }
  }

  get getLanguage() {
    return this.language;
  }
}
