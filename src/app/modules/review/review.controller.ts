import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { reviewService } from './review.service';

const getCarReview = catchAsync(async (req, res) => {
  const result = await reviewService.getCarReview(req.params.carId);

  sendResponse(res, {
    data: result,
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review fetched successfully',
  });
});

const createReview = catchAsync(async (req, res) => {
  const result = await reviewService.createReview(req.body);

  sendResponse(res, {
    data: result,
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Review created successfully',
  });
});

export const reviewController = {
  getCarReview,
  createReview,
};
