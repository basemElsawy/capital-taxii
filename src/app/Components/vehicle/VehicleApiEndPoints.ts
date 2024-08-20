import { environment } from '../../../environments/environment.development';

export class VehiclesApiEndpoints {
  static baseUrl: string = environment.base_url;

  static getAllVehiclesEndPoint: string = this.baseUrl + 'Vehicle';
}
