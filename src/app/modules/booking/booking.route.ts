import express from 'express';
import { auth } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { bookingController } from './booking.controller';
import { createBookingValidationSchema } from './booking.zod.validation';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.user),
  validateRequest(createBookingValidationSchema),
  bookingController.createBooking,
);

router.get('/', auth(USER_ROLE.admin), bookingController.getAllBookings);

router.get(
  '/my-bookings',
  auth(USER_ROLE.user),
  bookingController.getMyBookings,
);

export const bookingRoutes = router;
