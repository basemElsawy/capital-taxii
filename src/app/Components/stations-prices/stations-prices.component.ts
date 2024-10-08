import { Component } from '@angular/core';
import { StationsService } from './Services/stationsPrices.service';
import { CommonModule } from '@angular/common';
import {
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
import { ToastrService } from 'ngx-toastr';
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
  templateUrl: './stations-prices.component.html',
  styleUrl: './stations-prices.component.scss',
})
export class StationsPricesComponent {
  stationsPrices: any[] = [];
  addStationPriceForm!: FormGroup;
  updateStationPriceForm!: FormGroup;
  addDriverVehicleForm!: FormGroup;
  choosedStation: any;
  stations: any;
  isLoading: boolean = false;
  lang!: string;
  constructor(
    private stationsService: StationsService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private translate: TranslateService,
    private translationService: TranslationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getStationsPrices();
    this.getStations();
    this.initializeStationsPricesForm();
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

  initializeStationsPricesForm() {
    this.addStationPriceForm = this.fb.group({
      fromStationId: [null, Validators.required],
      toStationId: [null, Validators.required],
      price: [null, Validators.required],
    });
    this.updateStationPriceForm = this.fb.group({
      id: [null, Validators.required],
      fromStationId: [null, Validators.required],
      toStationId: [null, Validators.required],
      price: [null, Validators.required],
    });
  }

  openUpdateStationPriceModal(content: any, selectedStation: any) {
    this.choosedStation = selectedStation;
    this.setStationDataInUpdateForm(selectedStation);
    this.modalService.open(content, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
      scrollable: true,
    });
  }
  setStationDataInUpdateForm(selectedStationPrice: any) {
    this.updateStationPriceForm.patchValue({
      id: selectedStationPrice.id,
      fromStationId: selectedStationPrice.fromStationId,
      toStationId: selectedStationPrice.toStationId,
      price: selectedStationPrice.price,
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

  getStationsPrices() {
    this.stationsService.getAllStationPrices().subscribe((data: any) => {
      this.stationsPrices = data;
    });
  }

  addStationPrice() {
    let body = this.addStationPriceForm.value;
    this.stationsService.addNewStationPrice(body).subscribe({
      next: (res: any) => {
        this.getStationsPrices();
        this.modalService.dismissAll();
        this.addStationPriceForm.reset();
      },
      error: (error: any) => {
        console.error('Error adding station price:', error);

        // Check the language and display the error message accordingly
        let errorMessage = '';
        if (this.lang === 'En') {
          errorMessage =
            error.MesgEn?.non_field_errors?.[0] ||
            'An error occurred while adding the station price';
        } else if (this.lang === 'Ar') {
          errorMessage = error.MesgAr || 'حدث خطأ أثناء إضافة سعر المحطة';
        }

        // Show error message in toastr
        this.toastr.error(errorMessage, 'Error');
      },
    });
  }

  updateStationPrice() {
    let body = this.updateStationPriceForm.value;
    this.stationsService.updateStationPrice(body).subscribe({
      next: (res: any) => {
        this.getStationsPrices();
        this.modalService.dismissAll();
        this.updateStationPriceForm.reset();
      },
      error: (error: any) => {
        console.error('Error updating station price:', error);

        // Check the language and display the error message accordingly
        let errorMessage = '';
        if (this.lang === 'En') {
          errorMessage =
            error.MesgEn?.non_field_errors?.[0] ||
            'An error occurred while updating the station price';
        } else if (this.lang === 'Ar') {
          errorMessage = error.MesgAr || 'حدث خطأ أثناء تحديث سعر المحطة';
        }

        // Show error message in toastr
        this.toastr.error(errorMessage, 'Error');
      },
    });
  }

  getStations() {
    this.stationsService.getAllStations().subscribe((data: any) => {
      this.stations = data;
    });
  }
  checkboxEvent(event: any) {}
}
