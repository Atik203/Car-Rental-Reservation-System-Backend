import { Types } from 'mongoose';

export interface TBooking {
  user: Types.ObjectId;
  car: Types.ObjectId;
  date: string;
  startTime: string; // 24 hour format (HH:MM)
  endTime: Date;
  totalCost: number;
}
