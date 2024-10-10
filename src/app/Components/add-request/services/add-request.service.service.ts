import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddRequestService {
  baseUrl = environment.base_url;

  constructor(private http: HttpClient) {}

  getAllVehicleServiceTypes(): Observable<any> {
    return this.http.get(`${this.baseUrl}VehicleServiceType`);
  }

  // Get drivers based on vehicle service type
  getDriversByVehicleServiceType(id: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}RequestRoute/get-drivers-by-vehicle-service-type?vehicleServiceTypeId=${id}`
    );
  }

  // Save request
  saveRequest(requestData: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}RequestRoute/create-trip-by-admin`,
      requestData
    );
  }
}
