import { environment } from '../../../environments/environment.development';

export class VehiclesApiEndpoints {
  static baseUrl: string = environment.base_url;

  static getAllVehiclesEndPoint: string = this.baseUrl + 'Vehicle';
  static nationalitiesEndpoint: string = this.baseUrl + 'Nationality';
}
