import { map } from 'rxjs';
import { Component } from '@angular/core';
import { DriversService } from '../Drivers/Services/drivers.service';
import { VehicleService } from './Services/vehicle.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss',
})
export class VehicleComponent {
  driversData: any[] = [];
  addVehicleForm!: FormGroup;
  addDriverVehicleForm!: FormGroup;
  nationalities: any[] = [];
  vehicleSpecifications: any[] = [];
  vehicleTypes: any[] = [];
  fuelTypes: any[] = [];
  vehicleOwnerShips: any[] = [];
  vehicleLifeCycles: any[] = [];
  vehicleStatus: any[] = [];
  vehicleFianancials: any[] = [];
  vehicleBrands: any[] = [];
  vehicleBody: any[] = [];
  Drivers: any[] = [];
  choosedVehicle: any;
  constructor(
    private vehilcesService: VehicleService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getAllVehicles();
    this.getAllVehicleSpecifications();
    this.initialiseVehicleForm();
    this.getAllVehiclesTypes();
    this.getAllFuelTypes();
    this.getAllVehiclesOwner();
    this.getAllVehiclesLifeCycle();
    this.getAllVehicleStatus();
    this.getVehicleFinancial();
    this.getAllVehicleBrand();
    this.getAllVehicleBody();
    this.getAllDrivers();
  }

  initialiseVehicleForm() {
    this.addVehicleForm = this.fb.group({
      vehicleName: [null, Validators.required],
      year: [null, Validators.required],
      photo: [''],
      vehicleColor: [null, Validators.required],
      vehicleSpecificationId: [null, Validators.required],
      vehicleTypeId: [null, Validators.required],
      fuelTypeId: [null, Validators.required],
      vehicleOwnershipId: [null, Validators.required],
      vehicleLifeCycleId: [null, Validators.required],
      vehicleStatusId: [null, Validators.required],
      vehicleFinancialId: [null, Validators.required],
      vehicleBrandId: [null, Validators.required],
      vehicleBodyTypeId: [null, Validators.required],
    });

    this.addDriverVehicleForm = this.fb.group({
      expiryDate: [null, Validators.required],
      driverId: [null, Validators.required],
      vehicleId: [null, Validators.required],
    });
  }

  getAllVehicles() {
    this.vehilcesService.getAllVehicles().subscribe({
      next: (res: any) => {
        this.driversData = res;
      },
      complete: () => {},
      error: (err) => {
        console.log(err);
      },
    });
  }

  getAllDrivers() {
    this.vehilcesService.getAllDrivers().subscribe({
      next: (res: any) => {
        debugger;
        this.Drivers = res.items;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  getAllVehicleBrand() {
    this.vehilcesService.getVehicleBrand().subscribe({
      next: (res: any) => {
        this.vehicleBrands = res;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  getAllVehicleBody() {
    this.vehilcesService.getVehicleBody().subscribe({
      next: (res: any) => {
        this.vehicleBody = res;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  getAllVehicleStatus() {
    this.vehilcesService.getVehicleStatus().subscribe({
      next: (res: any) => {
        this.vehicleStatus = res;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  openDriverModal(content: any, selectedVehicle: any) {
    this.choosedVehicle = selectedVehicle;
    this.modalService.open(content, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
      scrollable: true,
    });
  }

  getVehicleFinancial() {
    this.vehilcesService.getVehicleFinancial().subscribe({
      next: (res: any) => {
        this.vehicleFianancials = res;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  getAllVehiclesLifeCycle() {
    this.vehilcesService.getVehicleLifeCycle().subscribe({
      next: (res: any) => {
        this.vehicleLifeCycles = res;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  getAllVehiclesOwner() {
    this.vehilcesService.getVehicleOwnerShips().subscribe({
      next: (res: any) => {
        this.vehicleOwnerShips = res;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  openAddModal(content: any) {
    this.modalService.open(content, {
      size: 'xl',
      backdrop: 'static',
      centered: true,
      scrollable: true,
    });
    this.getAllNationalities();
  }
  getAllNationalities() {
    this.vehilcesService.getAllNationalities().subscribe({
      next: (res: any) => {
        this.nationalities = res;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  getAllVehicleSpecifications() {
    this.vehilcesService.getAllVehicleSpecification().subscribe({
      next: (res: any) => {
        this.vehicleSpecifications = res;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  getAllVehiclesTypes() {
    this.vehilcesService.getAllVehicleTypes().subscribe({
      next: (res: any) => {
        this.vehicleTypes = res;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  getAllFuelTypes() {
    this.vehilcesService.getAllFuelTypes().subscribe({
      next: (res: any) => {
        this.fuelTypes = res;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  closeModal() {
    this.modalService.dismissAll();
  }
  addVehicle() {
    let addNewVehicleBody = this.addVehicleForm.value;
    this.vehilcesService.addNewVehicle(addNewVehicleBody).subscribe({
      next: (res: any) => {
        this.getAllVehicles();
        this.modalService.dismissAll();
        this.addVehicleForm.reset();
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  addDriver() {
    this.addDriverVehicleForm.patchValue({
      vehicleId: this.choosedVehicle.res.id,
    });
    let driverVehicleBody = this.addDriverVehicleForm.value;
    this.vehilcesService.addNewDriverForVehicle(driverVehicleBody).subscribe({
      next: (res: any) => {
        this.modalService.dismissAll();
        this.getAllVehicles();
        this.addDriverVehicleForm.reset();
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  checkboxEvent(event: any) {}
}
