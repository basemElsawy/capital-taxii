import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  baseUrl = environment.base_url;
  constructor(private http: HttpClient) {}

  getAllClients() {
    return this.http.get(this.baseUrl + 'User/Customers');
  }

  getAllNationalities() {
    return this.http.get(this.baseUrl + 'Nationality');
  }
}
