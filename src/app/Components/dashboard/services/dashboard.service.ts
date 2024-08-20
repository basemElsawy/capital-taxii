import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  baseUrl = environment.base_url;

  constructor(private http: HttpClient) {}

  getAllDashboardData() {
    return this.http.get(this.baseUrl + 'RequestRoute/trips-details');
  }

  getAllDrivers(pageNumber: any, pageSize: any) {
    return this.http.get(
      this.baseUrl +
        `Driver/get-all-drivers?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }
}
