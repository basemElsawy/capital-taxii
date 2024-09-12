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
@Component({
  selector: 'app-stations',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SpinnerComponent,
    TooltipModule,
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
  constructor(
    private stationsService: StationsService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getStations();
    this.initializeStationsForm();
    this.getAllZones();
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
      },
      error: (error: any) => {
        console.log(error);
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
      },
      error: (error: any) => {
        console.log(error);
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
