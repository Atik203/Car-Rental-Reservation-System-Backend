import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { bookingService } from './booking.service';

const createBooking = catchAsync(async (req, res) => {
  const email = req.user.email;
  const bookingData = req.body;
  const booking = await bookingService.createBookingIntoDB(email, bookingData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Booking created successfully',
    data: booking,
  });
});

export const bookingController = {
  createBooking,
};
