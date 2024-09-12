import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class PriceService {
  baseUrl = environment.base_url;

  constructor(private http: HttpClient) {}

  getRequestLimitDistance() {
    return this.http.get(this.baseUrl + 'RequestDistanceLimit');
  }
  getDriverArrivalMinDistance() {
    return this.http.get(this.baseUrl + 'DriverArrivalMinDistance');
  }
  getRequestTimeLimit() {
    return this.http.get(this.baseUrl + 'FinePhases');
  }
  updateRequestLimitDistance(body: any) {
    return this.http.put(this.baseUrl + 'RequestDistanceLimit', body);
  }
  updateDriverArrivalMinDistance(body: any) {
    return this.http.put(this.baseUrl + 'DriverArrivalMinDistance', body);
  }
  updateRequestTimeLimit(body: any) {
    return this.http.put(this.baseUrl + 'FinePhases', body);
  }
  getKMPrice() {
    return this.http.get(this.baseUrl + 'KmPrice');
  }

  updateKMPrice(body: any) {
    return this.http.put(this.baseUrl + 'KmPrice', body);
  }
  updateTaxiCounterFees(body: any) {
    return this.http.put(this.baseUrl + 'TripStartFees', body);
  }
  getTaxiCounterFees() {
    return this.http.get(this.baseUrl + 'TripStartFees');
  }

  getMinimumFares() {
    return this.http.get(this.baseUrl + 'MinimumFare');
  }

  updateMinimumFares(body: any) {
    return this.http.put(this.baseUrl + 'MinimumFare', body);
  }

  getDeductions() {
    return this.http.get(this.baseUrl + 'Deduction');
  }

  updateDeductions(body: any) {
    return this.http.put(this.baseUrl + 'Deduction', body);
  }
}
