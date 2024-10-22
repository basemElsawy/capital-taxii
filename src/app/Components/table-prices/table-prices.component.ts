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
import { ToastrService } from 'ngx-toastr';
import { error, table } from 'console';
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
  updateTablePriceDetailsForm!: FormGroup;

  choosedStation: any;
  stations: any;
  isLoading: boolean = false;
  lang!: string;
  selectedTablePrice: any;
  tablePricesDetails: any;
  vehicleServiceTypes: any[] = [];
  isPriceTableDetailsUpdated: boolean = false;
  updatePriceTableForm!: FormGroup;
  editingIndex!: number;
  todayDate: any; /*************  ✨ Codeium Command ⭐  *************/
  /**
   * @param tablePricesService The service that provides the table prices data.
   * @param modalService The service that provides modal functionality.
   * @param fb The form builder service.
   * @param translate The translate service.
   * @param translationService The translation service.
   * @param toastr The toastr service.
   */
  /******  13bb8016-66c0-43cd-bff3-8a21de1a00d9  *******/
  constructor(
    private tablePricesService: TablePricesService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private translate: TranslateService,
    private translationService: TranslationService,
    private toastr: ToastrService
  ) {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    this.todayDate = `${year}-${month}-${day}`;
  }

  ngOnInit(): void {
    this.initializeTablePriceForm();
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

  initializeTablePriceForm() {
    this.addTablePriceForm = this.fb.group({
      nameEn: [null, Validators.required],
      nameAr: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
    });
    this.updateTablePriceDetailsForm = this.fb.group({
      price: [null],
      vehicleServiceTypeId: [null],
    });
    this.updatePriceTableForm = this.fb.group({
      id: [null, Validators.required],
      nameEn: [null, Validators.required],
      nameAr: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
    });
    this.updatePriceTableForm.controls['startDate'].disable();
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
        console.error('Error adding new table price:', error);

        // Check the language and display the error message accordingly
        let errorMessage = '';
        if (this.lang === 'En') {
          errorMessage =
            error.MesgEn?.non_field_errors?.[0] ||
            'An error occurred while adding the new table price';
        } else if (this.lang === 'Ar') {
          errorMessage =
            error.MesgAr || 'حدث خطأ أثناء إضافة السعر الجديد للطاولة';
        }

        // Show error message in toastr
        this.toastr.error(errorMessage, 'Error');
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
        this.getAllTablePricsDetailsById(this.selectedTablePrice.id);
        this.modalService.dismissAll();
        this.addTablePriceDetailsForm.reset();
      },
      error: (error: any) => {
        console.error('Error adding table price details:', error);

        // Check the language and display the error message accordingly
        let errorMessage = '';
        if (this.lang === 'En') {
          errorMessage =
            error.MesgEn?.non_field_errors?.[0] ||
            'An error occurred while adding table price details';
        } else if (this.lang === 'Ar') {
          errorMessage =
            error.MesgAr || 'حدث خطأ أثناء إضافة تفاصيل سعر الطاولة';
        }

        // Show error message in toastr
        this.toastr.error(errorMessage, 'Error');
      },
    });
  }

  getAllTablePricsDetailsById(tablePriceId: any) {
    this.tablePricesService
      .getAllTablePricsDetailsById(tablePriceId)
      .subscribe((data: any) => {
        this.tablePricesDetails = data[0].kilometrePriceDetails;
        console.log(data);
      });
  }
  getAllVehicleServiceType() {
    this.tablePricesService
      .getAllVehicleServiceType()
      .subscribe((data: any) => {
        this.vehicleServiceTypes = data;
      });
  }
  editPriceTableDetails(priceTableDetails: any, index: number) {
    this.isPriceTableDetailsUpdated = true;
    this.editingIndex = index;
    this.updateTablePriceDetailsForm.controls['price'].setValue(
      priceTableDetails.price
    );
    this.updateTablePriceDetailsForm.controls['vehicleServiceTypeId'].setValue(
      priceTableDetails.vehicleServiceType.id
    );
  }
  updatePriceTableDetails(tablePriceDetails: any) {
    const body = {
      id: tablePriceDetails?.id,
      kilometrePriceId: tablePriceDetails.kilometrePrice?.id,
      ...this.updateTablePriceDetailsForm.value,
    };
    this.tablePricesService.updateTablePriceDetails(body).subscribe(
      () => {
        this.getAllTablePricsDetailsById(tablePriceDetails.kilometrePrice?.id);
        this.isPriceTableDetailsUpdated = false;
      },
      (error) => {
        this.toastr.error(
          this.lang === 'En'
            ? 'An error occurred while updating the table price details'
            : 'حدث خطأ أثناء تحديث تفاصيل سعر الجدول'
        );
      }
    );
  }
  checkboxEvent(event: any) {}

  editSelectedTablePrice(content: any, selectedTablePrice: any) {
    debugger;
    this.modalService.open(content, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
      scrollable: true,
    });
    this.selectedTablePrice = selectedTablePrice;
    this.setDataForSelectedPriceTable(selectedTablePrice);
  }

  setDataForSelectedPriceTable(priceTable: any) {
    debugger;
    this.updatePriceTableForm.patchValue({
      id: priceTable.id,
      startDate: priceTable.startDate,
      endDate: priceTable.endDate,
      nameAr: priceTable.nameAr,
      nameEn: priceTable.nameEn,
    });
  }

  confirmUpdateTablePrice() {
    // this.tablePricesService
    //   .updateTablePrice(this.selectedTablePrice)
    //   .subscribe(() => {
    //     this.getPricesTables();
    //     this.modalService.dismissAll();
    //   });
  }
}
