import { Component, Input } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../../Core/Services/translation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dashboard-shared-table',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './shared-table.component.html',
  styleUrl: './shared-table.component.scss',
})
export class SharedTableComponent {
  @Input('tableRow') tableRowData: any;
  lang!: string;
  constructor(
    private translate: TranslateService,
    private translation: TranslationService
  ) {}
  ngOnInit() {
    this.languageSetter();
    console.log(this.tableRowData);
  }

  languageSetter() {
    if (!this.lang) {
      this.lang = this.translate.currentLang;
    }
    this.translation.getLanguage.subscribe((val: string) => {
      this.lang = val;
    });
  }
}
