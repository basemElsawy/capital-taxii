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
  getAllTablePricsDetailsById(tablePriceId: any) {
    return this.httpClient.get(
      `${this.base_url}KilometrePriceDetails/get-kilometre-price-details-list/${tablePriceId}`
    );
  }
  addTablePriceDetails(tablePriceDetails: any) {
    return this.httpClient.post(
      `${this.base_url}KilometrePriceDetails/add-kilometre-price-details-list`,
      tablePriceDetails
    );
  }
  getAllVehicleServiceType() {
    return this.httpClient.get(`${this.base_url}VehicleServiceType`);
  }
  updateTablePriceDetails(KilometrePriceDetails: any) {
    return this.httpClient.put(
      `${this.base_url}KilometrePriceDetails`,
      KilometrePriceDetails
    );
  }
  // getAllStations() {
  //   return this.httpClient.get(`${this.base_url}Station`);
  // }
}
