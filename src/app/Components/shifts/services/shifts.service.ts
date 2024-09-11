import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class ShiftsService {
  baseUrl = environment.base_url;

  constructor(private http: HttpClient) {}

  getOpenShifts(fromDate: string, toDate: string) {
    return this.http.get(
      this.baseUrl +
        `Shift/shift-details?from=${fromDate}&to=${toDate}&isOpen=true`
    );
  }
  getClosedShifts(fromDate: string, toDate: string) {
    return this.http.get(
      this.baseUrl +
        `Shift/shift-details?from=${fromDate}&to=${toDate}&isOpen=false`
    );
  }
}
