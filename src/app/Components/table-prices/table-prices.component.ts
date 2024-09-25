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
import { TablePricesService } from './Services/table-prices.service';
@Component({
  selector: 'app-price-tables',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SpinnerComponent,
    TooltipModule,
    TranslateModule,
  ],
  templateUrl: './table-prices.component.html',
  styleUrl: './table-prices.component.scss',
})
export class TablePricesComponent {
  tablePrices: any[] = [];
  addTablePriceForm!: FormGroup;
  addTablePriceDetailsForm!: FormGroup;
  addDriverVehicleForm!: FormGroup;
  choosedStation: any;
  stations: any;
  isLoading: boolean = false;
  lang!: string;
  selectedTablePrice: any;
  tablePricesDetails: any;
  vehicleServiceTypes: any[] = [];
  constructor(
    private tablePricesService: TablePricesService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private translate: TranslateService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.initializeStationsPricesForm();
    this.initializeForm();
    this.getPricesTables();
    this.getAllVehicleServiceType();
    this.addPriceDetails();
    // this.getStations();

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
    this.addTablePriceForm = this.fb.group({
      nameEn: [null, Validators.required],
      nameAr: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
    });
  }
  initializeForm() {
    this.addTablePriceDetailsForm = this.fb.group({
      kilometrePriceDetailsDtos: this.fb.array([this.newPriceDetails()]), // Initialize with one entry
    });
  }
  // Getter for the form array
  get tableDetails(): FormArray {
    return this.addTablePriceDetailsForm.get(
      'kilometrePriceDetailsDtos'
    ) as FormArray;
  }

  // Function to create a new form group for each entry
  newPriceDetails(): FormGroup {
    return this.fb.group({
      price: [null, Validators.required],
      vehicleServiceTypeId: [null, Validators.required],
    });
  }

  // Add new entry to the FormArray
  addPriceDetails() {
    this.tableDetails.push(this.newPriceDetails());
  }
  openUpdateTablePricesModal(content: any, tablePrice: any) {
    this.initializeForm();

    // this.setStationDataInUpdateForm(tablePrice);
    this.selectedTablePrice = tablePrice;
    this.tablePricesDetails = [];
    this.getAllTablePricsDetailsById(this.selectedTablePrice.id);
    this.modalService.open(content, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
      scrollable: true,
    });
  }
  setStationDataInUpdateForm(selectedStationPrice: any) {
    this.addTablePriceDetailsForm.patchValue({
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

  getPricesTables() {
    this.tablePricesService.getAllTablePrices().subscribe((data: any) => {
      this.tablePrices = data;
    });
  }

  addNewTablePrice() {
    let body = this.addTablePriceForm.value;
    this.tablePricesService.addNewTablePrice(body).subscribe({
      next: (res: any) => {
        this.getPricesTables();
        this.modalService.dismissAll();
        this.addTablePriceForm.reset();
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  addTablePriceDetails() {
    let body = {
      ...this.addTablePriceDetailsForm.value,
      kilometrePriceId: this.selectedTablePrice.id,
    };
    this.tablePricesService.addTablePriceDetails(body).subscribe({
      next: (res: any) => {
        debugger;
        this.getAllTablePricsDetailsById(this.selectedTablePrice.id);
        this.modalService.dismissAll();
        this.addTablePriceDetailsForm.reset();
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  getAllTablePricsDetailsById(tablePriceId: any) {
    this.tablePricesService
      .getAllTablePricsDetailsById(tablePriceId)
      .subscribe((data: any) => {
        this.tablePricesDetails = data[0].kilometrePriceDetails;
      });
  }
  getAllVehicleServiceType() {
    this.tablePricesService
      .getAllVehicleServiceType()
      .subscribe((data: any) => {
        this.vehicleServiceTypes = data;
      });
  }
  checkboxEvent(event: any) {}
}
