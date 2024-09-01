import { environment } from '../../../environments/environment.development';

export class MapApis {
  static baseUrl: string = environment.base_url;

  static getAllDriversEndPoint: string =
    this.baseUrl + 'RequestRoute/Drivers-Live-Map';
  static getSingleDriversEndPoint: string =
    this.baseUrl + 'Driver/get-driver?driverId=';
}
