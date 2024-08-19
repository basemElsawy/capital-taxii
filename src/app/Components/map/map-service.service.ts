import { Injectable } from '@angular/core';
import { error } from 'console';

@Injectable({
  providedIn: 'root',
})
export class MapServiceService {
  constructor() {}

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
}
