import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule, CommonModule, TableModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {
  center: google.maps.LatLngLiteral = { lat: 46.8182, lng: 8.2275 }; // Center of Switzerland
  zoom = 8;
  products: any[] = [
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
    },
  ];

  selectedProducts: any;

  ngOnInit(): void {
    console.log(this.products);
  }
}
