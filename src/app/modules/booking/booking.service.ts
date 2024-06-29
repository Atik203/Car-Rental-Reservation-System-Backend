import httpStatus from 'http-status';
import { ObjectId } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../Errors/AppError';
import { Car } from '../car/car.model';
import { User } from '../user/user.model';
import { TBooking } from './booking.interface';
import { Booking } from './booking.model';

const createBookingIntoDB = async (
  email: string,
  payload: Record<string, unknown>,
) => {
  const session = await Booking.startSession();

  try {
    session.startTransaction();
    // check if the user exists in the database
    if (!(await User.isUserExistByEmail(email))) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    // get the user id
    const user = await User.findOne({ email }).select('_id');

    const { carId } = payload;

    // check if the car exists in the database

    if (!(await Car.isCarExistById(carId as string))) {
      throw new AppError(httpStatus.NOT_FOUND, 'Car not found');
    }

    // check if the car is available

    if (!(await Car.isCarAvailable(carId as string))) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Car is not available');
    }

    // check if the car is deleted

    if (await Car.isCarDeleted(carId as string)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Car is not found');
    }

    // create the booking data

    const bookingData = {
      ...payload,
      car: carId,
    };

    // change the car status to unavailable

    await Car.findOneAndUpdate(
      { _id: carId },
      { status: 'unavailable' },
      { session, runValidators: true },
    );

    // create the booking

    const booking = (await Booking.create(
      {
        ...bookingData,
        user: user?._id,
      },
      { session },
    )) as unknown as TBooking & { _id: ObjectId };

    // get the booking with user and car populated

    const result = await Booking.findById(booking._id)
      .populate('user')
      .populate('car');

    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, (error as Error).message);
  }
};

const getAllBookingsFromDB = async (query: Record<string, unknown>) => {
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
