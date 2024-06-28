import { Types } from 'mongoose';

export interface TBooking {
  user: Types.ObjectId;
  car: Types.ObjectId;
  date: string; // YYYY-MM-DD
  startTime: string; // 24 hour format (HH:MM)
  endTime: string; // 24 hour format (HH:MM)
  totalCost: number;
}
