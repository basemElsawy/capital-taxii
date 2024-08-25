import { environment } from '../../../environments/environment.development';

export class DriversApiEndpoints {
  static baseUrl: string = environment.base_url;

  static addDriverUser: string = this.baseUrl + 'User/register';

  static getAllDriversEndpoint: string =
    this.baseUrl + 'Driver/get-all-drivers';
  static nationalitiesEndpoint: string = this.baseUrl + 'Nationality';
}
