import { CommonModule } from '@angular/common';
import { Component, signal, ViewChild } from '@angular/core';
import {
  GoogleMapsModule,
  MapInfoWindow,
  MapMarker,
  MapAdvancedMarker,
} from '@angular/google-maps';
import { TableModule } from 'primeng/table';
import { DriverDetails, Drivers, DriversMarkers } from './IMap';
import { MapServiceService } from './map-service.service';
import { VehicleService } from '../vehicle/Services/vehicle.service';
import { userInfo } from 'os';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    GoogleMapsModule,
    CommonModule,
    TableModule,
    MapMarker,
    MapInfoWindow,
    MapAdvancedMarker,
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;

  center!: google.maps.LatLngLiteral;
  zoom = 8;
  driverMarkers: any[] = [];
  driverDetails = signal([]);
  testArray: string[] = ['1', '2', '3', '4'];
  // allDrivers: any[] = [];
  allDrivers_Data: any = signal([]);
  address: any;
  selectedProducts: any;
  constructor(
    private vehicleServices: VehicleService,
    private mapService: MapServiceService
  ) {}
  ngOnInit(): void {
    this.getCurrentPosition();
    // this.getAllDrivers();
    this.getDriversOnMap();
    // setInterval(() => {
    // }, 1000);
  }

  getAllDrivers() {
    this.vehicleServices.getAllDrivers().subscribe({
      next: (res: any) => {
        // this.allDrivers = res.items;
        // console.log(this.allDrivers);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  // geocodingReverse() {
  //   this.mapService.reverseGeoCoding()
  // }
  addMarkerOnMap(driver: any, event: any) {
    let driverMarker = {
      userInfo: {
        name: driver.user.fullName,
        status: driver.status,
        image: driver.user.picture,
      },
      coords: {
        lat: driver.driver.locationLatitude,
        lng: driver.driver.locationLongitude,
      },
      icon: {
        url: '../../../assets/locationIcon.png',
        scaledSize: {
          width: 60,
          height: 60,
        },
      },
    };

    if (event.target.checked) {
      this.driverMarkers.push(driverMarker);
      return;
    }
    this.driverMarkers.splice(driver.id, 1);
    return;
  }

  getDriversOnMap() {
    this.mapService.getDriversOnTheMap(2).subscribe({
      next: (res: any): void => {
        this.allDrivers_Data.set(
          res.map((response: any) => ({ ...response, isChecked: false }))
        );

        let mappedResponse = res.map((responseItem: any): DriversMarkers => {
          const {
            driver: {
              id,
              locationLongitude: lng,
              locationLatitude: lat,
              user,
              fromLocation,
              toLocation,
            },
          } = responseItem;

          return {
            id,
            driverName: user.fullName || 'محمد صادق', // Use the name from the response or a fallback
            fromLocation: fromLocation,
            toLocation: toLocation,
            driverTitle: 'كابتن سائق',
            driverImage: user.picture || '../../../assets/unknown.png', // Use the picture from the response or a fallback
            coords: { lat, lng },
            icon: {
              url: '../../../assets/locationIcon.png',
              scaledSize: {
                width: 60,
                height: 60,
              },
            },
          };
        });

        // this.driverMarkers = mappedResponse;
        console.log(this.driverMarkers);
      },
      complete: () => {},
      error: (error: any) => {
        console.log(error.message);
      },
    });
  }

  getCurrentPosition() {
    this.mapService
      .getCurrentLocation()
      .then((res: any) => {
        let latitude = res.coords.latitude;
        let longitude = res.coords.longitude;
        this.center = { lat: latitude, lng: longitude };
      })
      .catch((err) => console.log(err));
  }
  checkboxEvent(event: any) {
    let isAllChecked = event.target.checked;
    let driverMarker;
    if (isAllChecked) {
      this.allDrivers_Data().forEach((item: any) => {
        item.isChecked = true;
        console.log(item);
        driverMarker = {
          userInfo: {
            name: item?.user.fullName,
            status: item.status,
            image: item.user.picture,
          },
          coords: {
            lat: item.driver.locationLatitude,
            lng: item.driver.locationLongitude,
          },
          icon: {
            url: '../../../assets/locationIcon.png',
            scaledSize: {
              width: 60,
              height: 60,
            },
          },
        };
        this.driverMarkers.push(item);
      });
      return;
    }
    this.allDrivers_Data().forEach((item: Drivers) => {
      item.isChecked = false;
      this.driverMarkers = [];
    });
  }
  getInfoWindow(marker: any, driver: any) {
    this.infoWindow.open(marker);
  }
  checkboxRowEvent(event: any, item: Drivers) {}

  get allDrivers() {
    return this.allDrivers_Data();
  }
}
