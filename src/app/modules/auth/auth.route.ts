import express from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { authController } from './auth.controller';
import {
  loginValidationSchema,
  refreshTokenValidationSchema,
} from './auth.zod.validation';

const router = express.Router();

router.post(
  '/login',
  validateRequest(loginValidationSchema),
  authController.loginUser,
);

router.post(
  '/refresh-token',
  validateRequest(refreshTokenValidationSchema),
  authController.refreshToken,
);

export const authRoutes = router;
