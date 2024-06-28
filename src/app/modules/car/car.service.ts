import httpStatus from 'http-status';
import AppError from '../../Errors/AppError';
import { TCar } from './car.interface';
import { Car } from './car.model';

const createCarIntoDB = async (car: Partial<TCar>) => {
  const result = await Car.create(car);
  return result;
};

const getAllCarsFromDB = async () => {
  const cars = await Car.find();
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

  const deletedCar = await Car.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return deletedCar;
};

export const carService = {
  createCarIntoDB,
  getAllCarsFromDB,
  getSingleCarFromDB,
  updateCarInDB,
  deleteCarFromDB,
};
