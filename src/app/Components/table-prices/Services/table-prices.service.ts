import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TablePricesService {
  base_url = environment.base_url;
  constructor(private httpClient: HttpClient) {}
  getAllTablePrices() {
    return this.httpClient.get(`${this.base_url}KilometrePrice`);
  }
  addNewTablePrice(tablePrice: any) {
    return this.httpClient.post(`${this.base_url}KilometrePrice`, tablePrice);
  }
  getAllTablePricsDetails() {
    return this.httpClient.get(`${this.base_url}KilometrePriceDetails`);
  }
  addTablePriceDetails(tablePriceDetails: any) {
    return this.httpClient.post(
      `${this.base_url}KilometrePriceDetails`,
      tablePriceDetails
    );
  }
  getAllVehicleServiceType() {
    return this.httpClient.get(`${this.base_url}VehicleServiceType`);
  }
  // updateTablePrice(station: any) {
  //   return this.httpClient.put(`${this.base_url}StationPrice`, station);
  // }
  // getAllStations() {
  //   return this.httpClient.get(`${this.base_url}Station`);
  // }
}
