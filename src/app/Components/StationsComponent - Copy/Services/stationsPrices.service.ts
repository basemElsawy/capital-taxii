import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class StationsService {
  base_url = environment.base_url;
  constructor(private httpClient: HttpClient) {}
  getAllStationPrices() {
    return this.httpClient.get(`${this.base_url}StationPrice`);
  }
  addNewStationPrice(station: any) {
    return this.httpClient.post(`${this.base_url}StationPrice`, station);
  }
  updateStationPrice(station: any) {
    return this.httpClient.put(`${this.base_url}StationPrice`, station);
  }
  getAllStations() {
    return this.httpClient.get(`${this.base_url}Station`);
  }
}
