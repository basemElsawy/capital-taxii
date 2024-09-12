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
import { environment } from '../../../environments/environment.development';
import { env } from 'process';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../Core/Services/translation.service';

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
  lang!: string;
  driverDetails = signal([]);
  testArray: string[] = ['1', '2', '3', '4'];
  // allDrivers: any[] = [];
  allDrivers_Data: any = signal([]);
  address: any;
  selectedProducts: any;
  selectedDriver: any = null; // To hold the selected driver data
  public readonly imgUrl = environment.image;

  constructor(
    private vehicleServices: VehicleService,
    private mapService: MapServiceService,
    private translate: TranslateService,
    private translationService: TranslationService
  ) {}
  ngOnInit(): void {
    this.getCurrentPosition();
    // this.getAllDrivers();
    this.getDriversOnMap();
    this.languageSetter();
    // setInterval(() => {
    // }, 1000);
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
      return;
    }
    this.driverMarkers.splice(driver.id, 1);
    this.zoom = 8;

    return;
  }

  getDriversOnMap() {
    this.mapService.getDriversOnTheMap().subscribe({
      next: (res: any): void => {
        this.allDrivers_Data.set(
          res.data.map((response: any) => ({ ...response, isChecked: false }))
        );

        let mappedResponse = res.data.map(
          (responseItem: any): DriversMarkers => {
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
          }
        );
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
    debugger;

    if (event.target.checked) {
      this.allDrivers_Data().forEach((item: any) => {
        item.isChecked = true;
        // console.log(item);
        this.zoom = 8;
        driverMarker = {
          userInfo: {
            name: item?.user.fullName,
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
        console.log(this.driverMarkers);
      });
      return;
    }
    this.allDrivers_Data().forEach((item: Drivers) => {
      item.isChecked = false;
      this.driverMarkers = [];
    });
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
}
