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
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [NgbNavModule, FormsModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  active = 1;
  kmPriceForm!: FormGroup;
  minimumFaresForm!: FormGroup;
  requestDistanceLimit!: FormGroup;
  deductionsForm!: FormGroup;
  requestDistanceLimitId: any;
  kmPriceId: any;
  minimumKMId: any;

  constructor(private priceService: PriceService, private fb: FormBuilder) {}

  ngOnInit() {
    this.initialiseForm();
    this.getAllRequestDistanceLimits();
    this.getAllRequestsKMPrice();
    this.getAllMinimumFares();
    this.getAllDeductions();
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
    let requestId = this.requestDistanceLimitId;
    this.requestDistanceLimit.patchValue({
      id: requestId,
    });
    let requestBody = this.requestDistanceLimit.value;

    this.priceService.updateRequestLimitDistance(requestBody).subscribe({
      next: (res: any) => {
        this.getAllRequestDistanceLimits();
      },
      error: (error: any) => {
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
      const requestBody = selectedDeductionGroup.value;

      this.priceService.updateDeductions(requestBody).subscribe({
        next: (res: any) => {
          window.location.reload();
          this.getAllDeductions();
        },
        error: (error: any) => {
          console.error('Error updating deduction:', error);
        },
      });
    } else {
      console.error('Invalid deduction index:', index);
    }
  }

  updateKmPrice() {
    let requestId = this.kmPriceId;
    this.kmPriceForm.patchValue({
      id: requestId,
    });
    let requestBody = this.kmPriceForm.value;

    this.priceService.updateKMPrice(requestBody).subscribe({
      next: (res: any) => {
        this.getAllRequestsKMPrice();
      },

      error: (error: any) => {
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
    let requestBody = this.minimumFaresForm.value;

    this.priceService.updateMinimumFares(requestBody).subscribe({
      next: (res: any) => {
        this.getAllMinimumFares();
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
}