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

  /**
   * This function is used to get the starting language from the local storage.
   * If the language is not set in the local storage, it sets the language to 'En'.
   * @returns {string} The starting language.
   */
  startingLanguage(): string {
    if (localStorage.getItem('language')) {
      // If the language is set in the local storage, get it and set it as the current language.
      let lang = <string>localStorage.getItem('language');
      this.setLanguage(lang);
      return lang;
    } else {
      // If the language is not set in the local storage, set it to 'En' and return it.
      this.setLanguage('En');
      return 'En';
    }
  }

  get getLanguage() {
    return this.language;
  }
}
