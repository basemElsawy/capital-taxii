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
import { environment } from '../../../environments/environment.development';
import { MultiSelectModule } from 'primeng/multiselect';
import { forkJoin } from 'rxjs';
import { ShiftsComponent } from '../shifts/shifts.component';
import { PromoCodeService } from './services/promo-code.service';
import { ToastrService } from 'ngx-toastr';
import { SearchFilterPipe } from '../../shared-ui/pipes/search-filter.pipe';
@Component({
  selector: 'app-promo-code',
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
    SearchFilterPipe,
  ],
  templateUrl: './promo-code.component.html',
  styleUrls: ['./promo-code.component.scss'],
})
export class PromoCodeComponent implements OnInit {
  active = 1;
  lang!: string;
  isLoading: boolean = false;
  addPromoCodeForm!: FormGroup;
  updatePromoCodeForm!: FormGroup;
  activePromoCodes: any[] = [];
  inActivePromoCodes: any[] = [];
  expiryPromoCodes: any[] = [];
  searchInput: string = '';
  constructor(
    private promoCodeService: PromoCodeService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private translation: TranslationService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {}
  ngOnInit() {
    this.setLanguage();
    this.initialiseForm();
    this.languageSetter();
    this.getAllActivePromoCodes();
    this.getAllInActivePromoCodes();
    this.getAllExpiryPromoCodes();
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
  initialiseForm() {
    this.addPromoCodeForm = this.fb.group({
      value: [null, Validators.required],
      startDate: [null, Validators.required],
      expiryDate: [null, Validators.required],
      isPercentage: [false, Validators.required],
      percentage: [null, Validators.required],
      numOfUsages: [null, Validators.required],
      isCompletedTrips: [false, Validators.required],
      numOfTrips: [null, Validators.required],
      active: [false, Validators.required],
      note: [null],
    });
    this.updatePromoCodeForm = this.fb.group({
      id: [null],
      value: [null, Validators.required],
      startDate: [null, Validators.required],
      expiryDate: [null, Validators.required],
      isPercentage: [false, Validators.required],
      percentage: [null, Validators.required],
      numOfUsages: [null, Validators.required],
      isCompletedTrips: [false, Validators.required],
      numOfTrips: [null, Validators.required],
      active: [false, Validators.required],
      note: [null],
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
  openUpdateModal(content: any, selectedPromoCode: any) {
    this.setPromoCodeDataInUpdateForm(selectedPromoCode);
    this.modalService.open(content, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
      scrollable: true,
    });
  }
  setPromoCodeDataInUpdateForm(selectedPromoCode: any) {
    this.updatePromoCodeForm.patchValue({
      id: selectedPromoCode.id,
      value: selectedPromoCode.value,
      startDate: selectedPromoCode.startDate,
      expiryDate: selectedPromoCode.expiryDate,
      isPercentage: selectedPromoCode.isPercentage,
      percentage: selectedPromoCode.percentage,
      numOfUsages: selectedPromoCode.numOfUsages,
      isCompletedTrips: selectedPromoCode.isCompletedTrips,
      numOfTrips: selectedPromoCode.numOfTrips,
      active: selectedPromoCode.active,
      note: selectedPromoCode.note,
    });
  }
  addPromoCode() {
    const promoCodeBody = this.addPromoCodeForm.value;
    this.promoCodeService.addPromoCode(promoCodeBody).subscribe({
      next: (res: any) => {
        this.modalService.dismissAll();
        this.addPromoCodeForm.reset();
        this.getAllActivePromoCodes();
        this.getAllInActivePromoCodes();
        this.getAllExpiryPromoCodes();
      },
      error: (error: any) => {
        // Custom error message
        const customErrorMessage =
          this.lang === 'En'
            ? 'Failed to add promo code. Please check your input.'
            : 'فشل إضافة كود الخصم. يرجى التحقق من مدخلاتك.';

        // Check for specific error messages
        const errorMessage =
          error?.MesgEn?.non_field_errors?.[0] ||
          error?.MesgAr ||
          customErrorMessage;
        this.toastr.error(errorMessage, 'Error'); // Show error toast
        console.log(error);
      },
    });
  }

  updatePromoCode() {
    const body = this.updatePromoCodeForm.value;
    this.promoCodeService.updatePromoCode(body).subscribe({
      next: () => {
        this.modalService.dismissAll();
        this.updatePromoCodeForm.reset();
        this.getAllActivePromoCodes();
        this.getAllInActivePromoCodes();
        this.getAllExpiryPromoCodes();
      },
      error: (err) => {
        // Custom error message
        const customErrorMessage =
          this.lang === 'En'
            ? 'Failed to update promo code. Please check your input.'
            : 'فشل تحديث كود الخصم. يرجى التحقق من مدخلاتك.';

        // Check for specific error messages
        const errorMessage =
          err?.MesgEn?.non_field_errors?.[0] ||
          err?.MesgAr ||
          customErrorMessage;
        this.toastr.error(errorMessage, 'Error'); // Show error toast
        console.error('Error updating promo code:', err);
      },
    });
  }
  getAllActivePromoCodes() {
    this.promoCodeService.getActivePromoCodes().subscribe({
      next: (res: any) => {
        this.activePromoCodes = res;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  getAllInActivePromoCodes() {
    this.promoCodeService.getInActivePromoCodes().subscribe({
      next: (res: any) => {
        this.inActivePromoCodes = res;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  getAllExpiryPromoCodes() {
    this.promoCodeService.getExpiryPromoCodes().subscribe({
      next: (res: any) => {
        this.expiryPromoCodes = res;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  closeModal() {
    this.modalService.dismissAll();
  }
}
