import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VehiclesApiEndpoints } from '../VehicleApiEndPoints';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  constructor(private httpClient: HttpClient) {}
  getAllDrivers() {
    return this.httpClient
      .get(VehiclesApiEndpoints.getAllVehiclesEndPoint)
      .pipe(
        map((data: any) => {
          console.log(data);
          return (
            Array.isArray(data) &&
            data.map((res: any) => ({ res, isChecked: false }))
          );
        })
      );
  }
}
