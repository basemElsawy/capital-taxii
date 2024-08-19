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
