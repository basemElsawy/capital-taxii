import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PeakTimeService {
  base_url = environment.base_url;
  constructor(private httpClient: HttpClient) {}
  getAllWeekPeakTime() {
    return this.httpClient.get(
      `${this.base_url}PeakTime/get-all-week-peak-time`
    );
  }
  // addNewTablePrice(tablePrice: any) {
  //   return this.httpClient.post(`${this.base_url}KilometrePrice`, tablePrice);
  // }
  // getAllPeakTimesById(peakTimesById: any) {
  //   return this.httpClient.get(
  //     `${this.base_url}KilometrePriceDetails/get-kilometre-price-details-list/${peakTimesById}`
  //   );
  // }
  addPeakTime(peakTime: any) {
    return this.httpClient.put(
      `${this.base_url}PeakTime/adjust-week-peak-time`,
      peakTime
    );
  }
  getAllVehicleServiceType() {
    return this.httpClient.get(`${this.base_url}VehicleServiceType`);
  }
  getpeakTimesForDayByDayId(dayId: number) {
    return this.httpClient.get(
      `${this.base_url}PeakTime/get-week-peak-time/${dayId}`
    );
  }
  updatePeakTime(peakTimeData: any) {
    return this.httpClient.put(
      `${this.base_url}PeakTime/update-peak-time`,
      peakTimeData
    );
  }
  deletePeakTimeById(peakTimeId: number) {
    return this.httpClient.delete(
      `${this.base_url}PeakTime/delete-peak-time/${peakTimeId}`
    );
  }
  // getAllStations() {
  //   return this.httpClient.get(`${this.base_url}Station`);
  // }
}
