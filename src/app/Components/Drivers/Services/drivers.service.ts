import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DriversApiEndpoints } from '../DriversApiEndPoints';
import { map, Observable } from 'rxjs';
import { Coords } from '../IDrivers';
import { AutoFocusModule } from 'primeng/autofocus';

@Injectable({
  providedIn: 'root',
})
export class DriversService {
  constructor(private httpClient: HttpClient) {}
  getAllNationalities() {
    return this.httpClient.get(DriversApiEndpoints.nationalitiesEndpoint);
  }
  gettingLocationAddress(coords: Coords, locationCollection: any[]) {
    const geoCoder = new google.maps.Geocoder();

    geoCoder.geocode({ location: coords }, (results: any, status: any) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          locationCollection.push(results[0].formatted_address);
        } else {
          console.log('No results found');
        }
      } else {
        console.error('Geocoder failed due to:', status);
      }
    });
  }
  getAllDrivers() {
    return this.httpClient.get(DriversApiEndpoints.getAllDriversEndpoint).pipe(
      map((data: any) => {
        return Array.isArray(data)
          ? data.map((res: any) => ({ res, isChecked: false }))
          : {
              items: data.items.map((res: any) => ({ res, isChecked: false })),
              pageSize: data.pageSize,
              pageNumber: data.pageNumber,
              totalRecords: data.totalRecords,
            };
      })
    );
  }
}
