import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { DriverDetails, Drivers, DriversMarkers } from '../map/IMap';
import { CommonModule } from '@angular/common';
import { DriversService } from './Services/drivers.service';
import { Coords } from './IDrivers';
import { firstValueFrom } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-Drivers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './Drivers.component.html',
  styleUrls: ['./Drivers.component.scss'],
})
export class DriversComponent implements OnInit {
  // driverMarkers: any;
  driversData: any = {};
  currentLocationAddress: string = '';
  coordsCollection: any[] = [];
  isLoading: any = signal(true);
  addUserForm!: FormGroup;
  nationalities: any[] = [];

  constructor(
    private driversService: DriversService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {}
  ngOnInit(): void {
    this.getAllDrivers();
    this.initAddUserForm();
  }

  initAddUserForm(): void {
    this.addUserForm = this.fb.group({
      email: [null, Validators.required],
      fullName: [null, Validators.required],
      phoneNumber: [null, Validators.required],
      genderId: [null, Validators.required],
      nationalityId: [null, Validators.required],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required],
      birthDate: [null, Validators.required],
    });
  }

  getAllDrivers() {
    this.driversService.getAllDrivers().subscribe({
      next: (res: any) => {
        this.driversData = res;
        console.log(this.driversData);
      },
      complete: () => {
        this.addressExtractor();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  addressExtractor() {
    if (this.driversData?.items.length) {
      this.driversData.items.forEach((item: any) => {
        let coords: Coords = {
          lat: item.res.locationLatitude,
          lng: item.res.locationLongitude,
        };
        this.driversService.gettingLocationAddress(
          coords,
          this.coordsCollection
        );
      });
      this.isLoading.set(false);
    }
  }
  openAddModal(content: any) {
    this.modalService.open(content, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
    });
    this.getAllNationalities();
  }
  getAllNationalities() {
    this.driversService.getAllNationalities().subscribe({
      next: (res: any) => {
        this.nationalities = res;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  closeModal() {
    this.modalService.dismissAll();
  }

  addDrivers() {}

  checkboxEvent(event: any) {
    console.log(event.target.checked);
    if (this.driversData.items.length) {
      this.driversData.items.forEach((item: any) => {
        item.isChecked = event.target.checked;
      });
    }
  }
}
