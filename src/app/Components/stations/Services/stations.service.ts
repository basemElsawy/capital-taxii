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
  getAllStations() {
    return this.httpClient.get(`${this.base_url}Station`);
  }
  addNewStation(station: any) {
    return this.httpClient.post(`${this.base_url}Station`, station);
  }
  updateStation(station: any) {
    return this.httpClient.put(`${this.base_url}Station`, station);
  }
}
