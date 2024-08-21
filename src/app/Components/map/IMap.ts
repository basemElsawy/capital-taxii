export interface PersonInfo {
  number: number;
  name: string;
  img: string;
}

export interface Drivers {
  id: number;
  personInfo: PersonInfo;
  carType: string;
  orderedTime: string;
  startLocation: string;
  finishLocation: string;
  income: string;
  isChecked?: boolean;
}

export interface DriverDetails {
  id: number;
  status: boolean;
  locationLatitude: number;
  locationLongitude: number;
}

export interface DriversMarkers {
  id: number;
  coords: {
    lat: number;
    lng: number;
  };
  driverName: string;
  driverTitle: string;
  driverImage: string;
  fromLocation?: number | string;
  toLocation?: number | string;
  icon?: {
    url?: string;
    scaledSize?: {
      width: number;
      height: number;
    };
  };
}

//  icon: {
// url: '../../assets/blue.png',
// scaledSize: {
//   width: 50,
//   height: 40,
// },
//   },
