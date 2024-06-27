import express from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { signUpValidationSchema } from '../user/user.zod.validation';
import { authController } from './auth.controller';
import {
  refreshTokenValidationSchema,
  signInValidationSchema,
} from './auth.zod.validation';

const router = express.Router();

router.post(
  '/signup',
  validateRequest(signUpValidationSchema),
  authController.signUpUser,
);

router.post(
  '/signin',
  validateRequest(signInValidationSchema),
  authController.signInUser,
);

router.post(
  '/refresh-token',
  validateRequest(refreshTokenValidationSchema),
  authController.refreshToken,
);

export const authRoutes = router;
