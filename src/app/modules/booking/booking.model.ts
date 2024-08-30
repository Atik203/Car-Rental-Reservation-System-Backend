import { model, Schema } from 'mongoose';
import { BookingModel, TBooking } from './booking.interface';

const bookingSchema = new Schema<TBooking, BookingModel>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  car: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, default: null },
  totalCost: { type: Number, default: 0 },
});

bookingSchema.statics.isBookingExistById = async function (id: string) {
  const booking = await this.findById(id);
  return booking;
};

export const Booking = model<TBooking, BookingModel>('Booking', bookingSchema);
