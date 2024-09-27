import express from 'express';
import { auth } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validateRequest';
import { reviewController } from './review.controller';
import { reviewValidationSchema } from './review.zod.validation';

const router = express.Router();

router.get('/:carId', auth('admin', 'user'), reviewController.getCarReview);

router.post(
  '/',
  auth('admin', 'user'),
  validateRequest(reviewValidationSchema),
  reviewController.createReview,
);

export const reviewRoutes = router;
