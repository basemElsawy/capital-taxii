import { environment } from '../../../environments/environment.development';

export class DriversApiEndpoints {
  static baseUrl: string = environment.base_url;

  static getAllDriversEndpoint: string =
    this.baseUrl + 'Driver/get-all-drivers';
}
