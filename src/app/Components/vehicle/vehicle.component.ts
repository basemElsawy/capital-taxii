import { Component } from '@angular/core';
import { DriversService } from '../Drivers/Services/drivers.service';
import { VehicleService } from './Services/vehicle.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
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
  addUserForm!: FormGroup;
  nationalities: any[] = [];
  constructor(
    private vehilcesService: VehicleService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getAllDrivers();
  }

  getAllDrivers() {
    this.vehilcesService.getAllDrivers().subscribe({
      next: (res: any) => {
        this.driversData = res;
        console.log(res);
      },
      complete: () => {},
      error: (err) => {
        console.log(err);
      },
    });
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
    this.vehilcesService.getAllNationalities().subscribe({
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
  addVehicle() {}

  checkboxEvent(event: any) {}
}
