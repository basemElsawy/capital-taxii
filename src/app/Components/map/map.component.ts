import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GoogleMapsModule, MapGeocoder } from '@angular/google-maps';
import { TableModule } from 'primeng/table';
import { Drivers } from './IMap';
import { MapServiceService } from './map-service.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule, CommonModule, TableModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {
  center!: google.maps.LatLngLiteral;
  zoom = 12;

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
  checkboxRowEvent(event: any, item: Drivers) {}
}
