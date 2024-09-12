import { ShiftsService } from './services/shifts.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SpinnerComponent } from '../../shared-ui/spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment.development';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../Core/Services/translation.service';
@Component({
  selector: 'app-shifts',
  standalone: true,
  imports: [
    CommonModule,
    NgbNavModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerComponent,
    TranslateModule,
  ],
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.scss'],
})
export class ShiftsComponent implements OnInit {
  active = 1;
  searchForOpenShifysForm!: FormGroup;
  searchForClosedShifysForm!: FormGroup;
  isLoading: boolean = false;
  openShifts: any;
  closedShifts: any;
  singleShift: any;
  lang!: string;
  public readonly imageUrl = environment.image;

  constructor(
    private shiftsService: ShiftsService,
    private modalService: NgbModal,
    private translation: TranslationService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.searchForOpenShifysForm = new FormGroup({
      fromDate: new FormControl(null, Validators.required),
      toDate: new FormControl(null, Validators.required),
    });
    this.searchForClosedShifysForm = new FormGroup({
      fromDate: new FormControl(null, Validators.required),
      toDate: new FormControl(null, Validators.required),
    });
    this.languageSetter();
  }
  languageSetter() {
    if (!this.lang) {
      this.lang = this.translate.currentLang;
    }
    this.translation.getLanguage.subscribe((val: string) => {
      this.lang = val;
    });
  }
  searchForOpenShifts() {
    const fromDate = this.searchForOpenShifysForm.controls['fromDate'].value;
    const toDate = this.searchForOpenShifysForm.controls['toDate'].value;

    this.shiftsService.getOpenShifts(fromDate, toDate).subscribe((res: any) => {
      this.openShifts = res.data;
    });
  }
  searchForClosedShifts() {
    const fromDate = this.searchForClosedShifysForm.controls['fromDate'].value;
    const toDate = this.searchForClosedShifysForm.controls['toDate'].value;

    this.shiftsService
      .getClosedShifts(fromDate, toDate)
      .subscribe((res: any) => {
        this.closedShifts = res.data;
      });
  }
  openShiftReportModal(content: any, shift?: any) {
    this.modalService.open(content, {
      fullscreen: true,
      backdrop: 'static',
      centered: true,
    });

    if (shift) {
      this.singleShift = shift;
      console.log(this.singleShift);
      return;
    }
  }
  closeModal() {
    this.modalService.dismissAll();
  }
  print() {
    window.print();
  }
  checkboxEvent(event: any) {}
}
