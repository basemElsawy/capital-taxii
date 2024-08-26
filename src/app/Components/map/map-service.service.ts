import { VehicleService } from './../vehicle/Services/vehicle.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MapApis } from './MapApis';

@Injectable({
  providedIn: 'root',
})
export class MapServiceService {
  constructor(private httpClient: HttpClient) {}

  getCurrentLocation() {
    let geolocation = navigator.geolocation;
    return new Promise((resolve, reject) => {
      try {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position),
          (error) => reject(error)
        );
      } catch (err) {
        reject(new Error('Geolocation is not supported in this browser'));
      }
    });
  }

  getDriversOnTheMap(statusId: any) {
    return this.httpClient.get(MapApis.getAllDriversEndPoint + `${statusId}`);
  }
}
