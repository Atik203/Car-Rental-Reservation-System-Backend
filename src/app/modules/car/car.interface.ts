/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export interface TCar {
  name: string;
  description: string;
  color: string;
  isElectric: boolean;
  pricePerHour: number;
  status: 'available' | 'unavailable';
  features: string[];
  isDeleted: boolean;
  image: string;
}

export interface CarModel extends Model<TCar> {
  isCarExistById: (id: string) => Promise<boolean>;
  isCarAvailable: (id: string) => Promise<boolean>;
  isCarDeleted: (id: string) => Promise<boolean>;
}

export type TReturnCar = {
  bookingId: string;
  endTime: string;
};
