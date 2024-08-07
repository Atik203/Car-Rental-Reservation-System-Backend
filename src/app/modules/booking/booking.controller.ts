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

const getAllBookings = catchAsync(async (req, res) => {
  const bookings = await bookingService.getAllBookingsFromDB(req.query);

  if (bookings.length === 0) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: 'No data found',
      data: bookings,
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Bookings retrieved successfully',
    data: bookings,
  });
});

const getMyBookings = catchAsync(async (req, res) => {
  const email = req.user.email;
  const bookings = await bookingService.getMyBookingsFromDB(email);
  if (bookings.length === 0) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: 'No data found',
      data: bookings,
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Bookings retrieved successfully',
    data: bookings,
  });
});

export const bookingController = {
  createBooking,
  getAllBookings,
  getMyBookings,
};
