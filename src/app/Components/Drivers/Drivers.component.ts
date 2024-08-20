import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { DriverDetails, Drivers, DriversMarkers } from '../map/IMap';
import { CommonModule } from '@angular/common';
import { DriversService } from './Services/drivers.service';
import { Coords } from './IDrivers';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-Drivers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './Drivers.component.html',
  styleUrls: ['./Drivers.component.scss'],
})
export class DriversComponent implements OnInit {
  // driverMarkers: any;
  driversData: any = {};
  constructor(private driversService: DriversService) {}
  currentLocationAddress: string = '';
  coordsCollection: any[] = [];
  isLoading: any = signal(true);
  ngOnInit(): void {
    this.getAllDrivers();
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
  checkboxEvent(event: any) {
    console.log(event.target.checked);
    if (this.driversData.items.length) {
      this.driversData.items.forEach((item: any) => {
        item.isChecked = event.target.checked;
      });
    }
  }
}
