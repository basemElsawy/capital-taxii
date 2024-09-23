import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  baseUrl = environment.base_url;
  constructor(private http: HttpClient) {}

  addPermission(body: any) {
    return this.http.post(this.baseUrl + 'Permission', body);
  }

  getPermissions() {
    return this.http.get(this.baseUrl + 'Permission');
  }
}
