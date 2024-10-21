import { environment } from '../../../environments/environment.development';

export class DriversApiEndpoints {
  static baseUrl: string = environment.base_url;

  static addDriverUser: string = this.baseUrl + 'User/registerDriver';
  static getTripDetails: string =
    this.baseUrl + 'RequestRoute/get-driver-requests-details/';
  static getAllDriversEndpoint: string =
    this.baseUrl + 'Driver/get-all-drivers';
  static updateDriversEndpoint: string = this.baseUrl + 'User/update';
  static deleteDriverEndpoint: string = this.baseUrl + 'User/delete-user-async';
  static nationalitiesEndpoint: string = this.baseUrl + 'Nationality';
}
