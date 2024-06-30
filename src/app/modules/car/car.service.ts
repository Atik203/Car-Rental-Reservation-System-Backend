import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import { Booking } from '../booking/booking.model';
import { TCar, TReturnCar } from './car.interface';
import { Car } from './car.model';
import { calculateTotalCost } from './car.utils';

const createCarIntoDB = async (car: Partial<TCar>) => {
  const result = await Car.create(car);
  return result;
};

const getAllCarsFromDB = async () => {
  const cars = await Car.find({
    isDeleted: false,
  });
  return cars;
};

const getSingleCarFromDB = async (id: string) => {
  if ((await Car.isCarExistById(id)) === false) {
    throw new AppError(httpStatus.NOT_FOUND, 'Car not found');
  }

  if ((await Car.isCarDeleted(id)) === true) {
    throw new AppError(httpStatus.NOT_FOUND, 'Car not found');
  }

  const car = await Car.findById(id);
  return car;
};

const updateCarInDB = async (id: string, car: Partial<TCar>) => {
  if (!(await Car.isCarExistById(id))) {
    throw new AppError(httpStatus.NOT_FOUND, 'Car not found');
  }

  if (await Car.isCarDeleted(id)) {
    throw new AppError(httpStatus.NOT_FOUND, 'Car not found');
  }

  const {
    features,
    ...remainingData
  }: { features?: Array<string>; [key: string]: unknown } = car;

  if (features) {
    // Build the $set update query for each feature index
    features.forEach((feature, index) => {
      remainingData[`features.${index}`] = feature;
    });
  }

  // Update the car with the merged data
  const updatedCar = await Car.findByIdAndUpdate(
    id,
    { $set: remainingData },
    { new: true },
  );
  return updatedCar;
};

const deleteCarFromDB = async (id: string) => {
  if (!(await Car.isCarExistById(id))) {
    throw new AppError(httpStatus.NOT_FOUND, 'Car not found');
  }

  if (await Car.isCarDeleted(id)) {
    throw new AppError(httpStatus.NOT_FOUND, 'Car not found');
  }

  if (await Car.isCarAvailable(id)) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      'Car is currently available, can not delete',
    );
  }

  const deletedCar = await Car.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return deletedCar;
};

const returnCarFromDB = async (payload: TReturnCar) => {
  const session = await Car.startSession();

  try {
    session.startTransaction();
    const { bookingId, endTime } = payload;

    // Check if booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
    }

    // Check if booking is already returned
    if (booking.endTime) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Car already returned');
    }

    // Get the car details
    const carDetails = await Car.findById(booking.car);
    if (!carDetails) {
      throw new AppError(httpStatus.NOT_FOUND, 'Car not found');
    }

    // Calculate total cost
    const totalCost = calculateTotalCost(
      booking.startTime,
      endTime,
      carDetails.pricePerHour,
    );

    // Update car status
    const updatedCar = await Car.findByIdAndUpdate(
      booking.car,
      { status: 'available' },
      { session, runValidators: true, new: true },
    );

    if (!updatedCar) {
      throw new AppError(httpStatus.NOT_FOUND, 'Car not found');
    }

    // Update booking details
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { endTime, totalCost },
      { session, runValidators: true, new: true },
    );

    if (!updatedBooking) {
      throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
    }
    await session.commitTransaction();
    await session.endSession();

    // Get the updated booking details with populated user and car details
    const result = await Booking.findById(bookingId)
      .populate('user')
      .populate('car');

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      (error as Error).message,
    );
  }
};

export const carService = {
  createCarIntoDB,
  getAllCarsFromDB,
  getSingleCarFromDB,
  updateCarInDB,
  deleteCarFromDB,
  returnCarFromDB,
};
