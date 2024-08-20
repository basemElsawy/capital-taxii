import { Component } from '@angular/core';
import { DriversService } from '../Drivers/Services/drivers.service';
import { VehicleService } from './Services/vehicle.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss',
})
export class VehicleComponent {
  driversData: any[] = [];
  constructor(private vehilcesService: VehicleService) {}

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

  checkboxEvent(event: any) {}
}
