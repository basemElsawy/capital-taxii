import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import {
  GoogleMapsModule,
  MapInfoWindow,
  MapMarker,
  MapAdvancedMarker,
} from '@angular/google-maps';
import { TableModule } from 'primeng/table';
import { Drivers } from './IMap';
import { MapServiceService } from './map-service.service';
import { VehicleService } from '../vehicle/Services/vehicle.service';
import { environment } from '../../../environments/environment.development';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../Core/Services/translation.service';
import { ToastrService } from 'ngx-toastr';

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
    TranslateModule,
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnInit, OnDestroy {
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  center!: google.maps.LatLngLiteral;
  zoom = 8;
  driverMarkers: any[] = [];
  lang!: string;
  driverDetails = signal([]);
  testArray: string[] = ['1', '2', '3', '4'];
  // allDrivers: any[] = [];
  allDrivers_Data: any = signal([]);
  address: any;
  selectedProducts: any;
  selectedDriver: any = null; // To hold the selected driver data
  public readonly imgUrl = environment.image;
  private intervalId: any;

  event = {
    target: {
      checked: true,
    },
  };
  constructor(
    private vehicleServices: VehicleService,
    private mapService: MapServiceService,
    private translate: TranslateService,
    private translationService: TranslationService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.getCurrentPosition();
    this.getDriversOnMap();

    this.languageSetter();

    this.intervalId = setInterval(() => {
      this.getDriversOnMap();

      this.refreshDriverMarkers();
    }, 5000);
  }
  // Function to handle mouseover event
  showDriverInfo(infoWindow: MapInfoWindow, marker: MapMarker, driver: any) {
    this.selectedDriver = driver;
    console.log(driver);
    infoWindow.open(marker); // Open the info window associated with the marker
  }

  // Function to handle mouseout event
  hideDriverInfo(infoWindow: MapInfoWindow) {
    this.selectedDriver = null;
    infoWindow.close(); // Close the info window
  }

  // Function to track drivers by their IDs
  trackByDriverId(index: number, driver: any) {
    return driver.id;
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

  languageSetter() {
    if (!this.lang) {
      this.lang = this.translate.currentLang;
    }
    this.translationService.getLanguage.subscribe((val: string) => {
      this.lang = val;
    });
  }
  // geocodingReverse() {
  //   this.mapService.reverseGeoCoding()
  // }
  addMarkerOnMap(driver: any, event: any) {
    let driverMarker = {
      userInfo: {
        name: driver.user.fullName,
        status: driver.driver.status,
        image: driver.user.picture,
        phoneNumber: driver.user.phoneNumber,
      },
      currentVehicle: {
        vehicleName: driver.currentVehicle.vehicleName,
      },
      coords: {
        lat: driver.driver.locationLatitude,
        lng: driver.driver.locationLongitude,
      },
      icon: {
        url: driver.driver.status
          ? '../../../assets/locationIcon.png'
          : '../../../assets/Artboard.png',
        scaledSize: {
          width: 60,
          height: 60,
        },
      },
    };

    if (event.target.checked) {
      this.driverMarkers.push(driverMarker);
      this.zoom = 16;
      this.center = driverMarker.coords;
    } else {
      this.driverMarkers = this.driverMarkers.filter(
        (marker) => marker.userInfo.name !== driverMarker.userInfo.name
      );
      this.zoom = 8;
    }

    // Update the driver's checked state in allDrivers_Data
    const drivers = this.allDrivers_Data().map((d: any) =>
      d.driver.id === driver.driver.id
        ? { ...d, isChecked: event.target.checked }
        : d
    );
    this.allDrivers_Data.set(drivers);
  }

  getDriversOnMap() {
    this.mapService.getDriversOnTheMap().subscribe({
      next: (res: any): void => {
        const currentDrivers = this.allDrivers_Data();
        // Merge the new data with existing to retain checked state
        const updatedDrivers = res.data.map((response: any) => {
          // Find existing driver by id
          const existingDriver = currentDrivers.find(
            (d: any) => d.driver.id === response.driver.id
          );
          // Preserve the `isChecked` state
          const isChecked = existingDriver ? existingDriver.isChecked : false;
          return { ...response, isChecked };
        });

        this.allDrivers_Data.set(updatedDrivers);
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
    const isChecked = event.target.checked;

    // Update all checkboxes based on the main checkbox state
    const drivers = this.allDrivers_Data().map((item: any) => ({
      ...item,
      isChecked,
    }));

    this.allDrivers_Data.set(drivers);

    if (isChecked) {
      // Add markers for all drivers
      drivers.forEach((item: any) => {
        const driverMarker = {
          userInfo: {
            name: item.user.fullName,
            status: item.driver.status,
            image: item.user.picture,
          },
          coords: {
            lat: item.driver.locationLatitude,
            lng: item.driver.locationLongitude,
          },
          icon: {
            url: item.driver.status
              ? '../../../assets/locationIcon.png'
              : '../../../assets/Artboard.png',
            scaledSize: {
              width: 60,
              height: 60,
            },
          },
        };
        this.driverMarkers.push(driverMarker);
      });
    } else {
      // Clear all markers
      this.driverMarkers = [];
    }
  }

  refreshDriverMarkers() {
    // This function will be called every 5 seconds
    console.log('Refreshing driver markers...');

    // Logic to refresh driver markers, preserving checked states
    const drivers = this.allDrivers_Data().map((driver: any) => {
      // Maintain current checked state
      const isChecked = driver.isChecked;

      if (isChecked) {
        // Ensure markers are correctly updated if checked
        const driverMarker = {
          userInfo: {
            name: driver.user.fullName,
            status: driver.driver.status,
            image: driver.user.picture,
            phoneNumber: driver.user.phoneNumber,
          },
          currentVehicle: {
            vehicleName: driver.currentVehicle.vehicleName,
          },
          coords: {
            lat: driver.driver.locationLatitude,
            lng: driver.driver.locationLongitude,
          },
          icon: {
            url: driver.driver.status
              ? '../../../assets/locationIcon.png'
              : '../../../assets/Artboard.png',
            scaledSize: {
              width: 60,
              height: 60,
            },
          },
        };

        if (
          !this.driverMarkers.some(
            (m) => m.userInfo.name === driverMarker.userInfo.name
          )
        ) {
          this.driverMarkers.push(driverMarker);
        }
      }

      return driver;
    });

    // Update the signal
    this.allDrivers_Data.set(drivers);
  }

  // selectedItem(item: any) {
  //   this.driverMarkers = [];
  //   this.driverMarkers.push({
  //     coords: {
  //       lat: item.driver.locationLatitude,
  //       lng: item.driver.locationLongitude,
  //     },
  //     icon: {
  //       url: '../../../assets/locationIcon.png',
  //       scaledSize: {
  //         width: 60,
  //         height: 60,
  //       },
  //     },
  //   });
  // }
  getInfoWindow(marker: any, driver: any) {
    this.infoWindow.open(marker);
  }
  checkboxRowEvent(event: any, item: Drivers) {}
  get imageUrl() {
    return this.imgUrl;
  }
  get allDrivers() {
    return this.allDrivers_Data();
  }
  ngOnDestroy() {
    // Clear the interval when the component is destroyed to prevent memory leaks
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
