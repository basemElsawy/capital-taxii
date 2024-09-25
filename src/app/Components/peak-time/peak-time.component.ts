import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerComponent } from '../../shared-ui/spinner/spinner.component';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../Core/Services/translation.service';
import { PeakTimeService } from './Services/peak-time.service';
@Component({
  selector: 'app-stations-prices',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SpinnerComponent,
    TooltipModule,
    TranslateModule,
  ],
  templateUrl: './peak-time.component.html',
  styleUrl: './peak-time.component.scss',
})
export class PeakTimeComponent {
  WeekPeakTimes: any[] = [];
  updatepeakTimeForm!: FormGroup;
  addpeakTimeForm!: FormGroup;
  addDriverVehicleForm!: FormGroup;
  choosedStation: any;
  stations: any;
  isLoading: boolean = false;
  lang!: string;
  selectedPeakTimeTable: any;
  tablePricesDetails: any;
  vehicleServiceTypes: any[] = [];
  peakTimesForDay: any[] = [];
  selectedPeakTimeForDay: any;
  constructor(
    private peakTimeService: PeakTimeService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private translate: TranslateService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    // this.initializeStationsPricesForm();
    this.initializeForm();
    this.getAllWeekPeakTime();
    this.addFormPeakTime();

    this.languageSetter();
  }
  languageSetter() {
    if (!this.lang) {
      this.lang = this.translate.currentLang;
    }
    this.translationService.getLanguage.subscribe((val: string) => {
      this.lang = val;
    });
  }

  // initializeStationsPricesForm() {
  //   this.addTablePriceForm = this.fb.group({
  //     nameEn: [null, Validators.required],
  //     nameAr: [null, Validators.required],
  //     startDate: [null, Validators.required],
  //     endDate: [null, Validators.required],
  //   });
  // }
  initializeForm() {
    this.addpeakTimeForm = this.fb.group({
      peakTime: this.fb.array([this.newPeakTime()]), // Initialize with one entry
    });
    this.updatepeakTimeForm = this.fb.group({
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
      price: [null, Validators.required],
    });
  }
  // Getter for the form array
  get peakTime(): FormArray {
    return this.addpeakTimeForm.get('peakTime') as FormArray;
  }

  // Function to create a new form group for each entry
  newPeakTime(): FormGroup {
    return this.fb.group({
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
      price: [null, Validators.required],
    });
  }

  // Add new entry to the FormArray
  addFormPeakTime() {
    this.peakTime.push(this.newPeakTime());
  }

  openUpdateModal(content: any, selectedPeakTimeTable: any) {
    this.initializeForm();
    // this.setStationDataInUpdateForm(tablePrice);
    this.selectedPeakTimeTable = selectedPeakTimeTable;
    this.getpeakTimesForDayByDayId(this.selectedPeakTimeTable.id);
    this.tablePricesDetails = [];
    // this.getAllTablePricsDetailsById(this.selectedPeakTimeTable.id);
    this.modalService.open(content, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
      scrollable: true,
    });
  }
  openUpdatePeakTimeModal(content: any, selectedPeakTimeForDay: any) {
    this.initializeForm();
    this.setPeakTimeDataInUpdateForm(selectedPeakTimeForDay);
    this.selectedPeakTimeForDay = selectedPeakTimeForDay;
    // this.getpeakTimesForDayByDayId(this.selectedPeakTimeTable.id);
    this.modalService.open(content, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
      scrollable: true,
    });
  }
  setPeakTimeDataInUpdateForm(selectedPeakTimeTable: any) {
    this.updatepeakTimeForm.patchValue({
      id: selectedPeakTimeTable.id,
      startTime: selectedPeakTimeTable.startTime,
      endTime: selectedPeakTimeTable.endTime,
      price: selectedPeakTimeTable.price,
    });
  }
  openAddModal(content: any) {
    this.modalService.open(content, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
      scrollable: true,
    });
  }
  closeModal() {
    this.modalService.dismissAll();
  }

  getAllWeekPeakTime() {
    this.peakTimeService.getAllWeekPeakTime().subscribe((data: any) => {
      this.WeekPeakTimes = data;
    });
  }

  addPeakTime() {
    // Get the form value
    let formValues = this.addpeakTimeForm.value.peakTime;

    // Modify startTime and endTime to include seconds
    let peakTimesWithSeconds = formValues.map((peakTime: any) => {
      return {
        ...peakTime,
        startTime: this.addSecondsToTime(peakTime.startTime),
        endTime: this.addSecondsToTime(peakTime.endTime),
      };
    });

    // Create the body with updated peakTimes
    let body = {
      id: this.selectedPeakTimeTable.id,
      peakTimes: peakTimesWithSeconds,
      status: this.selectedPeakTimeTable.status,
      nameAr: this.selectedPeakTimeTable.nameAr,
      nameEn: this.selectedPeakTimeTable.nameEn,
    };

    // Call the service to submit the data
    this.peakTimeService.addPeakTime([body]).subscribe({
      next: (res: any) => {
        this.getAllWeekPeakTime();
        // this.modalService.dismissAll();
        this.addpeakTimeForm.reset();
        this.getpeakTimesForDayByDayId(this.selectedPeakTimeTable.id);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  addSecondsToTime(time: string): string | null {
    if (!time) {
      return null; // Return null if time is not provided
    }

    // Check if the time already includes seconds (length should be 8 for HH:MM:SS)
    if (time.length === 8) {
      return time; // If it already has seconds, return the original time
    }

    // If time is in HH:MM format, add ":00" for seconds
    if (time.length === 5) {
      return `${time}:00`;
    }

    return time; // Return the time as is if it doesn't match either format
  }
  getpeakTimesForDayByDayId(dayId: number) {
    this.peakTimeService
      .getpeakTimesForDayByDayId(dayId)
      .subscribe((res: any) => {
        this.peakTimesForDay = res.peakTimes;
      });
  }
  updatePeakTime() {
    let formValues = this.updatepeakTimeForm.value;
    let peakTimesWithSeconds = {
      ...formValues,
      startTime: this.addSecondsToTime(formValues.startTime),
      endTime: this.addSecondsToTime(formValues.endTime),
    };

    let body = {
      ...peakTimesWithSeconds,
      id: this.selectedPeakTimeForDay.id,
      weekDaysId: this.selectedPeakTimeTable.id,
    };
    this.peakTimeService.updatePeakTime(body).subscribe(() => {
      this.getAllWeekPeakTime();
      this.modalService.dismissAll();
    });
  }
  deletePeakTime(PeakTimeId: number) {
    this.peakTimeService.deletePeakTimeById(PeakTimeId).subscribe(() => {
      this.getAllWeekPeakTime();
      this.modalService.dismissAll();
    });
  }
  checkboxEvent(peakTimesForDay: any) {
    peakTimesForDay.status = !!peakTimesForDay.status;
    this.changeStatusOfPeakTimeDay(peakTimesForDay);
  }
  changeStatusOfPeakTimeDay(peakTimesForDay: any) {
    this.peakTimeService.addPeakTime([peakTimesForDay]).subscribe(() => {
      this.getAllWeekPeakTime();
    });
    console.log(peakTimesForDay);
  }
}
