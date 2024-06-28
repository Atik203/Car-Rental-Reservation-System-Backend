import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { carService } from './car.service';

const createCar = catchAsync(async (req, res) => {
  const result = await carService.createCarIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Car created successfully',
    data: result,
  });
});

const getAllCars = catchAsync(async (req, res) => {
  const result = await carService.getAllCarsFromDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Cars retrieved successfully',
    data: result,
  });
});

const getSingleCar = catchAsync(async (req, res) => {
  const result = await carService.getSingleCarFromDB(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Car retrieved successfully',
    data: result,
  });
});

const updateCar = catchAsync(async (req, res) => {
  const result = await carService.updateCarInDB(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Car updated successfully',
    data: result,
  });
});

export const carController = {
  createCar,
  getAllCars,
  getSingleCar,
  updateCar,
};
