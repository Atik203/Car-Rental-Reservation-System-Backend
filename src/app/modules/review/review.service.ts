import { TReview } from './review.interface';
import { Review } from './review.model';

const getCarReview = async (carId: string) => {
  const review = await Review.find({ car: carId }).populate(
    'user',
    'name email image',
  );

  return review;
};

const createReview = async (review: TReview) => {
  const newReview = await Review.create(review);

  return newReview;
};

export const reviewService = {
  getCarReview,
  createReview,
};
