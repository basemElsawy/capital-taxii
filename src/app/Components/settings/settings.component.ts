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
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [NgbNavModule, FormsModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  active = 1;
  kmPriceForm!: FormGroup;
  minimumFaresForm!: FormGroup;
  requestDistanceLimit!: FormGroup;
  deductionsForm!: FormGroup;
  requestTimeLimitForm!: FormGroup;
  DriverArrivalMinDistanceForm!: FormGroup;
  requestDistanceLimitId: any;
  requestTimeLimitId: any;
  DriverArrivalMinDistanceId: any;

  kmPriceId: any;
  minimumKMId: any;
  isLoading: boolean = false;

  constructor(private priceService: PriceService, private fb: FormBuilder) {}

  ngOnInit() {
    this.initialiseForm();
    this.getAllRequestDistanceLimits();
    this.getAllRequestTimeLimits();
    this.getAllRequestsKMPrice();
    this.getAllMinimumFares();
    this.getAllDeductions();
    this.getDriverArrivalMinDistance();
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
        console.log(error);
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

        console.log(error);
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

        console.log(error);
      },
    });
  }
  initialiseForm() {
    this.kmPriceForm = this.fb.group({
      id: [null],
      price: [null, Validators.required],
    });
    this.minimumFaresForm = this.fb.group({
      id: [null],
      minimumKm: [null, Validators.required],
      minimumFarePrice: [null, Validators.required],
      isKilometericMinimumFare: [null, Validators.required],
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
        console.log(error);
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
        console.log(error);
      },
    });
  }
}
