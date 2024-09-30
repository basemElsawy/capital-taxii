import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class UserManagementSystemService {
  baseUrl = environment.base_url;

  constructor(private http: HttpClient) {}

  getDriversCommission(body: any) {
    return this.http.post(`${this.baseUrl}Driver/get-drivers-commission`, body);
  }

  getAllDrivers(page: number, size: number) {
    return this.http.get(
      `${this.baseUrl}Driver/get-all-drivers?pageNumber=${page}&pageSize=${size}`
    );
  }
}
