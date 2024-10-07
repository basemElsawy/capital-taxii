import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ZonesService {
  base_url = environment.base_url;
  constructor(private httpClient: HttpClient) {}

  addNewZone(zone: any) {
    return this.httpClient.post(`${this.base_url}Zone/add-zone`, zone);
  }
  updateZone(zone: any) {
    return this.httpClient.put(`${this.base_url}Zone/update-zone-status`, zone);
  }
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
  getAllZones() {
    return this.httpClient.get(`${this.base_url}Zone/get-all-zones`);
  }
}
