import { Component } from '@angular/core';
import { StationsService } from './Services/stations.service';
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
  selector: 'app-stations',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SpinnerComponent,
    TooltipModule,
    TranslateModule,
  ],
  templateUrl: './stations.component.html',
  styleUrl: './stations.component.scss',
})
export class StationsComponent {
  stations: any[] = [];
  addStationForm!: FormGroup;
  updateStationForm!: FormGroup;
  addDriverVehicleForm!: FormGroup;
  choosedStation: any;
  isLoading: boolean = false;
  zones: any[] = [];
  lang!: string;
  constructor(
    private stationsService: StationsService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private translate: TranslateService,
    private translation: TranslationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getStations();
    this.initializeStationsForm();
    this.getAllZones();
    this.languageSetter();
  }

  languageSetter() {
    if (!this.lang) {
      this.lang = this.translate.currentLang;
    }
    this.translation.getLanguage.subscribe((val: string) => {
      this.lang = val;
    });
  }

  initializeStationsForm() {
    this.addStationForm = this.fb.group({
      nameEn: [null, Validators.required],
      nameAr: [null, Validators.required],
      locationLatitude: [null, Validators.required],
      locationLongitude: [null, Validators.required],
      zoneId: [null, Validators.required],
    });
    this.updateStationForm = this.fb.group({
      id: [null, Validators.required],
      nameEn: [null, Validators.required],
      nameAr: [null, Validators.required],
      locationLatitude: [null, Validators.required],
      locationLongitude: [null, Validators.required],
      zoneId: [null, Validators.required],
    });
  }

  // openDriverModal(content: any, selectedVehicle: any) {
  //   this.choosedVehicle = selectedVehicle;
  //   this.modalService.open(content, {
  //     size: 'xl',
  //     backdrop: 'static',
  //     centered: true,
  //     scrollable: true,
  //   });
  // }
  openUpdateStationModal(content: any, selectedStation: any) {
    this.choosedStation = selectedStation;
    this.setStationDataInUpdateForm(selectedStation);
    this.modalService.open(content, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
      scrollable: true,
    });
  }
  setStationDataInUpdateForm(selectedStation: any) {
    this.updateStationForm.patchValue({
      id: selectedStation.id,
      nameEn: selectedStation.nameEn,
      nameAr: selectedStation.nameAr,
      locationLatitude: selectedStation.locationLatitude,
      locationLongitude: selectedStation.locationLatitude,
      zoneId: selectedStation.zone.id,
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

  getStations() {
    this.stationsService.getAllStations().subscribe((data: any) => {
      this.stations = data;
    });
  }

  addStation() {
    let body = this.addStationForm.value;
    this.stationsService.addNewStation(body).subscribe({
      next: (res: any) => {
        this.getStations();
        this.modalService.dismissAll();
        this.addStationForm.reset();
        this.toastr.success('Station added successfully!', 'Success'); // Show success message
      },
      error: (error: any) => {
        console.error('Error adding station:', error);

        // Prepare error message based on the selected language
        let errorMessage = '';
        if (this.lang === 'En') {
          errorMessage =
            error.MesgEn?.non_field_errors?.[0] ||
            'An error occurred while adding the station.';
        } else if (this.lang === 'Ar') {
          errorMessage = error.MesgAr || 'حدث خطأ أثناء إضافة المحطة.';
        }

        // Show error message in toastr
        this.toastr.error(errorMessage, 'Error');
      },
    });
  }

  updateStation() {
    let body = this.updateStationForm.value;
    this.stationsService.updateStation(body).subscribe({
      next: (res: any) => {
        this.getStations();
        this.modalService.dismissAll();
        this.updateStationForm.reset();
        this.toastr.success('Station updated successfully!', 'Success'); // Show success message
      },
      error: (error: any) => {
        console.error('Error updating station:', error);

        // Prepare error message based on the selected language
        let errorMessage = '';
        if (this.lang === 'En') {
          errorMessage =
            error.MesgEn?.non_field_errors?.[0] ||
            'An error occurred while updating the station.';
        } else if (this.lang === 'Ar') {
          errorMessage = error.MesgAr || 'حدث خطأ أثناء تحديث المحطة.';
        }

        // Show error message in toastr
        this.toastr.error(errorMessage, 'Error');
      },
    });
  }

  getAllZones() {
    this.stationsService.getAllZones().subscribe((res: any) => {
      this.zones = res;
    });
  }
  checkboxEvent(event: any) {}
}
