import { Model, Types } from 'mongoose';

export interface TBooking {
  user: Types.ObjectId;
  car: Types.ObjectId;
  date: string; // YYYY-MM-DD
  startTime: string; // 24 hour format (HH:MM)
  endTime: string; // 24 hour format (HH:MM)
  totalCost: number;
}

export interface BookingModel extends Model<TBooking> {
  // eslint-disable-next-line no-unused-vars
  isBookingExistById: (id: string) => Promise<TBooking>;
}
