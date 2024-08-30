import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../Errors/AppError';
import { Car } from '../car/car.model';
import { User } from '../user/user.model';
import { Booking } from './booking.model';

const createBookingIntoDB = async (
  email: string,
  payload: Record<string, unknown>,
) => {
  const session = await Booking.startSession();

  try {
    session.startTransaction();

    // Check if the user exists in the database
    if (!(await User.isUserExistByEmail(email))) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Get the user id
    const user = await User.findOne({ email }).select('_id');

    const { carId, date, startTime } = payload;

    // Check if the car exists in the database
    if (!(await Car.isCarExistById(carId as string))) {
      throw new AppError(httpStatus.NOT_FOUND, 'Car not found');
    }

    // Check if the car is available
    if (!(await Car.isCarAvailable(carId as string))) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Car is not available');
    }

    // Check if the car is deleted
    if (await Car.isCarDeleted(carId as string)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Car is not found');
    }

    // update the car status to unavailable

    await Car.findByIdAndUpdate(carId, { status: 'unavailable' }, { session });

    // Create the booking data
    const bookingData = {
      car: carId,
      date: date as string,
      startTime: startTime as string,
      user: user?._id,
    };

    // Create the booking
    const booking = await Booking.create([bookingData], {
      session,
    });

    await session.commitTransaction();
    session.endSession();
    const bookingId = booking[0]._id;
    // Get the booking with user and car populated
    const result = await Booking.findById(bookingId)
      .populate('user')
      .populate('car');
    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, (error as Error).message);
  }
};

const getAllBookingsFromDB = async (query: Record<string, unknown>) => {
  if (query.carId) {
    const carId = query.carId as string;

    if (!(await Car.isCarExistById(carId as string))) {
      throw new AppError(httpStatus.NOT_FOUND, 'Car not found');
    }

    if (await Car.isCarDeleted(carId as string)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Car is not found');
    }
  }

  const bookingQuery = new QueryBuilder(
    Booking.find().populate('user').populate('car'),
    query,
  )
    .filterByCarId()
    .filterByCarIdAndDate();

  const result = await bookingQuery.modelQuery;

  return result;
};

const getMyBookingsFromDB = async (email: string) => {
  const user = await User.findOne({ email }).select('_id');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const bookings = await Booking.find({ user: user._id })
    .populate('user')
    .populate('car');

  if (bookings.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'No bookings found');
  }

  return bookings;
};

export const bookingService = {
  createBookingIntoDB,
  getAllBookingsFromDB,
  getMyBookingsFromDB,
};
