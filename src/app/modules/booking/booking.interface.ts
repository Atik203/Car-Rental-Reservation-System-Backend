import { Types } from 'mongoose';

export interface TBooking {
  user: Types.ObjectId;
  car: Types.ObjectId;
  date: Date;
  startTime: Date; // 24 hour format (HH:MM)
  endTime: Date;
  totalCost: number;
}
