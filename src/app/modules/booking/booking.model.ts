import { model, Schema } from 'mongoose';
import { TBooking } from './booking.interface';

const bookingSchema = new Schema<TBooking>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  car: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: Date, default: null },
  totalCost: { type: Number, default: 0 },
});

export const Booking = model<TBooking>('Booking', bookingSchema);
