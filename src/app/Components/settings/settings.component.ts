import { PriceService } from './services/price.service';
import { Component, OnInit } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
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
import { StationsComponent } from '../stations/stations.component';
import { VehicleComponent } from '../vehicle/vehicle.component';
import { ToastrService } from 'ngx-toastr';
import { AddRequestComponent } from '../add-request/add-request.component';
@Component({
  selector: 'app-settings',
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
    StationsComponent,
    VehicleComponent,
    AddRequestComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  active = 1;
  kmPriceForm!: FormGroup;
  driverCommitionForm!: FormGroup;
  minimumFaresForm!: FormGroup;
  requestDistanceLimit!: FormGroup;
  deductionsForm!: FormGroup;
  requestTimeLimitForm!: FormGroup;
  taxiCounter!: FormGroup;
  DriverArrivalMinDistanceForm!: FormGroup;
  requestDistanceLimitId: any;
  requestTimeLimitId: any;
  DriverArrivalMinDistanceId: any;
  lang!: string;
  kmPriceId: any;
  minimumKMId: any;
  driverCommitionId: any;

  isLoading: boolean = false;

  constructor(
    private priceService: PriceService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private translation: TranslationService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.initialiseForm();
    this.getAllRequestDistanceLimits();
    this.getAllRequestTimeLimits();
    this.getAllRequestsKMPrice();
    this.getAllMinimumFares();
    this.getAllDriverCommitions();
    this.getAllDeductions();
    this.getDriverArrivalMinDistance();
    this.getTaxiCounterFees();
    this.setLanguage();
  }

  setLanguage() {
    if (!this.lang) {
      this.lang = this.translate.currentLang;
    }

    this.translation.getLanguage.subscribe((val: string) => {
      this.lang = val;
    });
  }

  getAllRequestDistanceLimits() {
    this.priceService.getRequestLimitDistance().subscribe({
      next: (res: any) => {
        this.requestDistanceLimit.controls['distanceLimit'].setValue(
          res[0].distanceLimit
        );
        this.requestDistanceLimitId = res[0].id;
      },

      error: (error: any) => {
        console.log(error);
      },
    });
  }
  getAllRequestTimeLimits() {
    this.priceService.getRequestTimeLimit().subscribe({
      next: (res: any) => {
        this.requestTimeLimitForm.controls['time'].setValue(res[0].time);
        this.requestTimeLimitForm.controls['price'].setValue(res[0].price);
        this.requestTimeLimitId = res[0].id;
      },

      error: (error: any) => {
        console.log(error);
      },
    });
  }
  getDriverArrivalMinDistance() {
    this.priceService.getDriverArrivalMinDistance().subscribe({
      next: (res: any) => {
        this.DriverArrivalMinDistanceForm.controls['minDistance'].setValue(
          res[0].minDistance
        );
        this.DriverArrivalMinDistanceId = res[0].id;
      },

      error: (error: any) => {
        console.log(error);
      },
    });
  }
  getAllRequestsKMPrice() {
    this.priceService.getKMPrice().subscribe({
      next: (res: any) => {
        this.kmPriceForm.controls['price'].setValue(res[0].price);
        this.kmPriceId = res[0].id;
      },

      error: (error: any) => {
        console.log(error);
      },
    });
  }

  updateRequestDistanceLimit() {
    this.isLoading = true;

    let requestId = this.requestDistanceLimitId;
    this.requestDistanceLimit.patchValue({
      id: requestId,
    });
    let requestBody = this.requestDistanceLimit.value;

    this.priceService.updateRequestLimitDistance(requestBody).subscribe({
      next: (res: any) => {
        this.getAllRequestDistanceLimits();
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;

        // Check the language and display the error message accordingly
        let errorMessage = '';
        if (this.lang === 'En') {
          errorMessage =
            error.MesgEn?.non_field_errors?.[0] ||
            'An error occurred while updating the request distance limit';
        } else if (this.lang === 'Ar') {
          errorMessage =
            error.MesgAr || 'حدث خطأ أثناء تحديث الحد الأدنى لمسافة الطلب';
        }

        // Show error message in toastr
        this.toastr.error(errorMessage, 'Error');
      },
    });
  }

  updateSelectedrequestTimeLimit() {
    this.isLoading = true;

    let requestId = this.requestTimeLimitId;
    this.requestTimeLimitForm.patchValue({
      id: requestId,
    });
    let requestBody = this.requestTimeLimitForm.value;

    this.priceService.updateRequestTimeLimit(requestBody).subscribe({
      next: (res: any) => {
        this.getAllRequestTimeLimits();
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;

        // Check the language and display the error message accordingly
        let errorMessage = '';
        if (this.lang === 'En') {
          errorMessage =
            error.MesgEn?.non_field_errors?.[0] ||
            'An error occurred while updating the request time limit';
        } else if (this.lang === 'Ar') {
          errorMessage =
            error.MesgAr || 'حدث خطأ أثناء تحديث الحد الزمني للطلب';
        }

        // Show error message in toastr
        this.toastr.error(errorMessage, 'Error');
      },
    });
  }

  updateSelectedDriverArrivalMinDistance() {
    this.isLoading = true;
    let requestId = this.DriverArrivalMinDistanceId;
    this.DriverArrivalMinDistanceForm.patchValue({
      id: requestId,
    });
    let requestBody = this.DriverArrivalMinDistanceForm.value;

    this.priceService.updateDriverArrivalMinDistance(requestBody).subscribe({
      next: (res: any) => {
        this.getDriverArrivalMinDistance();
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;

        // Check the language and display the error message accordingly
        let errorMessage = '';
        if (this.lang === 'En') {
          errorMessage =
            error.MesgEn?.non_field_errors?.[0] ||
            'An error occurred while updating the driver arrival minimum distance';
        } else if (this.lang === 'Ar') {
          errorMessage =
            error.MesgAr || 'حدث خطأ أثناء تحديث الحد الأدنى لوصول السائق';
        }

        // Show error message in toastr
        this.toastr.error(errorMessage, 'Error');
      },
    });
  }

  initialiseForm() {
    this.kmPriceForm = this.fb.group({
      id: [null],
      price: [null, Validators.required],
    });
    this.taxiCounter = this.fb.group({
      id: [null],
      price: [null, Validators.required],
    });

    this.minimumFaresForm = this.fb.group({
      id: [null],
      minimumKm: [null, Validators.required],
      minimumFarePrice: [null, Validators.required],
      isKilometericMinimumFare: [null, Validators.required],
    });
    this.driverCommitionForm = this.fb.group({
      id: [null],
      tripCount: [null, Validators.required],
      percentage: [null, Validators.required],
      value: [null, Validators.required],
      isTrip: [null, Validators.required],
      isPercentage: [null, Validators.required],
      // isStatus: [null, Validators.required],
    });
    this.requestDistanceLimit = this.fb.group({
      id: [null],
      distanceLimit: [null, Validators.required],
    });
    this.DriverArrivalMinDistanceForm = this.fb.group({
      id: [null],
      minDistance: [null, Validators.required],
    });
    this.requestTimeLimitForm = this.fb.group({
      id: [null],
      time: [null, Validators.required],
      price: [null, Validators.required],
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required],
    });
    this.deductionsForm = this.fb.group({
      deductionsFormArray: this.fb.array([]),
    });
  }

  get deductionsFormArray(): FormArray {
    return this.deductionsForm.get('deductionsFormArray') as FormArray;
  }

  populateFormArray(deductions: any[]): void {
    deductions.forEach((deduction) => {
      const deductionGroup = new FormGroup({
        id: new FormControl(deduction.id || null),
        amount: new FormControl(deduction.amount || ''),
        isActive: new FormControl(deduction.isActive || false),
        isPercentage: new FormControl(deduction.isPercentage || false),
        nameAr: new FormControl(deduction.nameAr || ''),
        nameEn: new FormControl(deduction.nameEn || ''),
        percentage: new FormControl(deduction.percentage || ''),
      });

      this.deductionsFormArray.push(deductionGroup);
    });
  }

  getAllDeductions() {
    this.priceService.getDeductions().subscribe({
      next: (response: any) => {
        let deductionsResponse = [];
        deductionsResponse = response;
        this.populateFormArray(deductionsResponse);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  updateSelectedDeduction(index: any) {
    const selectedDeductionGroup = this.deductionsFormArray.at(index);
    if (selectedDeductionGroup) {
      this.isLoading = true;

      const requestBody = selectedDeductionGroup.value;

      this.priceService.updateDeductions(requestBody).subscribe({
        next: (res: any) => {
          window.location.reload();
          this.getAllDeductions();
          this.isLoading = false;
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Error updating deduction:', error);

          // Check the language and display the error message accordingly
          let errorMessage = '';
          if (this.lang === 'En') {
            errorMessage =
              error.MesgEn?.non_field_errors?.[0] ||
              'An error occurred while updating the deduction';
          } else if (this.lang === 'Ar') {
            errorMessage = error.MesgAr || 'حدث خطأ أثناء تحديث الخصم';
          }

          // Show error message in toastr
          this.toastr.error(errorMessage, 'Error');
        },
      });
    } else {
      console.error('Invalid deduction index:', index);
    }
  }

  updateKmPrice() {
    this.isLoading = true;

    let requestId = this.kmPriceId;
    this.kmPriceForm.patchValue({
      id: requestId,
    });
    let requestBody = this.kmPriceForm.value;

    this.priceService.updateKMPrice(requestBody).subscribe({
      next: (res: any) => {
        this.getAllRequestsKMPrice();
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Error updating KM price:', error);

        // Check the language and display the error message accordingly
        let errorMessage = '';
        if (this.lang === 'En') {
          errorMessage =
            error.MesgEn?.non_field_errors?.[0] ||
            'An error occurred while updating the KM price';
        } else if (this.lang === 'Ar') {
          errorMessage = error.MesgAr || 'حدث خطأ أثناء تحديث سعر الكيلومتر';
        }

        // Show error message in toastr
        this.toastr.error(errorMessage, 'Error');
      },
    });
  }

  taxiCounterFees() {
    let taxiCounterBody = {
      ...this.taxiCounter.value,
    };
    this.priceService.updateTaxiCounterFees(taxiCounterBody).subscribe({
      next: (res) => {
        // Handle success if needed
      },
      error: (err) => {
        console.error('Error updating taxi counter fees:', err);

        // Check the language and display the error message accordingly
        let errorMessage = '';
        if (this.lang === 'En') {
          errorMessage =
            err.MesgEn?.non_field_errors?.[0] ||
            'An error occurred while updating taxi counter fees';
        } else if (this.lang === 'Ar') {
          errorMessage = err.MesgAr || 'حدث خطأ أثناء تحديث رسوم العداد';
        }

        // Show error message in toastr
        this.toastr.error(errorMessage, 'Error');
      },
    });
  }

  getTaxiCounterFees() {
    console.log(this.taxiCounter.controls['price']);
    this.priceService.getTaxiCounterFees().subscribe({
      next: (res: any) => {
        this.taxiCounter.controls['price'].setValue(res[0].price);
        this.taxiCounter.controls['id'].setValue(res[0].id);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getAllMinimumFares() {
    this.priceService.getMinimumFares().subscribe({
      next: (res: any) => {
        this.minimumKMId = res[0].id;

        this.minimumFaresForm.patchValue({
          minimumKm: res[0].minimumKm,
          id: this.minimumKMId,
          minimumFarePrice: res[0].minimumFarePrice,
          isKilometericMinimumFare: res[0].isKilometericMinimumFare,
        });
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  getAllDriverCommitions() {
    this.priceService.getDriverCommition().subscribe({
      next: (res: any) => {
        this.driverCommitionId = res[0].id;

        this.driverCommitionForm.patchValue({
          id: this.driverCommitionId,
          tripCount: res[0].tripCount,
          percentage: res[0].percentage,
          value: res[0].value,
          isTrip: res[0].isTrip,
          isPercentage: res[0].isPercentage,
          // isStatus: res[0].isStatus,
        });
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  updateMiniFares() {
    this.isLoading = true;
    let requestBody = this.minimumFaresForm.value;
    this.priceService.updateMinimumFares(requestBody).subscribe({
      next: (res: any) => {
        this.getAllMinimumFares();
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Error updating minimum fares:', error);

        // Check the language and display the error message accordingly
        let errorMessage = '';
        if (this.lang === 'En') {
          errorMessage =
            error.MesgEn?.non_field_errors?.[0] ||
            'An error occurred while updating minimum fares';
        } else if (this.lang === 'Ar') {
          errorMessage = error.MesgAr || 'حدث خطأ أثناء تحديث الأسعار الدنيا';
        }

        // Show error message in toastr
        this.toastr.error(errorMessage, 'Error');
      },
    });
  }

  updateDriverCommition() {
    this.isLoading = true;
    let requestBody = this.driverCommitionForm.value;
    this.priceService.updateDriverCommition(requestBody).subscribe({
      next: (res: any) => {
        this.getAllDriverCommitions();
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Error updating driver commission:', error);

        // Check the language and display the error message accordingly
        let errorMessage = '';
        if (this.lang === 'En') {
          errorMessage =
            error.MesgEn?.non_field_errors?.[0] ||
            'An error occurred while updating driver commission';
        } else if (this.lang === 'Ar') {
          errorMessage = error.MesgAr || 'حدث خطأ أثناء تحديث عمولة السائق';
        }

        // Show error message in toastr
        this.toastr.error(errorMessage, 'Error');
      },
    });
  }
}
