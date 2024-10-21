import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { DriversApiEndpoints } from '../../Drivers/DriversApiEndPoints';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  baseUrl = environment.base_url;
  constructor(private http: HttpClient) {}
  getAllClientsTripsWithinDateRange(id: number, dateObject: any) {
    dateObject = {
      startDate: this.formatDate(dateObject?.startDate),
      endDate: this.formatDate(dateObject?.endDate),
    };
    let newRequestUrl = new URLSearchParams(dateObject);
    let requestUrl: string =
      this.baseUrl + `RequestRoute/get-customer-requests-details/${id}?`;
    requestUrl = requestUrl + newRequestUrl;

    return this.http.get(requestUrl);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
  getAllClients() {
    return this.http.get(this.baseUrl + 'User/Customers');
  }
  getCreditDetailsByUserId(userId: number) {
    return this.http.get(this.baseUrl + `Credit/user-credit-details/${userId}`);
  }
  getAllNationalities() {
    return this.http.get(this.baseUrl + 'Nationality');
  }

  updateClient(body: any) {
    return this.http.put(this.baseUrl + 'User/update', body);
  }
  getOrdinalSuffix(day: number) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }
  verbalDateFormatter(dateToFormat: string | Date) {
    let date = new Date(dateToFormat);
    let month = date.toLocaleString('en-US', { month: 'short' });
    let day = date.toLocaleString('en-US', { day: 'numeric' });
    let numericDate = date.getDate();
    return `${month} ${day}${this.getOrdinalSuffix(numericDate)}`;
  }
}
