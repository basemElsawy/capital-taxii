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
  isLoading: boolean = false;
  driversCommissionData: any[] = [];
  drivers: any[] = [];
  public readonly imageUrl = environment.image;
  pageSize: number = 10; // Number of drivers per page
  totalRecords: number = 0; // Total number of records
  constructor(
    private reportsService: ReportsService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private translation: TranslationService,
    private modalService: NgbModal
  ) {}
  ngOnInit() {
    this.setLanguage();
    this.loadDriversForFirstThreePages(); // Call this function when the component is initialized

    this.searchDriversCommissionForm = new FormGroup({
      startDate: new FormControl(null, Validators.required),
      endDate: new FormControl(null, Validators.required),
      drivers: new FormControl(null, Validators.required),
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

    this.reportsService.getDriversCommission(body).subscribe((res: any) => {
      this.driversCommissionData = res;
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
  loadDriversForFirstThreePages() {
    const page1$ = this.getDriversByPage(1, this.pageSize); // Get drivers for page 1
    const page2$ = this.getDriversByPage(2, this.pageSize); // Get drivers for page 2

    // Execute all 3 requests in parallel and wait until all are complete
    forkJoin([page1$, page2$]).subscribe(
      (responses: any[]) => {
        // Flatten the results and combine them into the `drivers` array
        this.drivers = [...responses[0].items, ...responses[1].items];

        // Optionally, set totalRecords from the first response if API provides total count
        this.totalRecords = responses[0].totalCount;

        console.log('All drivers loaded:', this.drivers); // Check the combined drivers data
      },
      (error) => {
        console.error('Error loading drivers:', error);
      }
    );
  }

  getDriversByPage(page: number, size: number) {
    return this.reportsService.getAllDrivers(page, size); // Fetch drivers for a specific page
  }
  closeModal() {
    this.modalService.dismissAll();
  }
  print() {
    window.print();
  }
}
