import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  baseUrl = environment.base_url;

  constructor(private http: HttpClient) {}

  getDriversCommission(body: any) {
    return this.http.post(`${this.baseUrl}Driver/get-drivers-commission`, body);
  }
  getRequestsPaymentMethod(body: any) {
    return this.http.get(
      `${this.baseUrl}RequestRoute/get-all-requests-payment-method-by-date?from=${body.from}&to=${body.to}`
    );
  }
  getRequestsStatus(body: any) {
    return this.http.get(
      `${this.baseUrl}RequestRoute/get-all-requests-request-status-by-date?from=${body.from}&to=${body.to}`
    );
  }
  getAllDrivers() {
    return this.http.get(`${this.baseUrl}Driver/get-all-drivers-only`);
  }
}
