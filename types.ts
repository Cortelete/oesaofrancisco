
export enum ModalType {
  ABOUT = 'ABOUT',
  APPOINTMENT = 'APPOINTPOINTMENT',
  AGE_WARNING = 'AGE_WARNING',
  RATING = 'RATING',
  FEEDBACK = 'FEEDBACK',
  LOCATION = 'LOCATION',
  DEV_CONTACT = 'DEV_CONTACT',
}

export interface AppointmentData {
  name: string;
  age: string;
  issue: string;
}
