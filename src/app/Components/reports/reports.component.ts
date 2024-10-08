import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SpinnerComponent } from '../../shared-ui/spinner/spinner.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../Core/Services/translation.service';
import { StationsPricesComponent } from '../stations-prices/stations-prices.component';
import { CommonModule } from '@angular/common';
import { TablePricesComponent } from '../table-prices/table-prices.component';
import { ZonesComponent } from '../zones/zones.component';
import { VehicleServiceTypeComponent } from '../vehicle-service-type/vehicle-service-type.component';
import { PeakTimeComponent } from '../peak-time/peak-time.component';
import { ReportsService } from './services/reports.service';
import { environment } from '../../../environments/environment.development';
import { MultiSelectModule } from 'primeng/multiselect';
import { forkJoin } from 'rxjs';
import { ShiftsComponent } from '../shifts/shifts.component';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    NgbNavModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    SpinnerComponent,
    TranslateModule,
    StationsPricesComponent,
    TablePricesComponent,
    ZonesComponent,
    VehicleServiceTypeComponent,
    PeakTimeComponent,
    MultiSelectModule,
    ShiftsComponent,
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  active = 1;
  lang!: string;
  searchDriversCommissionForm!: FormGroup;
  searchRequestsPaymentMethodForm!: FormGroup;
  searchRequestsStatusForm!: FormGroup;
  isLoading: boolean = false;
  driversCommissionData: any[] = [];
  RequestsStatusData: any[] = [];
  RequestsPaymentMethodData: any[] = [];
  drivers: any[] = [];
  public readonly imageUrl = environment.image;
  pageSize: number = 10; // Number of drivers per page
  totalRecords: number = 0; // Total number of records
  constructor(
    private reportsService: ReportsService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private translation: TranslationService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {}
  ngOnInit() {
    this.setLanguage();
    this.getAllDrivers();
    this.searchDriversCommissionForm = new FormGroup({
      startDate: new FormControl(null, Validators.required),
      endDate: new FormControl(null, Validators.required),
      drivers: new FormControl(null, Validators.required),
    });
    this.searchRequestsPaymentMethodForm = new FormGroup({
      from: new FormControl(null, Validators.required),
      to: new FormControl(null, Validators.required),
    });
    this.searchRequestsStatusForm = new FormGroup({
      from: new FormControl(null, Validators.required),
      to: new FormControl(null, Validators.required),
    });
    this.languageSetter();
  }
  setLanguage() {
    if (!this.lang) {
      this.lang = this.translate.currentLang;
    }

    this.translation.getLanguage.subscribe((val: string) => {
      this.lang = val;
    });
  }

  languageSetter() {
    if (!this.lang) {
      this.lang = this.translate.currentLang;
    }
    this.translation.getLanguage.subscribe((val: string) => {
      this.lang = val;
    });
  }

  searchForsearchDriversCommission() {
    const fromDate =
      this.searchDriversCommissionForm.controls['startDate'].value;
    const toDate = this.searchDriversCommissionForm.controls['endDate'].value;
    const drivers = this.searchDriversCommissionForm.controls['drivers'].value;
    let body = { ids: drivers, startDate: fromDate, endDate: toDate };

    this.reportsService.getDriversCommission(body).subscribe({
      next: (res: any) => {
        this.driversCommissionData = res;

        // Check if the data is empty
        if (
          !this.driversCommissionData ||
          this.driversCommissionData.length === 0
        ) {
          this.toastr.info('لا توجد بيانات', 'Information'); // No data message in Arabic
        } else {
          this.toastr.success(
            'Drivers commission data fetched successfully!',
            'Success'
          );
        }
      },
      error: (error: any) => {
        console.error('Error fetching drivers commission:', error);
        this.handleError(error);
      },
    });
  }

  searchRequestsPaymentMethod() {
    let body = this.searchRequestsPaymentMethodForm.value;

    this.reportsService.getRequestsPaymentMethod(body).subscribe({
      next: (res: any) => {
        this.RequestsPaymentMethodData = res.data;

        // Check if the data is empty
        if (
          !this.RequestsPaymentMethodData ||
          this.RequestsPaymentMethodData.length === 0
        ) {
          this.toastr.info('لا توجد بيانات', 'Information'); // No data message in Arabic
        } else {
          this.toastr.success(
            'Payment method data fetched successfully!',
            'Success'
          );
        }
      },
      error: (error: any) => {
        console.error('Error fetching payment methods:', error);
        this.handleError(error);
      },
    });
  }

  searchRequestsStatus() {
    let body = this.searchRequestsStatusForm.value;

    this.reportsService.getRequestsStatus(body).subscribe({
      next: (res: any) => {
        this.RequestsStatusData = res.data;

        // Check if the data is empty
        if (!this.RequestsStatusData || this.RequestsStatusData.length === 0) {
          this.toastr.info('لا توجد بيانات', 'Information'); // No data message in Arabic
        } else {
          this.toastr.success(
            'Requests status data fetched successfully!',
            'Success'
          );
        }
      },
      error: (error: any) => {
        console.error('Error fetching request status:', error);
        this.handleError(error);
      },
    });
  }

  // Reusing the handleError method from the previous implementation
  private handleError(error: any) {
    let errorMessage = '';

    // Check if the error structure matches the expected format
    if (error && error.error && error.error.isValid === false) {
      const apiErrors = error.error.errors;

      if (this.lang === 'En') {
        errorMessage =
          apiErrors.map((err: any) => err.errorEn).join(', ') ||
          'An unexpected error occurred.';
      } else if (this.lang === 'Ar') {
        errorMessage =
          apiErrors.map((err: any) => err.errorAr).join(', ') ||
          'حدث خطأ غير متوقع.';
      }
    } else {
      // Fallback error message
      errorMessage =
        this.lang === 'En'
          ? 'An unexpected error occurred.'
          : 'حدث خطأ غير متوقع.';
    }

    // Show the error message using Toastr
    this.toastr.error(errorMessage, 'Error');
  }
  getAllDrivers() {
    this.isLoading = true;
    this.reportsService.getAllDrivers().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.drivers = res;
      },
      error: (error: any) => {
        this.isLoading = false;
        console.log(error);
      },
    });
  }
  // openShiftReportModal(content: any, shift?: any) {
  //   this.modalService.open(content, {
  //     fullscreen: true,
  //     backdrop: 'static',
  //     centered: true,
  //   });

  //   if (shift) {
  //     this.singleShift = shift;
  //     console.log(this.singleShift);
  //     return;
  //   }
  // }
  // getAllDrivers() {
  //   this.reportsService.getAllDrivers().subscribe((res: any) => {
  //     this.drivers = res.items;
  //   });
  // }

  closeModal() {
    this.modalService.dismissAll();
  }
  print() {
    window.print();
  }
}
