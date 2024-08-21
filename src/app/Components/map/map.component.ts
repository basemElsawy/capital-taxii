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
  driverMarkers!: any[];
  driverDetails = signal([]);
  testArray: string[] = ['1', '2', '3', '4'];
  products: Drivers[] = [
    {
      id: 1,
      personInfo: {
        img: '../../../assets/profile_photo.png',
        name: 'linda ferguson',
        number: 2132324913,
      },
      carType: 'BMW',
      orderedTime: '04.12.2021 20:30',
      startLocation: '9 Street Alma’adi , Metro , Cairo',
      finishLocation: '120 Street Alma’adi , Metro , Cairo',
      income: '500',
      isChecked: false,
    },
    {
      id: 1,
      personInfo: {
        img: '../../../assets/profile_photo.png',
        name: 'linda ferguson',
        number: 2132324913,
      },
      carType: 'BMW',
      orderedTime: '04.12.2021 20:30',
      startLocation: '9 Street Alma’adi , Metro , Cairo',
      finishLocation: '120 Street Alma’adi , Metro , Cairo',
      income: '500',
      isChecked: false,
    },
    {
      id: 1,
      personInfo: {
        img: '../../../assets/profile_photo.png',
        name: 'linda ferguson',
        number: 2132324913,
      },
      carType: 'BMW',
      orderedTime: '04.12.2021 20:30',
      startLocation: '9 Street Alma’adi , Metro , Cairo',
      finishLocation: '120 Street Alma’adi , Metro , Cairo',
      income: '500',
      isChecked: false,
    },
    {
      id: 1,
      personInfo: {
        img: '../../../assets/profile_photo.png',
        name: 'linda ferguson',
        number: 2132324913,
      },
      carType: 'BMW',
      orderedTime: '04.12.2021 20:30',
      startLocation: '9 Street Alma’adi , Metro , Cairo',
      finishLocation: '120 Street Alma’adi , Metro , Cairo',
      income: '500',
      isChecked: false,
    },
    {
      id: 1,
      personInfo: {
        img: '../../../assets/profile_photo.png',
        name: 'linda ferguson',
        number: 2132324913,
      },
      carType: 'BMW',
      orderedTime: '04.12.2021 20:30',
      startLocation: '9 Street Alma’adi , Metro , Cairo',
      finishLocation: '120 Street Alma’adi , Metro , Cairo',
      income: '500',
      isChecked: false,
    },
  ];

  selectedProducts: any;
  constructor(private mapService: MapServiceService) {}
  ngOnInit(): void {
    this.getCurrentPosition();

    this.getDriversOnMap();
    // setInterval(() => {
    // }, 1000);
  }

  getDriversOnMap() {
    this.mapService.getDriversOnTheMap(2).subscribe({
      next: (res: any): void => {
        let mappedResponse = res.map((responseItem: any): DriversMarkers => {
          const {
            driver: { id, locationLongitude: lng, locationLatitude: lat, user },
          } = responseItem;

          return {
            id,
            driverName: user.fullName || 'محمد صادق', // Use the name from the response or a fallback
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
        this.driverMarkers = mappedResponse;
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
    if (isAllChecked) {
      this.products.forEach((item: Drivers) => {
        item.isChecked = true;
      });
      return;
    }
    this.products.forEach((item: Drivers) => {
      item.isChecked = false;
    });
  }
  getInfoWindow(marker: any, driver: any) {
    this.infoWindow.open(marker);
  }
  checkboxRowEvent(event: any, item: Drivers) {}
}
